const { Router } = require("express");
const router = Router();
const Bid = require("../models/bid");
const User = require("../models/user");
const Property = require("../models/property");

router.post("/add", async (req, res) => {
    
    // console.log('Add function called! ', user_id, user_name, email, mobile_no);
    const { user_id, user_name, email, mobile_no } = req.body;


    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ user_id });

        if (existingUser) {
            // If user exists, respond with a message
            return res.status(200).json({ message: "User already exists", user: existingUser });
        }

        // If user doesn't exist, create a new user
        const newUser = new User({
            user_id,
            user_name,
            email,
            mobile_no
        });

        console.log('Data Saved New!\n');
        await newUser.save();

        res.status(201).json({ message: "User added successfully!", user: newUser });
    } catch (error) {
        console.error("Error adding user to DB:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.get("/:user_id", async (req, res) => {
    console.log('User data request!', req.params.user_id);
    try {
        const user = await User.findOne({ user_id: req.params.user_id });
        console.log(user);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;
