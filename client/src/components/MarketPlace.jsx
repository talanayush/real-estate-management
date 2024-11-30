import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCardPlain";
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
export default function MarketPlace() {
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
        Thumbnail_url: "",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("default");
    const [properties, setProperties] = useState([]);
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

    // Fetch properties from the backend
    const fetchProperties = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3001/property/fetchall/approved" // Correct endpoint
            );
            console.log(response);
            setProperties(response.data); // Set fetched properties
        } catch (err) {
            console.error("Error fetching properties:", err); // Better logging
        }
    };

    useEffect(() => {
        fetchProperties(); // Fetch once when the component mounts
    }, []); // Empty dependency array to avoid repeated fetches

    // Filter and sort properties based on search term and selected sort order
    const filteredProperties = properties
        .filter(
            (property) =>
                property.register_name // Use correct field
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                property.location.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === "priceLowToHigh") return a.price - b.price;
            if (sortOrder === "priceHighToLow") return b.price - a.price;
            return 0;
        });

    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="min-h-screen p-8">
                <div className="text-center text-blue-100">
                    <h1 className="text-4xl sm:text-6xl font-bold mb-4">
                        Make Your Best Choice
                    </h1>
                    <p className="text-lg sm:text-xl font-light mb-8">
                        by Choosing Your Favorite Property for Investing
                    </p>
                    <div className="flex flex-row justify-center p-4 space-x-8 mb-12">
                        <button
                            className="p-3 bg-blue-700 text-white rounded-lg"
                            onClick={() => navigate(`/register`)}
                        >
                            Register Property
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-10">
                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search by title or location"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-3 rounded-lg border border-gray-400 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2"
                    />

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="p-3 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 bg-blue-50 focus:ring-blue-500"
                    >
                        <option value="default">Sort by</option>
                        <option value="priceLowToHigh">Price: Low to High</option>
                        <option value="priceHighToLow">Price: High to Low</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property, index) => (
                        <PropertyCard
                            id={property._id || index} // Use a unique key (preferably MongoDB's _id)
                            image={property.thumbnail_url} // Correct field name
                            title={property.register_name} // Correct field name
                            price={`${property.price} ETH`} // Ensure price format
                            location={property.location}
                        />
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}
