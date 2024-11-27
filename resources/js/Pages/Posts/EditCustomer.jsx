import React, { useState } from "react";
import { Head } from "@inertiajs/react";

const pngImages = import.meta.glob("/public/assets/Images/*.png", { eager: true });
const webpImages = import.meta.glob("/public/assets/Images/*.webp", { eager: true });
const images = { ...pngImages, ...webpImages };

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const dummypic = getImageByName("dummy-profpic");
const logo = getImageByName("Logo_maung");

export default function EditCustomer({ customer }) {
    const [formData, setFormData] = useState({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put(`/api/customer/${customer.id}`, formData);
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: "error", text: "Failed to update profile." });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("customer-token");
        localStorage.removeItem("customer-data");
        window.location.href = "/customer/login";
    };
    return (
        <>
            <Head title="Edit Profile" />
            <div className="min-h-screen flex bg-gray-100">
                {/* Sidebar */}
                <aside
                    className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } transition-transform duration-300 ease-in-out z-50`}
                >
                    <div className="p-6 border-b">
                        <img src={logo} alt="Logo" className="h-12 mx-auto" />
                        <h2 className="text-xl font-semibold text-center mt-4">Dashboard</h2>
                    </div>
                    <nav className="mt-6">
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="/customer/dashboard"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/customer/dashboard"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
                                >
                                    Transactions
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/customer/dashboard"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
                                >
                                    Profile
                                </a>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>
                {/* Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}
                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Navbar */}
                    <nav className="bg-white shadow-sm sticky top-0 z-30">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16 items-center">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="text-gray-700 focus:outline-none"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                </button>
                                <div className="flex flex-row items-center space-x-5">
                                    <h1 className="text-xl font-semibold">Profile Edit</h1>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <div>
                        <div className="lg:w-[50%] w-[85%] my-20 mx-auto p-6 bg-white shadow rounded-lg">
                            <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>
                            {message && (
                                <div
                                    className={`p-4 mb-4 text-white rounded ${message.type === "success" ? "bg-green-500" : "bg-red-500"
                                        }`}
                                >
                                    {message.text}
                                </div>
                            )}
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
                                    />
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
                                    >
                                        {loading ? "Updating..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="">
                            <h1></h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
