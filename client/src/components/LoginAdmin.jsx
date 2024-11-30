import React, { useEffect, useState } from 'react';
import { account } from "./appwrite";

function App() {
    async function handleLogin() {
        console.log('Called Handle Login!');

        try {
            await account.createOAuth2Session(
                'google',
                'http://localhost:5173/admin',
                'http://localhost:5173/'
            );
        } catch (error) {
            console.error('Login failed', error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <button
                className="login-btn px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                onClick={handleLogin}
            >
                Login Admin with Google
            </button>
        </div>
    );
}

export default App;
