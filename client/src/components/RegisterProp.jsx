import React, { useEffect, useState } from "react";
import { account } from "./appwrite";

const RegisterProp = () => {
    const [user, setUser] = useState(null);

    async function getUser() {
        try {
            const userData = await account.get();
            setUser(userData);
            console.log("User data maplace", userData);
        } catch (error) {
            console.error("Failed to fetch user data", error);
        }
    }   

    useEffect(() => {
        if (!user) getUser();
    }, []);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        zipCode: "",
        country: "India",
        state: "Uttar Pradesh",
        city: "Ghaziabad",
        phoneNumber: "",
        propertyRegisterName: "",
        propertyLocation: "",
        propertyAtPurchase: "",
        propertyArea: "",
        propertyType: "",
    });

    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Move to next step with validation
    const handleNextStep = () => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.firstName)
                newErrors.firstName = "First Name is required";
            if (!formData.lastName)
                newErrors.lastName = "Last Name is required";
            if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
                newErrors.email = "Valid email is required";
            if (!formData.zipCode || formData.zipCode.length !== 6)
                newErrors.zipCode = "Please enter a valid postal code";
        } else if (step === 2) {
            if (!formData.phoneNumber)
                newErrors.phoneNumber = "Phone Number is required";
        } else if (step === 3) {
            if (!formData.propertyRegisterName || !formData.propertyLocation)
                newErrors.propertyRegisterName =
                    "Property title and location are required";
        }

        if (Object.keys(newErrors).length === 0) {
            setStep(step + 1); // Proceed to next step
        } else {
            setErrors(newErrors); // Show validation errors
        }
    };

    // Move to previous step
    const handlePrevStep = () => {
        if (step > 1) {
            setStep(step - 1); // Go back to the previous step
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            user_id: user.$id, // Assuming email or userID from session
            zip_code: formData.zipCode,
            register_name: formData.propertyRegisterName,
            location: formData.propertyLocation,
            price: parseFloat(formData.propertyAtPurchase), // Convert to number
            area: parseFloat(formData.propertyArea),
            type: parseInt(formData.propertyType), // Assuming 'type' is a number code
            status: "pending", // Default status value
            thumbnail_url: "", // Placeholder if not provided
        };

        try {
            const response = await fetch(
                "http://localhost:3001/property/register_new",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                const result = await response.json();
                console.log("Data saved successfully:", result);
            } else {
                console.error("Failed to save data:", response.statusText);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    // Render different step components
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="step-content space-y-4 flex flex-col">
                        <h3 className="text-2xl font-semibold">
                            Basic Information
                        </h3>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            className="input w-3/4 mx-auto"
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-sm">
                                {errors.firstName}
                            </p>
                        )}
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className="input w-3/4 mx-auto"
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-sm">
                                {errors.lastName}
                            </p>
                        )}
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="input w-3/4 mx-auto"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>
                        )}
                        <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            placeholder="Zip Code"
                            className="input w-3/4 mx-auto"
                        />
                        {errors.zipCode && (
                            <p className="text-red-500 text-sm">
                                {errors.zipCode}
                            </p>
                        )}
                    </div>
                );
            case 2:
                return (
                    <div className="step-content space-y-4 flex-col">
                        <h3 className="text-2xl font-semibold">
                            Phone Verification
                        </h3>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className="input w-3/4 mx-auto"
                        />
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-sm">
                                {errors.phoneNumber}
                            </p>
                        )}
                    </div>
                );
            case 3:
                return (
                    <div className="step-content space-y-4">
                        <h3 className="text-2xl font-semibold">
                            Property Details
                        </h3>
                        <input
                            type="text"
                            name="propertyRegisterName"
                            value={formData.propertyRegisterName}
                            onChange={handleChange}
                            placeholder="Property Register Name"
                            className="input w-3/4 mx-auto"
                        />
                        {errors.propertyRegisterName && (
                            <p className="text-red-500 text-sm">
                                {errors.propertyRegisterName}
                            </p>
                        )}
                        <input
                            type="text"
                            name="propertyLocation"
                            value={formData.propertyLocation}
                            onChange={handleChange}
                            placeholder="Property Location"
                            className="input w-3/4 mx-auto"
                        />

                        <input
                            type="text"
                            name="propertyAtPurchase"
                            value={formData.propertyAtPurchase}
                            onChange={handleChange}
                            placeholder="Property Price at the time of Purchase"
                            className="input w-3/4 mx-auto"
                        />
                        <input
                            type="text"
                            name="propertyArea"
                            value={formData.propertyArea}
                            onChange={handleChange}
                            placeholder="Property Area"
                            className="input w-3/4 mx-auto"
                        />

                        <input
                            type="text"
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            placeholder="Property Type"
                            className="input w-3/4 mx-auto"
                        />
                    </div>
                );
            case 4:
                return (
                    <div className="step-content space-y-4">
                        <h3 className="text-2xl font-semibold">
                            Review Listing
                        </h3>
                        <div>
                            <p>
                                <strong>First Name:</strong>{" "}
                                {formData.firstName}
                            </p>
                            <p>
                                <strong>Last Name:</strong> {formData.lastName}
                            </p>
                            <p>
                                <strong>Email:</strong> {formData.email}
                            </p>
                            <p>
                                <strong>Zip Code:</strong> {formData.zipCode}
                            </p>
                            <p>
                                <strong>Phone:</strong> {formData.phoneNumber}
                            </p>
                            <p>
                                <strong>Property Register Name:</strong>{" "}
                                {formData.propertyRegisterName}
                            </p>
                            <p>
                                <strong>Property Location:</strong>{" "}
                                {formData.propertyLocation}
                            </p>

                            <p>
                                <strong>Property Price at Purchase:</strong>{" "}
                                {formData.propertyAtPurchase}
                            </p>
                            <p>
                                <strong>Property Area:</strong>{" "}
                                {formData.propertyArea}
                            </p>
                            <p>
                                <strong>Property Type:</strong>{" "}
                                {formData.propertyType}
                            </p>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="step-content space-y-4">
                        <h3 className="text-2xl font-semibold">Confirmation</h3>
                        <p>
                            Thank you for submitting your property registration!
                            Your details have been saved.
                        </p>
                    </div>
                );
            default:
                return <div>Invalid Step</div>;
        }
    };

    return (
        <div className="container mx-auto py-8 px-6 bg-blue-100 shadow-lg rounded-lg w-1/2 mt-16 mb-4">
            <div className="form-steps space-y-6">
                <div className="step-navigation flex justify-between mb-6 mx-4">
                    <div
                        className={` rounded-l-xl step ${
                            step === 1 ? "bg-blue-900" : "bg-blue-800"
                        } border-1 border-black text-white text-center 
                            p-4 hover:bg-blue-700 transition duration-300`}
                    >
                        Input Detail
                    </div>
                    <div
                        className={` step ${
                            step === 2 ? "bg-blue-900" : "bg-blue-800"
                        } border-1 border-black text-white text-center 
                            p-4 hover:bg-blue-700 transition duration-300`}
                    >
                        Phone verification
                    </div>
                    <div
                        className={`step ${
                            step === 3 ? "bg-blue-900" : "bg-blue-800"
                        } border-1 border-black text-white text-center 
                            p-4 hover:bg-blue-700 transition duration-300`}
                    >
                        Property details
                    </div>
                    <div
                        className={`step ${
                            step === 4 ? "bg-blue-900" : "bg-blue-800"
                        } border-1 border-black text-white text-center 
                            p-4 hover:bg-blue-700 transition duration-300`}
                    >
                        Waiting for authorisation
                    </div>
                    <div
                        className={` rounded-r-xl step ${
                            step === 5 ? "bg-blue-900" : "bg-blue-800"
                        } border-1 border-black text-white text-center 
                            p-4 hover:bg-blue-700 transition duration-300`}
                    >
                        Confirmed
                    </div>
                </div>

                {renderStep()}

                {/* Buttons Section */}
                <div className="flex justify-between space-x-4">
                    {/* Back Button */}
                    {step > 1 && (
                        <button
                            onClick={handlePrevStep}
                            className="back-step-btn w-full py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Back
                        </button>
                    )}

                    {step !== 5 ? (
                        <button
                            onClick={handleNextStep}
                            className="next-step-btn w-full py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Next Step
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="next-step-btn w-full py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Submit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterProp;
