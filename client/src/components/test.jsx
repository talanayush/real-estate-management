import React, { useEffect, useState } from "react";
import axios from "axios";

const DataFetcher = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Replace with your Node.js server endpoint
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3001/property/addfew");

                // const response = await axios.get("http://localhost:3001/api/");
                console.log(response.data);
                setData(response.data); // Assuming response.data contains the data
            } catch (err) {
                setError(err.message); // Handle error
            }
        };

        fetchData(); // Call the function on component mount
    }, []); // Empty dependency array ensures this runs once when the component mounts

    return <div>{data}</div>;
};

export default DataFetcher;
