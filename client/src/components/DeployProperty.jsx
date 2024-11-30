import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { PropertyABI } from "../utils2/constant"; // Import your PropertyFactory contract's ABI here.
import Navbar from "./Navbar";
const CONTRACT_ADDRESS = "0x822BaA07C39EFdD7D3773332F410b3F6B9167a1F"; // Replace with the deployed factory contract address.

function DeployProperty() {
  const [connectedWallet, setConnectedWallet] = useState("");
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({
    address: "",
    description: "",
    price: "",
    supply: "",
  });

  useEffect(() => {
    if (connectedWallet) fetchProperties();
  }, [connectedWallet]);

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) return alert("MetaMask is required!");

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setConnectedWallet(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Fetch deployed properties
  const fetchProperties = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, PropertyABI, provider);
      const propertyAddresses = await contract.getProperties();
      setProperties(propertyAddresses);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  // Create a new property
  const createProperty = async () => {
    const { address, description, price, supply } = newProperty;

    if (!address || !description || !price || !supply) {
      return alert("All fields are required!");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, PropertyABI, signer);

      const tx = await contract.createProperty(
        address,
        description,
        ethers.parseEther(price), // Convert ETH price to Wei
        supply
      );
      await tx.wait();

      alert("Property created successfully!");
      fetchProperties(); // Refresh the property list
    } catch (error) {
      console.error("Error creating property:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-8 text-gray-100">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-6">Property Factory</h1>
          {!connectedWallet ? (
            <div className="flex flex-col items-center">
              <button
                onClick={connectWallet}
                className="bg-gray-600 text-white py-2 px-4 rounded shadow-md hover:bg-gray-500"
              >
                Connect Wallet
              </button>
              <div className="mt-8 p-6 bg-gray-800 rounded shadow-md max-w-2xl text-center">
                <h2 className="text-2xl font-semibold mb-4">How This Works</h2>
                <p className="text-gray-400 leading-relaxed">
                  This decentralized application allows you to create and manage properties on the blockchain. 
                  By connecting your wallet, you can deploy new properties by providing essential details like 
                  the property address, description, price, and the number of shares available. All created properties 
                  are stored as smart contracts, ensuring transparency and immutability. You can also view a list of 
                  deployed properties and access them directly on Etherscan for more details.
                </p>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg text-center mb-6">
                Connected Wallet: <span className="font-mono text-gray-400">{connectedWallet}</span>
              </h3>

              {/* Form to create a new property */}
              <div className="bg-gray-800 p-6 rounded shadow-md mb-8">
                <h2 className="text-2xl font-semibold text-gray-100 mb-4">Create a New Property</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-gray-400">Property Address</label>
                    <input
                      type="text"
                      value={newProperty.address}
                      onChange={(e) =>
                        setNewProperty({ ...newProperty, address: e.target.value })
                      }
                      className="w-full border border-gray-600 rounded p-2 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-400">Description</label>
                    <input
                      type="text"
                      value={newProperty.description}
                      onChange={(e) =>
                        setNewProperty({ ...newProperty, description: e.target.value })
                      }
                      className="w-full border border-gray-600 rounded p-2 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-400">Price (ETH)</label>
                    <input
                      type="number"
                      value={newProperty.price}
                      onChange={(e) =>
                        setNewProperty({ ...newProperty, price: e.target.value })
                      }
                      className="w-full border border-gray-600 rounded p-2 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-400">Supply (Shares)</label>
                    <input
                      type="number"
                      value={newProperty.supply}
                      onChange={(e) =>
                        setNewProperty({ ...newProperty, supply: e.target.value })
                      }
                      className="w-full border border-gray-600 rounded p-2 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-gray-500"
                    />
                  </div>
                </div>
                <button
                  onClick={createProperty}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded shadow-md hover:bg-blue-500"
                >
                  Create Property
                </button>
              </div>

              {/* List of deployed properties */}
              <div className="bg-gray-800 p-6 rounded shadow-md">
                <h2 className="text-2xl font-semibold text-gray-100 mb-4">Deployed Properties</h2>
                {properties.length === 0 ? (
                  <p className="text-gray-400">No properties deployed yet.</p>
                ) : (
                  <ul className="list-disc pl-5 text-gray-400">
                    {properties.map((property, index) => (
                      <li key={index} className="mb-2">
                        <a
                          href={`https://etherscan.io/address/${property}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline hover:text-blue-300"
                        >
                          {property}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default DeployProperty;
