import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
const ReadyToList = () => {

    const navigate=useNavigate();
    return (
        <div className="flex flex-col items-center text-center pb-32 rounded-lg shadow-lg w-full md:w-3/4 mx-auto mt-16 mb-16 ">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
                Ready to List Your First Property?
            </h2>
            <p className="text-lg text-white mb-6">
                It's easy to post your Indian property on our peer-to-peer real estate marketplace for expats. It only takes a few minutes to get you well on your way to selling your property to a nearby buyer.
            </p>
            <p className="text-lg text-white mb-6">
                If you have any questions, Reobee is always here to lend a helping hand.
            </p>
            {/* Optional: You can add a button to encourage users to start the listing */}
            <button className=" bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300" onClick={()=>{navigate(`/register`)}}>
                Start Listing Now
            </button>
        </div>
    );
};

export default ReadyToList;
