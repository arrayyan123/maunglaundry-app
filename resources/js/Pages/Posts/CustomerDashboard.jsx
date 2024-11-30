import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import EntryTransaction from "@/Components/CustomerDashboard/EntryTransaction";
import TransactionDetail from "@/Components/CustomerDashboard/TransactionDetail";
import DistanceCalculator from "@/Components/DistanceCalculator";
import { Fade } from "react-awesome-reveal";
import NotificationTwilio from "@/Components/AdminDashboard/NotificationTwilio";

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
    const [showEntryTransaction, setShowEntryTransaction] = useState(false);
    const [showNotificationTwilio, setShowNotificationTwilio] = useState(false);
    const [filterProductName, setFilterProductName] = useState('');
    const [filterPaymentStatus, setFilterPaymentStatus] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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
    const handleToggleEntryTransaction = () => {
        setShowEntryTransaction(!showEntryTransaction);
    };
    const handleToggleNotificationTwilio = () => {
        setShowNotificationTwilio(!showNotificationTwilio);
    }

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
                            <li>{customerData && (
                                    <a
                                        href={`/customer/edit-profile/${customerData.id}`}
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
                                    >
                                        Profile
                                    </a>
                                )}
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
                    <nav className="bg-blue-400 shadow-sm sticky inset-0 top-0 z-20">
                        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 xl:px-4">
                            <div className="flex justify-between h-16 md:space-x-0 space-x-6 items-center">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="text-white focus:outline-none"
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
                                    <h1 className="text-xl text-white font-semibold">Customer Dashboard</h1>
                                    {customerData && (
                                        <h1 className="text-sm text-white">{customerData.name}</h1>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>
                    {/* Content */}
                    <div className="py-6 px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                            <Fade cascade>
                                <div className="bg-green-500 text-white p-6 rounded-lg shadow">
                                    <h3 className="text-xl font-bold">Total Transactions</h3>
                                    <p className="text-3xl">{transactions.length}</p>
                                </div>
                                <div className="bg-yellow-500 text-white p-6 rounded-lg shadow">
                                    <h3 className="text-xl font-bold">Pending Requests</h3>
                                    <p className="text-3xl">{transactions.filter(transaction => transaction.status_job === 'pending').length}</p>
                                </div>
                                <div className="bg-green-500 text-white p-6 rounded-lg shadow">
                                    <h3 className="text-xl font-bold">Done Requests</h3>
                                    <p className="text-3xl">{transactions.filter(transaction => transaction.status_job === 'done').length}</p>
                                </div>
                                <div className="bg-red-500 text-white p-6 rounded-lg shadow">
                                    <h3 className="text-xl font-bold">Cancel Requests</h3>
                                    <p className="text-3xl">{transactions.filter(transaction => transaction.status_job === 'cancel').length}</p>
                                </div>
                                <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
                                    <h3 className="text-xl font-bold">Ongoing Requests</h3>
                                    <p className="text-3xl">{transactions.filter(transaction => transaction.status_job === 'ongoing').length}</p>
                                </div>
                            </Fade>
                        </div>
                        <main>
                            <div className="bg-white shadow sm:rounded-lg p-6">
                                {customerData && (
                                    <div className="mb-6">
                                        <h2 className="text-lg font-medium mb-4">
                                            Selamat Datang, {customerData.name}!
                                        </h2>
                                        <p>Email: {customerData.email}</p>
                                        <p>Alamat: {customerData.address}</p>
                                        <DistanceCalculator customerAddress={customerData?.address} />
                                        <div className="flex space-x-4 mt-4">
                                            <button
                                                onClick={() => (window.location.href = `/customer/edit-profile/${customerData.id}`)}
                                                className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                                            >
                                                Edit Profile
                                            </button>
                                            <button
                                                onClick={handleToggleEntryTransaction}
                                                className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-lg"
                                            >
                                                Masukkan Transaksi
                                            </button>
                                            <button
                                                onClick={handleToggleNotificationTwilio}
                                                className="px-4 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg"
                                            >
                                                Nyalakan Notifikasi
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {loading && <p>Loading transactions...</p>}

                                {showNotificationTwilio && !showEntryTransaction && !selectedTransactionId && (
                                    <NotificationTwilio
                                        handleToggleNotificationTwilio={handleToggleNotificationTwilio}
                                    />
                                )}
                                {selectedTransactionId ? (
                                    <TransactionDetail
                                        customerId={customerData?.id}
                                        transactionId={selectedTransactionId}
                                        onClose={() => setSelectedTransactionId(null)}
                                    />
                                ) : (
                                    <Fade>
                                        <div id="transactions" className="mx-auto max-w-7xl lg:p-6 mb-10 bg-white rounded-lg">
                                            <div className="mb-6">
                                                {showEntryTransaction && (
                                                    <div className="bg-gray-100 p-6 mb-5 rounded-lg shadow-lg">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <h3 className="text-xl text-center font-semibold">Masukkan Info Transaksi Anda</h3>
                                                            <button
                                                                className="text-red-500 hover:text-red-600 font-bold"
                                                                onClick={handleToggleEntryTransaction}
                                                            >
                                                                Close
                                                            </button>
                                                        </div>
                                                        <EntryTransaction
                                                            customerId={customerData?.id}
                                                            transactions={transactions}
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex flex-col md:space-y-0 space-y-4 md:flex-row md:space-x-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Search by Product Name"
                                                        className="border px-4 py-2 rounded-md focus:outline-none focus:ring"
                                                        value={filterProductName}
                                                        onChange={(e) => setFilterProductName(e.target.value)}
                                                    />
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