const { Router } = require("express");
const router = Router();
const Property = require("../models/property");
const Bid = require("../models/bid");

const insertProperties = async () => {
    try {
        await Property.insertMany(propertiesData);
        console.log("Properties inserted successfully");
    } catch (err) {
        console.error("Error inserting properties:", err);
        throw err; // Rethrow the error to propagate it to the route handler
    }
};

router.get("/addfew", async (req, res) => {
    console.log("Request Received");
    try {
        await insertProperties(); // Await the completion of the insert operation
        res.status(200).send("Properties inserted successfully");
    } catch (err) {
        res.status(500).send("Error inserting properties: " + err.message);
    }
});

router.get("/fetchall", async (req, res) => {
    console.log("Fetch Request received!");
    try {
        const properties = await Property.find(); // Fetch all documents from the Property collection
        res.status(200).json(properties); // Send the fetched data as JSON
    } catch (err) {
        console.error("Error fetching properties:", err);
        res.status(500).send("Error fetching properties: " + err.message);
    }
});

router.get("/fetchall/approved", async (req, res) => {
    console.log("Fetch Request received!");
    try {
        const properties = await Property.find({ status: "approved" });
        res.status(200).json(properties); // Send the fetched data as JSON
    } catch (err) {
        console.error("Error fetching properties:", err);
        res.status(500).send("Error fetching properties: " + err.message);
    }
});

router.get("/fetchall/pending", async (req, res) => {
    console.log("Fetch Request received!");
    try {
        const properties = await Property.find({ status: "pending" });
        res.status(200).json(properties); // Send the fetched data as JSON
    } catch (err) {
        console.error("Error fetching properties:", err);
        res.status(500).send("Error fetching properties: " + err.message);
    }
});

router.get("/approve/:id", async (req, res) => {
    console.log("Hello");
    try {
        const propertyId = req.params.id;
        await Property.findByIdAndUpdate(propertyId, { status: "approved" });
        res.status(200).json({ message: "Property approved successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error approving property" });
    }
});

router.get("/decline/:id", async (req, res) => {
    try {
        const propertyId = req.params.id;
        await Property.findByIdAndUpdate(propertyId, { status: "declined" });
        res.status(200).json({ message: "Property declined successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error declining property" });
    }
});

router.post("/register_new", async (req, res) => {
    console.log("Add request received!");

    try {
        const newProperty = new Property(req.body);
        await newProperty.save();
        res.status(201).json({ message: "Data saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving data", error });
    }
});

router.get("/details/:id", async (req, res) => {
    console.log("hie");
    const { id } = req.params;
    console.log("Received ID:", id);
    try {
        const property = await Property.findById(id);
        console.log("Property fetched:", property);
        if (!property) {
            console.log(property);
            return res.status(404).json({ error: "Property not found xoxo" });
        }
        res.json(property);
    } catch (err) {
        console.error("Error in findById:", err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/bid", async (req, res) => {
    const { user_id, property_id, price, token_count } = req.body;  // Use token_count
    console.log('Received data: ', user_id, property_id, price, token_count);

    try {
        if (!user_id || !property_id || !price || !token_count) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newBid = new Bid({ user_id, property_id, price, token_count });  // Correct field name
        
        await newBid.save();

        res.status(201).json({ message: "Bid placed successfully!", bid: newBid });
    } catch (error) {
        console.error("Error placing bid:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.get("/bids/:user_id", async (req, res) => {
    console.log('Property data request for user:', req.params.user_id);

    try {
        // Step 1: Fetch all properties for the given user_id
        const properties = await Property.find({ user_id: req.params.user_id });

        if (properties.length === 0) {
            return res.status(404).json({ error: "No properties found for this user" });
        }

        console.log('Found properties:', properties);

        // Step 2: Extract property_ids from properties
        const propertyIds = properties.map(property => property._id);

        console.log(propertyIds);

        // Step 3: Fetch bids where the property_id matches the _id of the properties
        const bids = await Bid.find({ property_id: { $in: propertyIds } });

        console.log('bids', bids);

        // Step 4: Send the properties and the bids together in the response
        res.status(200).json({ properties, bids });
    } catch (error) {
        console.error("Error fetching user profile and bids:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/bids/approve/:bid_id", async (req, res) => {
    const { bid_id } = req.params; // Still using bid_id as the parameter in the URL
    try {
        // Fetch the bid by the provided bid_id
        const bid = await Bid.findById(bid_id);
        if (!bid) {
            return res.status(404).json({ error: "Bid not found" });
        }

        // Fetch the corresponding property by property_id
        const property = await Property.findById(bid.property_id);
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }

        // Update property price based on bid price and the maximum tokens
        property.price = bid.price * property.max_token;
        property.token_available -= bid.token_count;  // Assuming token_available represents available tokens

        // Save the updated property
        await property.save();

        // Update the bid status to 'approved' instead of deleting it
        bid.status = 'approved';
        await bid.save();

        res.status(200).json({ message: "Bid approved and property updated" });
    } catch (error) {
        console.error("Error approving bid:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



router.post("/bids/deny/:bid_id", async (req, res) => {
    const { bid_id } = req.params;  // Still using bid_id as the parameter in the URL
    try {
        // Fetch the bid by the provided bid_id
        const bid = await Bid.findById(bid_id);
        if (!bid) {
            return res.status(404).json({ error: "Bid not found" });
        }

        // Delete the denied bid from the database
        await Bid.findByIdAndDelete(bid._id);

        res.status(200).json({ message: "Bid denied and removed from database" });
    } catch (error) {
        console.error("Error denying bid:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.get('/bids/approved/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const approvedBids = await Bid.find({ user_id: userId, status: 'approved' }); // Assuming 'status' field

        console.log('Approved bids list', approvedBids);
        res.json({ approvedBids });
    } catch (error) {
        console.error("Error fetching approved bids:", error);
        res.status(500).send({ message: "Failed to fetch approved bids." });
    }
});



console.log("Success");

module.exports = router;
