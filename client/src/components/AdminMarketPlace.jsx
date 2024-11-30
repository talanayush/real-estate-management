import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import Footer from "./Footer";
import PropertyCardSmall from "./PropertyCardSmall";
import PropertyCardPlain from "./PropertyCardPlain";

export default function AdminMarketPlace() {
    const [approvedProperties, setApprovedProperties] = useState([]);
    const [searchText, setSearchText] = useState("");

    const [sortOrder, setSortOrder] = useState("asc");

    const [properties, setProperties] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchApprovedProperties();
        fetchAllProperties();
    }, []);

    const fetchApprovedProperties = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3001/property/fetchall/pending"
            );
            setApprovedProperties(response.data);
        } catch (error) {
            console.error("Error fetching approved properties:", error);
        }
    };

    const fetchAllProperties = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3001/property/fetchall"
            );
            setProperties(response.data);
        } catch (error) {
            console.error("Error fetching approved properties:", error);
        }
    };

    const filteredProperties = approvedProperties.filter(
        (property) =>
            property.register_name
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
            property.location.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredProperties2 = properties.filter(
        (property) =>
            property.register_name
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
            property.location.toLowerCase().includes(searchText.toLowerCase())
    );

    const sortedProperties = filteredProperties.sort((a, b) => {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    });

    return (
        <div className="gradient-bg-welcome">
            <AdminNavbar />
            <div className="min-h-screen p-8 mb-2">
                {/* Page Header */}
                <div className="text-center text-blue-100">
                    <h1 className="text-4xl font-bold mb-4">
                        Approved Properties
                    </h1>
                    <p className="text-lg sm:text-xl font-light mb-8">
                        Review and manage approved properties.
                    </p>
                </div>

                {/* Search and Sort Controls */}
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
                    <input
                        type="text"
                        placeholder="Search by Property Name or Location"
                        className="p-3 bg-slate-700 text-white rounded-lg mb-4 sm:mb-0"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <select
                        className="p-3 bg-slate-700 text-white rounded-lg"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="asc">Sort by Price (Low to High)</option>
                        <option value="desc">
                            Sort by Price (High to Low)
                        </option>
                    </select>
                </div>

                {/* Property Cards Grid */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property, index) => (
                        <PropertyCardSmall
                            propertyId={property._id || index} // Use a unique key (preferably MongoDB's _id)
                            image={property.thumbnail_url} // Correct field name
                            title={property.register_name} // Correct field name
                            price={`${property.price} ETH`} // Ensure price format
                            location={property.location}
                            approve={() => handleApprove(property._id)} // Pass property ID
                            decline={() => handleDecline(property._id)} // Pass property ID
                        />
                    ))}
                </div>

                <div className="p-10"></div>

                <div className="text-center text-blue-100">
                    <h1 className="text-4xl font-bold mb-4">All Properties</h1>
                    <p className="text-lg sm:text-xl font-light mb-8">...</p>
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
                        <option value="priceLowToHigh">
                            Price: Low to High
                        </option>
                        <option value="priceHighToLow">
                            Price: High to Low
                        </option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties2.map((property, index) => (
                        <PropertyCardPlain
                            key={property._id || index} // Use a unique key (preferably MongoDB's _id)
                            image={property.thumbnail_url} // Correct field name
                            title={property.register_name} // Correct field name
                            price={`${property.price} ETH`} // Ensure price format
                            location={property.location}
                        />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
