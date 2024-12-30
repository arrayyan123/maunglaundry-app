import React, { useState } from "react";
import axios from "axios";
import GuestLayout from "@/Layouts/GuestLayout";
import IonIcon from "@reacticons/ionicons";

const ResetPassword = ({ token }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/api/reset-password", {
                email,
                password,
                password_confirmation: passwordConfirmation,
                token,
            });
            setMessage(response.data.message);
            setMessageType("success");
            setTimeout(() => {
                window.location.href = "/customer/login";
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || "An error occurred");
            setMessageType("error");
        }
    };

    return (
        <GuestLayout
            header={
                <div>
                    <h1 className='text-2xl font-semibold mb-4'>Reset Password</h1>
                </div>
            }
        >
            <div>
                {message && (
                    <div
                        className={`mb-4 px-4 py-2 rounded-lg text-white ${messageType === "success" ? "bg-green-500" : "bg-red-500"
                            }`}
                    >
                        {message}
                    </div>
                )}                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-4">
                        <label className="block text-gray-600">
                            Email:
                        </label>
                        <input
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="block text-gray-600">
                            New Password:
                        </label>
                        <div className="relative">
                            <input
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <IonIcon name='eye' className='text-[22px]' /> : <IonIcon name='eye-off' className='text-[22px]' />}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="block text-gray-600">
                            Confirm Password:
                        </label>
                        <div className="relative">
                            <input
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                type={showPassword ? 'text' : 'password'}
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <IonIcon name='eye' className='text-[22px]' /> : <IonIcon name='eye-off' className='text-[22px]' />}
                            </button>
                        </div>
                    </div>
                    <button className="px-4 py-2 mt-4 bg-green-500 text-white rounded-lg w-full flex justify-center items-center" type="submit">Reset Password</button>
                </form>
            </div>
        </GuestLayout>
    );
};

export default ResetPassword;