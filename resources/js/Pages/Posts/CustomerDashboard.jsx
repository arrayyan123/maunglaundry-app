import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import EntryTransaction from "@/Components/CustomerDashboard/EntryTransaction";
import TransactionDetail from "@/Components/CustomerDashboard/TransactionDetail";
import DistanceCalculator from "@/Components/DistanceCalculator";
import { Fade } from "react-awesome-reveal";

const pngImages = import.meta.glob("/public/assets/Images/*.png", { eager: true });
const webpImages = import.meta.glob("/public/assets/Images/*.webp", { eager: true });
const images = { ...pngImages, ...webpImages };

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const dummypic = getImageByName("dummy-profpic");
const logo = getImageByName("Logo_maung");

export default function CustomerDashboard() {
    const [customerData, setCustomerData] = useState(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filterProductName, setFilterProductName] = useState('');
    const [filterPaymentStatus, setFilterPaymentStatus] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Pagination logic
    const totalPages = Math.ceil(transactions.length / itemsPerPage);

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
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        const matchesProductName = transaction.nama_produk
            .toLowerCase()
            .includes(filterProductName.toLowerCase());
        const matchesPaymentStatus = filterPaymentStatus
            ? transaction.status_payment === filterPaymentStatus
            : true;
        return matchesProductName && matchesPaymentStatus;
    });

    const currentTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
            setTransactions(response.data.transaction);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const fetchTransactionDetails = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/admin/transaction-details/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching transaction details:", error);
            return null;
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

    const handleCloseDetails = () => {
        setSelectedTransactionId(null);
        setTransactionDetails(null);
    };

    return (
        <>
            <Head title="Customer Dashboard" />
            <div className="min-h-screen flex bg-gray-100 scroll-smooth">
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
                                    href="#"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#transactions"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
                                >
                                    Transactions
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#profile"
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
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
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
                                    <h1 className="text-xl font-semibold">Customer Dashboard</h1>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Content */}
                    <div className="py-6 px-4 sm:px-6 lg:px-8">
                        <main>
                            <div className="bg-white shadow sm:rounded-lg p-6">
                                {customerData && (
                                    <div className="mb-6">
                                        <h2 className="text-lg font-medium mb-4">
                                            Welcome, {customerData.name}!
                                        </h2>
                                        <p>Email: {customerData.email}</p>
                                        <p>Address: {customerData.address}</p>
                                        <DistanceCalculator customerAddress={customerData?.address} />
                                        <button
                                            onClick={() => (window.location.href = `/customer/edit-profile/${customerData.id}`)}
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
                                        >
                                            Edit Profile
                                        </button>
                                    </div>
                                )}

                                {loading && <p>Loading transactions...</p>}

                                {selectedTransactionId ? (
                                    <TransactionDetail
                                        customerId={customerData?.id}
                                        transactionId={selectedTransactionId}
                                        onClose={() => setSelectedTransactionId(null)}
                                    />
                                ) : (
                                    <Fade>
                                        <div id="transactions" className="mx-auto max-w-7xl p-6 mb-10 bg-white rounded-lg">
                                            <h3 className="text-xl font-semibold text-center">Masukkan info Transaksi anda</h3>
                                            <EntryTransaction
                                                customerId={customerData?.id}
                                                transactions={transactions}
                                            />
                                            <div className="mb-6">
                                                <div className="flex flex-col md:flex-row md:space-x-4">
                                                    {/* Search bar for Product Name */}
                                                    <input
                                                        type="text"
                                                        placeholder="Search by Product Name"
                                                        className="border px-4 py-2 rounded-md focus:outline-none focus:ring"
                                                        value={filterProductName}
                                                        onChange={(e) => setFilterProductName(e.target.value)}
                                                    />

                                                    {/* Dropdown for Payment Status */}
                                                    <select
                                                        className="border px-4 py-2 rounded-md focus:outline-none focus:ring"
                                                        value={filterPaymentStatus}
                                                        onChange={(e) => setFilterPaymentStatus(e.target.value)}
                                                    >
                                                        <option value="">All Payment Status</option>
                                                        <option value="paid">Paid</option>
                                                        <option value="unpaid">Unpaid</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <ul>
                                                {currentTransactions.map((transaction) => (
                                                    <li key={transaction.id} className="border-b py-2">
                                                        <button
                                                            className="text-blue-600 hover:text-blue-800"
                                                            onClick={() => handleViewDetails(transaction.id)}
                                                        >
                                                            View Transaction {transaction.nama_produk} status (
                                                            {transaction.status_payment})
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* Pagination Controls */}
                                            <div className="flex justify-between items-center mt-6">
                                                <button
                                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className={`px-4 py-2 text-sm font-medium border rounded-lg ${currentPage === 1
                                                        ? "cursor-not-allowed bg-gray-200 text-gray-500"
                                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                                        }`}
                                                >
                                                    Prev
                                                </button>
                                                <span className="text-sm">
                                                    Page {currentPage} of {totalPages}
                                                </span>
                                                <button
                                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                    className={`px-4 py-2 text-sm font-medium border rounded-lg ${currentPage === totalPages
                                                        ? "cursor-not-allowed bg-gray-200 text-gray-500"
                                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                                        }`}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    </Fade>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}