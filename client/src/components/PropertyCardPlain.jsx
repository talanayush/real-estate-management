import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { account } from "./appwrite";

const PropertyCard = ({ id, image, title, price, location }) => {
    const [user, setUser] = useState(null);

    async function getUser() {
        if (!user) {
            console.log("User Info display request!");

            try {
                const userData = await account.get();
                setUser(userData);
                console.log(userData);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    const navigate = useNavigate();

    // State for modal visibility and bid amount
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bidAmount, setBidAmount] = useState("");
    const [tokenCount, setTokenCount] = useState(0);

    // Open/Close modal handlers
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Handle form submission
    const handleBidSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/property/bid", {
                user_id: user.$id,
                property_id: id,
                price: parseFloat(bidAmount),
                token_count: tokenCount,
            });
            alert("Bid placed successfully!");
            closeModal(); // Close the modal after submission
        } catch (error) {
            console.error("Error placing bid:", error);
            alert("Error placing bid, please try again.");
        }
    };

    return (
        <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src={image} alt={title} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-row justify-between">
                <div>
                    <h3 className="text-lg text-white font-semibold mb-2">
                        {title}
                    </h3>
                    <p className="mb-2 text-white">{location}</p>
                    <p className="text-blue-100 font-bold">Price: {price}</p>
                </div>
                <div>
                    <button
                        className="p-3 bg-slate-950 text-white rounded-lg mb-2"
                        onClick={() => navigate(`/property/${id}`)}
                    >
                        Explore
                    </button>

                    <br></br>
                    <button
                        className="p-3 bg-slate-950 text-white rounded-lg"
                        onClick={openModal} // Open modal on click
                    >
                        Place a Bid
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-2xl font-bold mb-4">
                            Place Your Bid
                        </h2>
                        <form onSubmit={handleBidSubmit}>
                            {/* Number of Tokens Input */}
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">
                                    Number of Tokens
                                </label>
                                <input
                                    type="number"
                                    value={tokenCount}
                                    onChange={(e) =>
                                        setTokenCount(e.target.value)
                                    }
                                    placeholder="Enter number of tokens"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    min="1"
                                    max="100" // Limit to 100 tokens
                                />
                            </div>

                            {/* Price Per Token Input */}
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">
                                    Price per Token
                                </label>
                                <input
                                    type="number"
                                    value={bidAmount}
                                    onChange={(e) =>
                                        setBidAmount(e.target.value)
                                    }
                                    placeholder="Enter price per token"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    min="0.01" // Ensure positive bids
                                    step="0.01"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="p-3 bg-gray-400 text-white rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="p-3 bg-blue-600 text-white rounded-lg"
                                >
                                    Submit Bid
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyCard;
