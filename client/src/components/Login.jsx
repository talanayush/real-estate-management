import React from 'react';
import { account } from "./appwrite";

function App() {
    // Function to handle login
    async function handleLogin(role) {
        console.log(`Called Handle Login for ${role}!`);

        try {
            // Pass a role-specific URL or parameter if needed
            await account.createOAuth2Session(
                'google',
                `http://localhost:5173/${role == 'admin'? 'Admin': ''}`,  // Redirect to different routes based on role
                'http://localhost:5173/error'     // Generic error route for both roles
            );
        } catch (error) {
            console.error(`Login failed for ${role}`, error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-6">
            {/* User Login Button */}
            <button
                className="login-btn px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                onClick={() => handleLogin('user')}
            >
                Login as User
            </button>

            {/* Admin Login Button */}
            <button
                className="login-btn px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                onClick={() => handleLogin('admin')}
            >
                Login as Admin
            </button>
        </div>
    );
}

export default App;
