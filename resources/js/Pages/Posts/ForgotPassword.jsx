import React, { useState } from "react";
import axios from "axios";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link } from "@inertiajs/react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/api/forgot-password", { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message || "Error occurred");
        }
    };

    return (
        <GuestLayout
            header={
                <div>
                    <h1 className='text-2xl font-semibold mb-4'>Forgot Password</h1>
                </div>
            }
        >
            <Head title="forgot password" />
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <label>
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
                <button className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-lg w-full flex justify-center items-center" type="submit">Send Reset Link</button>
                <Link href="/customer/login">
                    <button className="mt-4 text-green-500">
                        <span>
                            kembali ke halaman login
                        </span>
                    </button>
                </Link>
            </form>
        </GuestLayout>
    );
};

export default ForgotPassword;