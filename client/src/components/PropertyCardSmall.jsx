import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PropertyCardSmall = ({ propertyId, image, title, price, location, fetchApprovedProperties }) => {
    const navigate = useNavigate();

    const handleApprove = async () => {
        try {
            await axios.get(`http://localhost:3001/property/approve/${propertyId}`);
            fetchApprovedProperties(); // Refresh approved properties after approving
            console.log(`Approved: ${propertyId}`);
        } catch (error) {
            console.error("Error approving property:", error);
        }
    };
    
    const handleDecline = async () => {
        try {
            await axios.get(`http://localhost:3001/property/decline/${propertyId}`);
            fetchApprovedProperties(); // Refresh approved properties after declining
            console.log(`Declined: ${propertyId}`);
        } catch (error) {
            console.error("Error declining property:", error);
        }
    };
    

    return (
        <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src={image} alt={title} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-row justify-between">
                <div>
                    <h3 className="text-lg text-white font-semibold mb-2">{title}</h3>
                    <p className="mb-2 text-white">{location}</p>
                    <p className="text-blue-100 font-bold">Price: {price}</p>
                </div>
                <div>
                    <button
                        className="p-3 bg-slate-950 text-white rounded-lg"
                        onClick={() => navigate(`/property/${propertyId}`)}
                    >
                        Explore
                    </button>
                </div>
            </div>

            <div className="flex flex-col space-y-2">
                <button
                    className="p-3 bg-green-600 text-white rounded-lg"
                    onClick={handleApprove}
                >
                    Approve
                </button>
                <button
                    className="p-3 bg-red-600 text-white rounded-lg"
                    onClick={handleDecline}
                >
                    Decline
                </button>
            </div>
        </div>
    );
};

export default PropertyCardSmall;
