import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // Ensure axios is imported
import { Head, Link } from "@inertiajs/react";
import CustomerDashboardLayout from "@/Layouts/CustomerDashboardLayout";
import Joyride from 'react-joyride';
import { Tooltip } from "flowbite-react";
import IonIcon from "@reacticons/ionicons";


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
    const [run, setRun] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
    });
    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const scrollTopRef=useRef(null);

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
                password: "",
            });
        }
    };

    useEffect(() => {
        loadCustomerData();
    }, []);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prevData) => ({ ...prevData, [name]: value }));
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
        if (passwordData.new_password) {
            if (!passwordData.old_password) {
                setMessage({ type: "error", text: "Password lama harus diisi untuk mengganti password." });
                setLoading(false);
                return;
            }
            if (passwordData.new_password !== passwordData.new_password_confirmation) {
                setMessage({ type: "error", text: "Password baru dan konfirmasi password tidak cocok." });
                setLoading(false);
                return;
            }
            if (passwordData.old_password === passwordData.new_password) {
                setMessage({ type: "error", text: "Password baru tidak boleh sama dengan password lama." });
                setLoading(false);
                return;
            }
            if (passwordData.new_password.length < 8) {
                setMessage({ type: "error", text: "Password baru harus minimal 8 karakter." });
                setLoading(false);
                return;
            }
        }

        const updatedData = {
            ...formData,
            old_password: passwordData.old_password,
            new_password: passwordData.new_password,
            new_password_confirmation: passwordData.new_password_confirmation,
        };

        if (passwordData.new_password) {
            updatedData.new_password = passwordData.new_password;
            updatedData.old_password = passwordData.old_password;
            updatedData.new_password_confirmation = passwordData.new_password_confirmation;
        }

        try {
            const response = await axios.put(
                `/api/customer/${customerData.id}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const updatedCustomer = response.data.customer;
            setCustomerData(updatedCustomer);
            localStorage.setItem("customer-data", JSON.stringify(updatedCustomer));
            setPasswordData({
                old_password: "",
                new_password: "",
                new_password_confirmation: "",
            });
            setMessage({ type: "success", text: "Profile updated successfully!" });
            setTimeout(() => {
                if (scrollTopRef.current) {
                    scrollTopRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }, 100);
        } catch (error) {
            console.error("Error updating profile:", error);
            const errorMessage =
                error.response?.data?.message || "Harap Isi Password lama untuk menyimpan perubahan";
            setMessage({ type: "error", text: errorMessage });
            setTimeout(() => {
                if (scrollTopRef.current) {
                    scrollTopRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }, 100);
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
                        <h2 className="text-xl font-semibold leading-tight text-white start-instruksi">
                            Edit Profile
                        </h2>
                    </div>
                }
            >
                <div ref={scrollTopRef} className="max-w-7xl text-black mx-auto pt-10 md:pb-0 pb-10 md:pt-0 p-0 md:p-6 instruksi-pertama">
                    <Link href="/customer/dashboard">
                        <button className="text-blue-500 my-6">
                            Kembali Ke Halaman
                        </button>
                    </Link>
                    <span className="flex flex-row items-center space-x-3 mb-4">
                        <h1 className="text-2xl font-semibold">Edit Profile</h1>
                        <Tooltip content={
                            <div>
                                <h1>setiap kali melakukan perubahan, harus mengisi passwordnya.</h1>
                            </div>
                        }>
                            <IonIcon name="alert-circle" />
                        </Tooltip>
                    </span>
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
                                <label className="block text-gray-700">Alamat</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
                                />
                            </div>
                        </div>

                        {/* Password Section */}
                        <div className="bg-white p-4 space-y-6 shadow sm:rounded-lg sm:p-8">
                            <h1 className="font-bold text-xl">Ubah Password</h1>
                            {[
                                { label: "Password", name: "old_password", placeholder: "Masukkan password Anda" },
                                { label: "Password Baru", name: "new_password", placeholder: "Masukkan password baru Anda" },
                                { label: "Konfirmasi Password Baru", name: "new_password_confirmation", placeholder: "Konfirmasi password baru Anda" },
                            ].map((item, index) => (
                                <div key={index}>
                                    <label className="block text-gray-700">{item.label}</label>
                                    <div className="relative instruksi-kedua">
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            name={item.name}
                                            value={passwordData[item.name]}
                                            onChange={handlePasswordChange}
                                            placeholder={item.placeholder}
                                            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                        >
                                            {passwordVisible ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-gray-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9.75 9.75L15.25 15.25M9.75 15.25L15.25 9.75"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-gray-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 4.5a7.5 7.5 0 017.5 7.5A7.5 7.5 0 0112 19.5a7.5 7.5 0 010-15zm0 3a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full instruksi-ketiga bg-blue-600 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                                    }`}
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