import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import CustomerDashboardLayout from "@/Layouts/CustomerDashboardLayout";

const pngImages = import.meta.glob("/public/assets/Images/*.png", { eager: true });
const webpImages = import.meta.glob("/public/assets/Images/*.webp", { eager: true });
const images = { ...pngImages, ...webpImages };

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const dummypic = getImageByName("dummy-profpic");
const logo = getImageByName("Logo_maung");

export default function EditCustomer() {
    const [customerData, setCustomerData] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const loadCustomerData = () => {
        const storedToken = localStorage.getItem("customer-token");
        if (!storedToken) {
            window.location.href = "/customer/login";
            return;
        }

        const storedCustomer = localStorage.getItem("customer-data");
        if (storedCustomer) {
            const customer = JSON.parse(storedCustomer);
            setCustomerData(customer);
            setFormData({
                name: customer.name || "",
                email: customer.email || "",
                phone: customer.phone || "",
                address: customer.address || "",
            });
        }
    };
    useEffect(() => {
        loadCustomerData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("customer-token");
        if (!token) {
            setMessage({ type: "error", text: "Token not found. Please log in again." });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.put(
                `/api/customer/${customerData.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );

            const updatedCustomer = response.data.customer;
            setCustomerData(updatedCustomer);
            localStorage.setItem("customer-data", JSON.stringify(updatedCustomer));

            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error) {
            console.error("Error updating profile:", error);
            const errorMessage =
                error.response?.data?.message || "Failed to update profile.";
            setMessage({ type: "error", text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Edit Profile" />
            <CustomerDashboardLayout
                header={
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-white">
                            Edit Profile
                        </h2>
                    </div>
                }
            >
                <div className="max-w-7xl mx-auto pt-10 md:pb-0 pb-10 md:pt-0 p-0 md:p-6 ">
                    <Link href="/customer/dashboard"><button className="text-blue-500 my -6">
                        Kembali Ke halaman
                    </button></Link>
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
                        <div className="bg-white p-4 space-y-6 shadow sm:rounded-lg sm:p-8">
                            <h1 className="font-bold text-xl">Ubah informasi akun anda disini</h1>
                            <div>
                                <label className="block text-gray-700">Nama</label>
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
                        </div>
                        <div className="bg-white p-4 space-y-6 shadow sm:rounded-lg sm:p-8">
                            <div>
                                <label className="block text-gray-700">Nomor Telepon</label>
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
            </CustomerDashboardLayout>
        </>
    );
}
