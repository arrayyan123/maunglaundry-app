import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import EntryTransaction from "@/Components/CustomerDashboard/EntryTransaction";
import TransactionDetail from "@/Components/CustomerDashboard/TransactionDetail";
import { Fade } from "react-reveal";
import DistanceCalculator from "@/Components/DistanceCalculator";

const pngImages = import.meta.glob("/public/assets/Images/*.png", { eager: true });
const webpImages = import.meta.glob("/public/assets/Images/*.webp", { eager: true });
const images = { ...pngImages, ...webpImages };

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const dummypic = getImageByName("dummy-profpic");
const logo = getImageByName("Logo_maung");

console.log(dummypic, logo);


export default function CustomerDashboard() {
    const [customerData, setCustomerData] = useState(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleViewDetails = async (transactionId) => {
        try {
            setLoading(true);
            const details = await fetchTransactionDetails(transactionId);
            if (details) {
                setTransactionDetails(details);
                setSelectedTransactionId(transactionId);
            }
        } catch (error) {
            console.error("Error fetching transaction details:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("customer-token");
        if (!storedToken) {
            window.location.href = "/customer/login";
        } else {
            const storedCustomer = localStorage.getItem("customer-data");
            if (storedCustomer) {
                const customer = JSON.parse(storedCustomer);
                setCustomerData(customer);
                fetchTransactions(customer.id);
            }
        }
    }, []);

    const fetchTransactions = async (customerId) => {
        try {
            const response = await axios.get(`/api/admin/transactions/${customerId}`);
            console.log("Transactions fetched:", response.data.transaction);
            setTransactions(response.data.transaction);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const fetchTransactionDetails = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/admin/transaction-details/${id}`);
            console.log("Transaction details fetched:", response.data);
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            console.error("Error fetching transaction details:", error);
            return null;
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("customer-token");
        localStorage.removeItem("customer-data");
        window.location.href = "/customer/login";
    };

    const handleCloseDetails = () => {
        setSelectedTransactionId(null);
        setTransactionDetails(null);
    };

    return (
        <>
            <Head title="Customer Dashboard" />
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center gap-6">
                                <img src={logo} className="block h-9 w-auto fill-current text-gray-800" alt="Logo" />
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
                                        <div className="mb-6">
                                            <h2 className="text-lg font-medium mb-4">Welcome, {customerData.name}!</h2>
                                            <p>Email: {customerData.email}</p>
                                            <p>Address: {customerData.address}</p>
                                            <DistanceCalculator customerAddress={customerData?.address} />
                                        </div>
                                    )}

                                    {loading && <p>Loading transactions...</p>}

                                    {selectedTransactionId ? (
                                        <TransactionDetail
                                            customerId={customerData?.id}
                                            transactionId={selectedTransactionId}
                                            onClose={handleCloseDetails}
                                        />
                                    ) : (
                                        <EntryTransaction
                                            customerId={customerData?.id}
                                            transactions={transactions}
                                        />
                                    )}
                                    {!selectedTransactionId && transactions.length > 0 && customerData && (
                                        <Fade>
                                            <div className="mx-auto max-w-6xl p-6 my-10 bg-white rounded-lg">
                                                <h3 className="text-lg font-semibold">Transactions</h3>
                                                <ul>
                                                    {transactions.map((transaction) => (
                                                        <li key={transaction.id}>
                                                            <button
                                                                className="text-blue-600"
                                                                onClick={() => handleViewDetails(transaction.id)} // 
                                                            >
                                                                View Transaction {transaction.nama_produk} status ({transaction.status_payment})
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </Fade>
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
