import Navbar from "./Navbar";
import Home from "./Home";
import Services from "./Services";
import Footer from "./Footer";
import ReadyToList from "./ReadyToList";
import {useState, useEffect} from 'react';
import { account } from "./appwrite"; 
import axios from "axios";



export default function LandingPage(){
    const [user, setUser] = useState(null);

    async function getUser() {
        try {
            const userData = await account.get();
            setUser(userData);
            console.log('User data maplace', userData);
        } catch (error) {
            console.error("Failed to fetch user data", error);
        }
    }

    const addUserToDB = async () => {
        try {
            const userData = {
                user_id: user.$id,  // Assuming 'user' contains the user_id from Appwrite
                user_name: user.name,  // You can modify these with real data if available
                email: user.email,      // Modify as needed
                mobile_no: "0000000000",  // Modify as needed
            };
    
            const response = await axios.post(
                `http://localhost:3001/user/add`,  // POST request to add user
                userData  // Sending user data in the request body
            );
    
            console.log('Response', response);
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };
    
    useEffect(() => {
        const fetchAndAddUser = async () => {
            if (!user) {
                // Fetch user first if not already present
                await getUser(); 
            }
            
            if (user && !user.user_id) {  // Add a check to ensure the user exists
                await addUserToDB(); // Call the addUserToDB function only after user is available
            }
        };
    
        fetchAndAddUser();
    }, [user]);

    return(
        
        <>
            <Navbar></Navbar>
            <Home></Home>
            <Services></Services>
            <ReadyToList></ReadyToList>
            <Footer></Footer>
        </>
    );

}