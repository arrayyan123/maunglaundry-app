import React, { useState } from "react";
import axios from "axios";
import GuestLayout from "@/Layouts/GuestLayout";


const ResetPassword = ({ token }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/api/reset-password", {
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            setMessage(response.data.message);
            setTimeout(() => {
                window.location.href = "/customer/login";
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || "An error occurred");
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
                {message && <p>{message}</p>}
                <form onSubmit={handleSubmit}>
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
                        <input
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="block text-gray-600">
                            Confirm Password:
                        </label>
                        <input
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                        />
                    </div>
                    <button className="px-4 py-2 mt-4 bg-green-500 text-white rounded-lg w-full flex justify-center items-center" type="submit">Reset Password</button>
                </form>
            </div>
        </GuestLayout>
    );
};

export default ResetPassword;