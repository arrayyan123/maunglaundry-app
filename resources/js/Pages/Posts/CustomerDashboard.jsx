// resources/js/Pages/Customer/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
const images = import.meta.glob('/public/assets/Images/*.png', { eager: true });

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}.png`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const logo = getImageByName('Logo_maung');

export default function CustomerDashboard() {
    const [customerData, setCustomerData] = useState(null);
    useEffect(() => {
        const storedCustomer = localStorage.getItem('customer-data');
        if (storedCustomer) {
            setCustomerData(JSON.parse(storedCustomer));
        }
    }, []);
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('customer-token');
        localStorage.removeItem('customer-data');
        post(route('customer.logout'));
        window.location.href = '/customer/login';
    };
    return (
        <>
            <Head title="Customer Dashboard" />
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center gap-6">
                                <img src={logo} className="block h-9 w-auto fill-current text-gray-800" alt="" />
                                <h1 className="text-xl font-semibold">Customer Dashboard</h1>
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={handleLogout}
                                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="py-6">
                    <main>
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    {customerData && (
                                        <div>
                                            <h2 className="text-lg font-medium mb-4">Welcome, {customerData.name}!</h2>
                                            <p>Email: {customerData.email}</p>
                                            <p>Address: {customerData.address}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}