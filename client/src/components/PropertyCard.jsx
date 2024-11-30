import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Footer from "./Footer";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
} from "chart.js";

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale
);
const PropertyCard = () => {
    // Mock data for the graph
const years = [2021, 2022, 2023, 2024, 2025];
const priceEstimates = [50000, 55000, 60000, 65000, 70000];

const graphData = {
    labels: years,
    datasets: [
        {
            label: "Price Estimate (in USD)",
            data: priceEstimates,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            pointRadius: 4,
            tension: 0.3,
        },
    ],
};

const graphOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: true,
            position: "top",
        },
        tooltip: {
            enabled: true,
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: "Year",
            },
        },
        y: {
            title: {
                display: true,
                text: "Price (in USD)",
            },
            beginAtZero: false,
        },
    },
};

    
    const propertyImages = [
        "https://via.placeholder.com/800x400?text=Property+1",
        "https://via.placeholder.com/800x400?text=Property+2",
        "https://via.placeholder.com/800x400?text=Property+3",
    ];

    const [propertyDetails, setPropertyDetails] = useState({
        longitude: "",
        latitude: "",
        squareFootage: "",
        buildingType: "",
        tradeTime: "",
    });
    const [displayDetails, setDisplayDetails] = useState({
        PropertyName: "",
        ZipCode: "",
        Price: "",
        RegisterName: "",
        Area: "",
        Type: "",
        Status: "",
        Thumbnail_url: ""
    });
    const { id } = useParams(); // Get the property title from the URL

    const fetchPropertyDetails = async () => {
        try {
            console.log("Fetching property with ID:", id);
            const response = await axios.get(`http://localhost:3001/property/details/${id}`);
            console.log("Response:", response.data);
            setDisplayDetails({
                PropertyName: response.data.register_name, // Adjust this field to match response data
                ZipCode: response.data.zip_code,
                RegisterName: response.data.register_name,
                Location: response.data.location,
                Area: response.data.area,
                Price: response.data.price,
                Type: response.data.type,
                Status: response.data.status,
                Thumbnail_url: response.data.thumbnail_url
            });
        } catch (error) {
            console.error("Error fetching property details:", error.response || error.message);
            setDisplayDetails((prevState) => ({
                ...prevState,
                name: "Property not found",
            }));
        }
    };

    useEffect(() => {
        fetchPropertyDetails();
    }, [id]);

    // Log the updated state whenever `displayDetails` changes
    useEffect(() => {
        console.log("Updated Property Details:", displayDetails);
    }, [displayDetails]);


    const [price, setPrice] = useState("");
    const [predictedPrice, setPredictedPrice] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPropertyDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = { ...propertyDetails };

        try {
            const response = await fetch("http://localhost:5000/api/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            setPrice(data.result); // Assuming Flask returns the predicted price as 'result'
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="gradient-bg-welcome mt-16 m-20">
                <div className="max-w-4xl mx-auto rounded-lg shadow-md overflow-hidden">
                    <div className="w-full h-auto">
                        <Carousel
                            showThumbs={false}
                            infiniteLoop={true}
                            autoPlay={true}
                            interval={3000}
                            showStatus={false}
                            dynamicHeight={false}
                        >
                            <div>
                                <img
                                    src={displayDetails.Thumbnail_url}
                                    alt="Property"
                                    className="object-cover w-full h-64 sm:h-96"
                                />
                            </div>
                        </Carousel>
                    </div>
                </div>
                <div className=" p-4 flex justify-between items-center text-gray-100">
                    <div>
                        <h1 className="text-xl font-bold text-gray-100">
                            {displayDetails.PropertyName}
                        </h1>
                        <p className="text-gray-100">Status: {displayDetails.Status}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold text-gray-100">
                            {displayDetails.Price} ETH
                        </p>
                        {/* <p className="text-gray-100">₹509.65L</p> */}

                    </div>
                </div>

                {/* Buttons */}
                <div className="p-4 flex gap-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
                        Contact Seller
                    </button>
                    <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded-lg shadow hover:bg-blue-100">
                        Add to Watchlist
                    </button>
                </div>

                {/* Property Description */}
                <div className="p-4">
                    <h2 className="font-bold text-lg text-gray-100">
                        Property Description
                    </h2>
                    <p className="text-gray-100">Ready to move in</p>
                    <p className="text-gray-100">{displayDetails.Location}</p>
                    <p className="text-gray-100">Zip code: {displayDetails.ZipCode}</p>
                    <p className="text-gray-100">
                        Super Built Up Area: {displayDetails.Area} sq. ft.
                    </p>
                    <p className="text-gray-100">
                        Carpet Area: {displayDetails.Area} sq. ft.
                    </p>
                    {/* <p className="text-gray-100">Built in 2019</p> */}
                </div>

                {/* Form to Get User's Data for Price Prediction */}


                {/* Share Section */}
                <div className="p-4 flex gap-4">
                    <button className="text-blue-500">
                        Share on Twitter
                    </button>
                    <button className="text-blue-500">
                        Share on Facebook
                    </button>
                </div>

                {/* Details & Features */}
                <div className="p-4 grid grid-cols-2 gap-6 ">
                    <div>
                        <h2 className="font-bold text-lg text-white mb-4">
                            Details
                        </h2>
                        <p className="text-gray-100">
                            {displayDetails.Area} sq. ft. farm land for sale in {displayDetails.Location}. Invest in the future of real estate with this exceptional property opportunity, perfect for those looking to diversify their portfolio or secure a tangible, appreciating asset. Strategically located in a thriving area, this property promises consistent growth potential and stability in an ever-evolving market.
                        </p>
                        <ul className="text-gray-100 list-disc pl-5 mt-4">
                            <li>
                                <strong>Prime Location:</strong> Situated in a rapidly developing region with strong infrastructure and rising demand.
                            </li>
                            <li>
                                <strong>Versatility:</strong> Suitable for residential, commercial, or mixed-use developments, catering to diverse market needs.
                            </li>
                            <li>
                                <strong>Value Appreciation:</strong> With consistent economic growth and urban expansion, this property offers significant potential for long-term capital gains.
                            </li>
                            <li>
                                <strong>Rental Income:</strong> Ideal for generating steady cash flow through leasing or rental opportunities.
                            </li>
                            <li>
                                <strong>Sustainability:</strong> Equipped with eco-friendly features and designed to align with modern sustainability standards.
                            </li>
                        </ul>
                        <p className="text-gray-100 mt-4">
                            Backed by the reliability of real estate as an asset class, this property offers a unique chance to combine financial growth with tangible ownership. Seize this opportunity to own a stake in tomorrow's success.
                        </p>

                    </div>
                    <div className="">
                        <h2 className="font-bold text-lg text-white mb-4">
                            Property Features
                        </h2>
                        <ul className="text-gray-100 grid grid-cols-2 gap-4">
                            <li>📺 Television</li>
                            <li>📞 Telephone</li>
                            <li>📡 Internet</li>
                            <li>💪 Sports Area</li>
                            <li>🔌 Cable Ready</li>
                        </ul>
                    </div>
                    <div className="p-4 ">
                    <h2 className="font-bold text-lg text-white">
                        Nearby Places
                    </h2>
                    <div className="flex gap-4 mt-4">
                        <button className="px-4 py-2 bg-gray-500 rounded-lg">
                            Schools
                        </button>
                        <button className="px-4 py-2 bg-gray-500 rounded-lg">
                            Restaurants
                        </button>
                        <button className="px-4 py-2 bg-gray-500 rounded-lg">
                            Hospitals
                        </button>
                        <button className="px-4 py-2 bg-gray-500 rounded-lg">
                            Parks
                        </button>
                    </div>
                </div>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-6 ">
                    <form onClick={handleSubmit} className="p-6 rounded-lg shadow-md w-full mx-auto space-y-6">
                        <h2 className="font-bold text-2xl text-gray-100 text-center mb-4">
                            Estimate Property's Price
                        </h2>
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                name="longitude"
                                placeholder="Longitude"
                                value={propertyDetails.longitude}
                                onChange={handleChange}
                                className="p-2 rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                name="latitude"
                                placeholder="Latitude"
                                value={propertyDetails.latitude}
                                onChange={handleChange}
                                className="p-2 rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                name="squareFootage"
                                placeholder="Square Footage"
                                value={propertyDetails.squareFootage}
                                onChange={handleChange}
                                className="p-2 rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                name="buildingType"
                                placeholder="Building Type"
                                value={propertyDetails.buildingType}
                                onChange={handleChange}
                                className="p-2 rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                name="tradeTime"
                                placeholder="Trade Time (YYYY-MM-DD)"
                                value={propertyDetails.tradeTime}
                                onChange={handleChange}
                                className="p-2 rounded-lg"
                                required
                            />
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                                type="submit"
                            >
                                Estimate Price
                            </button>
                        </div>

                        {price && (
                            <div className="mt-4 text-lg font-bold text-green-600">
                                Predicted Price: {price}
                            </div>
                        )}
                    </form>
                   

                <div className="p-4">
                    <h2 className="font-bold text-2xl text-gray-100 text-center mb-4">
                        Price Estimation Over the Years
                    </h2>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <Line data={graphData} options={graphOptions} />
                    </div>
                </div>
                </div>
                </div>
                {/* Nearby Places */}
                
           
            <Footer />
        </>
    );
};

export default PropertyCard;