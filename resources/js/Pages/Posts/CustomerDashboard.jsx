// resources/js/Pages/Customer/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';

export default function CustomerDashboard({ laundryRequests = [] }) {
    const [customerData, setCustomerData] = useState(null);
    const [showRequestForm, setShowRequestForm] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        description: '',
        service_type: 'regular',
        pickup_address: '',
        pickup_time: '',
        notes: ''
    });
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
    const handleSubmitRequest = (e) => {
        e.preventDefault();
        post(route('customer.requests.store'), {
            onSuccess: () => {
                reset();
                setShowRequestForm(false);
            }
        });
    };
    return (
        <>
            <Head title="Customer Dashboard" />
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
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
                {/* content */}
                <div className="py-10">
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
                {/* Request Laundry Section */}
                <div className="bg-white max-w-7xl mx-auto overflow-hidden shadow-sm sm:rounded-lg mb-6">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">Laundry Request</h2>
                            <button
                                onClick={() => setShowRequestForm(!showRequestForm)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                {showRequestForm ? 'Cancel' : 'New Request'}
                            </button>
                        </div>

                        {showRequestForm && (
                            <form onSubmit={handleSubmitRequest} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        rows="3"
                                        placeholder="Describe your laundry items"
                                    ></textarea>
                                    {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Service Type</label>
                                    <select
                                        value={data.service_type}
                                        onChange={e => setData('service_type', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    >
                                        <option value="regular">Regular (2-3 days)</option>
                                        <option value="express">Express (1 day)</option>
                                        <option value="super_express">Super Express (Same day)</option>
                                    </select>
                                    {errors.service_type && <div className="text-red-500 text-sm">{errors.service_type}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Pickup Address</label>
                                    <textarea
                                        value={data.pickup_address}
                                        onChange={e => setData('pickup_address', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        rows="2"
                                        placeholder="Enter your pickup address"
                                    ></textarea>
                                    {errors.pickup_address && <div className="text-red-500 text-sm">{errors.pickup_address}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Pickup Time</label>
                                    <input
                                        type="datetime-local"
                                        value={data.pickup_time}
                                        onChange={e => setData('pickup_time', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.pickup_time && <div className="text-red-500 text-sm">{errors.pickup_time}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        rows="2"
                                        placeholder="Any special instructions?"
                                    ></textarea>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}