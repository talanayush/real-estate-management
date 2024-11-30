import React, { useState, useEffect } from "react";
import axios from "axios";
import { account } from "./appwrite";
import Navbar from "./Navbar";
import { Navigate, useNavigate } from "react-router-dom";
const UserProfile = () => {
    const [userData, setUserData] = useState({});
    const [userBids, setUserBids] = useState([]);
    const [approvedBids, setApprovedBids] = useState([]); // New state for approved bids
    const [user, setUser] = useState(null);

    // Fetch user ID from Appwrite
    async function getUser() {
        try {
            const userData = await account.get();
            setUser(userData.$id);
        } catch (error) {
            console.error("Failed to fetch user data", error);
        }
    }
    const navigate= useNavigate();
    useEffect(() => {
        getUser();
    }, []);

    // Fetch user profile data and bids
    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/user/${user}`);
                    setUserData(response.data);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            const fetchUserBids = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/property/bids/${user}`);
                    setUserBids(response.data.bids);
                } catch (error) {
                    console.error("Error fetching user bids:", error);
                }
            };

            const fetchApprovedBids = async () => { // Fetch approved bids
                try {
                    const response = await axios.get(`http://localhost:3001/property/bids/approved/${user}`);
                    console.log('BIDS Approved: ', response.data);
                    setApprovedBids(response.data.approvedBids);
                } catch (error) {
                    console.error("Error fetching approved bids:", error);
                }
            };

            fetchUserData();
            fetchUserBids();
            fetchApprovedBids(); // Call fetchApprovedBids
        }
    }, [user]);

    // Approve a bid
    const approveBid = async (bid_id) => {
        try {
            await axios.post(`http://localhost:3001/property/bids/approve/${bid_id}`);
            setUserBids(userBids.filter((bid) => bid._id !== bid_id));
            alert("Bid approved and property updated.");
        } catch (error) {
            console.error("Error approving bid:", error);
        }
    };

    // Deny a bid
    const denyBid = async (bid_id) => {
        try {
            await axios.post(`http://localhost:3001/property/bids/deny/${bid_id}`);
            setUserBids(userBids.filter((bid) => bid._id !== bid_id));
            alert("Bid denied and removed.");
        } catch (error) {
            console.error("Error denying bid:", error);
        }
    };

    // Pay for an approved bid
    const payForBid = async (bid_id) => {
        try {
            await axios.post(`http://localhost:3001/property/bids/pay/${bid_id}`);
            alert("Payment successful!");
            setApprovedBids(approvedBids.filter((bid) => bid._id !== bid_id));
        } catch (error) {
            console.error("Error processing payment:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex justify-center items-center">
                <div className="max-w-4xl w-full p-8 bg-gray-800 shadow-lg rounded-lg">
                    <h2 className="text-4xl font-bold mb-6 text-center text-indigo-400">User Profile</h2>

                    {/* User Profile Section */}
                    <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-8">
                        <p className="text-lg"><strong>Name:</strong> {userData.user_name}</p>
                        <p className="text-lg"><strong>Email:</strong> {userData.email}</p>
                        <p className="text-lg"><strong>Mobile:</strong> {userData.mobile_no}</p>
                    </div>

                    {/* User Bids Section */}
                    <h3 className="text-3xl font-semibold mb-4 text-center text-indigo-300">Your Bids</h3>
                    {userBids.length > 0 ? (
                        <ul className="space-y-6">
                            {userBids.map((bid) => (
                                <li key={bid._id} className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                                    <p className="text-lg mb-2"><strong>Property ID:</strong> {bid.property_id}</p>
                                    <p className="text-lg mb-2"><strong>Bid Price:</strong> {bid.price} ETH</p>
                                    <p className="text-lg mb-4"><strong>Token Count:</strong> {bid.token_count}</p>
                                    <div className="flex space-x-4">
                                        <button onClick={() => approveBid(bid._id)} className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded transition-transform transform hover:scale-105">
                                            Approve
                                        </button>
                                        <button onClick={() => denyBid(bid._id)} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded transition-transform transform hover:scale-105">
                                            Deny
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-lg text-gray-400">No bids found.</p>
                    )}

                    {/* Approved Bids Section */}
                    <h3 className="text-3xl font-semibold mt-8 mb-4 text-center text-green-400">Approved Bids</h3>
                    {approvedBids.length > 0 ? (
                        <ul className="space-y-6">
                            {approvedBids.map((bid) => (
                                <li key={bid._id} className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                                    <p className="text-lg mb-2"><strong>Property ID:</strong> {bid.property_id}</p>
                                    <p className="text-lg mb-2"><strong>Approved Price:</strong> {bid.price} ETH</p>
                                    <div className="flex justify-center mt-4">
                                        <button onClick={() => navigate('/welcome')} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded transition-transform transform hover:scale-105">
                                            Pay Now
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-lg text-gray-400">No approved bids found.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserProfile;
