import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Head } from "@inertiajs/react";
import axios from "axios";
import EntryTransaction from "@/Components/CustomerDashboard/EntryTransaction";
import TransactionDetail from "@/Components/CustomerDashboard/TransactionDetail";
import DistanceCalculator from "@/Components/DistanceCalculator";
import { Fade, Slide } from "react-awesome-reveal";
import NotificationTwilio from "@/Components/CustomerDashboard/NotificationTwilio";
import CustomerDashboardLayout from "@/Layouts/CustomerDashboardLayout";
import IonIcon from "@reacticons/ionicons";
import SlotCounter from 'react-slot-counter';
import Joyride from 'react-joyride';
import { Tooltip } from "flowbite-react";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Keyboard, Pagination, Navigation } from 'swiper/modules';
import EntryInstructionModal from "./EntryInstructionModal";

const pngImages = import.meta.glob("/public/assets/Images/*.png", { eager: true });
const webpImages = import.meta.glob("/public/assets/Images/*.webp", { eager: true });
const images = { ...pngImages, ...webpImages };

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const adminPic = getImageByName("Admin-Book-cartoon");
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
    const [filterStatusJob, setFilterStatusJob] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [run, setRun] = useState(false);
    const [showEntryInstructionModal, setShowEntryInstructionModal] = useState(false)
    const entryTransactionRef = useRef(null);
    const notificationRef = useRef(null);
    const [currentYear] = useState(new Date().getFullYear());

    const handleStatusCardClick = (status) => {
        const routeUrl = route('customer.report', { status_job: status });
        window.location.href = routeUrl;
    };

    const handlePaymentCardClick = (statuspayment) => {
        const routeUrl = route('customer.report', { status_payment: statuspayment });
        window.location.href = routeUrl;
    };

    const handleCardClickYear = (year) => {
        const routeUrl = route('customer.report', { year });
        window.location.href = routeUrl;
    };

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

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesProductName = transaction.nama_produk
            .toLowerCase()
            .includes(filterProductName.toLowerCase());
        const matchesPaymentStatus = filterPaymentStatus
            ? transaction.status_payment === filterPaymentStatus
            : true;
        const matchesStatusJob = filterStatusJob
            ? transaction.status_job === filterStatusJob
            : true;
        const transactionStartDate = new Date(transaction.start_date);
        const isDateInRange =
            (!filterStartDate || transactionStartDate >= new Date(filterStartDate)) &&
            (!filterEndDate || transactionStartDate <= new Date(filterEndDate));

        return matchesProductName && matchesPaymentStatus && matchesStatusJob && isDateInRange;
    });

    const itemsPerPage = 5;

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

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

    const handleCloseDetails = () => {
        setSelectedTransactionId(null);
        setTransactionDetails(null);
    };
    const handleToggleEntryTransaction = () => {
        setShowEntryTransaction(!showEntryTransaction);
        setShowNotificationTwilio(false);
        setShowEntryInstructionModal(true);
        setTimeout(() => {
            if (entryTransactionRef.current) {
                entryTransactionRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 100);

    };
    const handleToggleNotificationTwilio = () => {
        setShowNotificationTwilio(!showNotificationTwilio);
        setShowEntryTransaction(false);
        setTimeout(() => {
            if (notificationRef.current) {
                notificationRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 100);
    }

    const handleCloseEntryTransaction = () => {
        setShowEntryTransaction(false);
        setShowEntryInstructionModal(false);
    };
    const handleCloseEntryModal = () => {
        setShowEntryInstructionModal(false);
    }
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setShowEntryInstructionModal(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <>
            <CustomerDashboardLayout
                header={
                    <div>
                        <h2 className="text-xl start-instruksi font-semibold leading-tight text-white">
                            Customer Dashboard
                        </h2>
                    </div>
                }
            >
                <Head title="Customer Dashboard" />
                <div className="instruksi-pertama relative my-6 p-10 md:py-12 py-20 animated-background bg-gradient-to-r from-blue-500 to-indigo-200 rounded-xl text-black">
                    <div className="absolute z-0 top-1/2 left-10 -translate-y-1/2">
                        <img
                            src={adminPic}
                            className="w-[60%] md:block hidden sm:w-[30%] lg:w-[30%] xl:w-[25%] h-auto"
                            alt="Admin"
                        />
                    </div>
                    {customerData && (
                        <h1 className="font-bold lg:text-[35px] text-right sm:text-[25px] text-[20px] text-black">
                            HI! {customerData.name}
                        </h1>
                    )}
                    <p className='text-right'>Selamat Datang di Dashboard Customer Laundry</p>
                </div>
                {customerData && (
                    <div className="grid instruksi-kedua md:grid-cols-2 grid-flow-row md:space-x-2 space-x-0 md:space-y-0 space-y-2">
                        <div className="bg-white shadow-xl px-5 py-4 rounded-lg flex flex-col gap-3 justify-center">
                            <span className="text-black font-semibold flex flex-row items-center gap-5">
                                <div className="bg-yellow-200 flex p-4 rounded-full">
                                    <IonIcon className="text-yellow-500" name="mail" />
                                </div>
                                <h1>{customerData.email || "(masukkan email anda dengan edit profile)"}</h1>
                            </span>
                            <span className="text-black font-semibold flex flex-row items-center gap-5">
                                <div className="bg-purple-200 flex p-4 rounded-full">
                                    <IonIcon className="text-purple-500" name="call" />
                                </div>
                                <h1>{customerData.phone}</h1>
                            </span>
                        </div>
                        <div className="bg-white shadow-xl px-5 py-4 rounded-lg text-black">
                            <span className="text-black font-semibold flex flex-row items-center gap-5">
                                <div className="bg-green-200 flex p-4 rounded-full">
                                    <IonIcon className="text-green-500" name="home" />
                                </div>
                                <h1>{customerData.address}</h1>
                            </span>
                            <DistanceCalculator customerAddress={customerData?.address} />
                        </div>
                    </div>
                )}

                <div className="my-3 instruksi-ketiga relative z-0 md:hidden block">
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={30}
                        keyboard={{
                            enabled: true,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={false}
                        modules={[Keyboard, Pagination, Navigation]}
                        className="mySwiper"
                    >
                        <SwiperSlide>
                            <div
                                onClick={() => handleCardClickYear(currentYear)}
                                className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                                <div className='bg-green-200 p-3 flex rounded-full'>
                                    <IonIcon className='text-xl' name="stats-chart"></IonIcon>
                                </div>
                                <div className='flex flex-col'>
                                    <h3 className="text-sm font-bold">Total Transaksi ({currentYear})</h3>
                                    <p className="text-3xl"><SlotCounter value={transactions.length} /></p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div
                                onClick={() => handleStatusCardClick('pending')}
                                className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                                <div className='bg-yellow-200 p-3 flex rounded-full'>
                                    <IonIcon className='text-yellow-500 text-[30px]' name="warning" />
                                </div>
                                <div className='flex flex-col'>
                                    <h3 className="text-sm font-bold">Pending Requests</h3>
                                    <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_job === 'pending').length} /></p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div
                                onClick={() => handleStatusCardClick('done')}
                                className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                                <div className='bg-green-200 p-3 flex rounded-full'>
                                    <IonIcon className='text-green-500 text-[30px]' name="checkmark"></IonIcon>
                                </div>
                                <div className='flex flex-col'>
                                    <h3 className="text-sm font-bold">Done Requests</h3>
                                    <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_job === 'done').length} /></p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div
                                onClick={() => handleStatusCardClick('cancel')}
                                className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                                <div className='bg-red-200 p-3 flex rounded-full'>
                                    <IonIcon className='text-red-500 text-[30px]' name="ban"></IonIcon>
                                </div>
                                <div className='flex flex-col'>
                                    <h3 className="text-sm font-bold">Canceled Requests</h3>
                                    <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_job === 'cancel').length} /></p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div
                                onClick={() => handleStatusCardClick('ongoing')}
                                className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                                <div className='bg-blue-200 p-3 flex rounded-full'>
                                    <IonIcon className='text-blue-500 text-[30px]' name="calendar"></IonIcon>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-bold">Ongoing Requests</h3>
                                    <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_job === 'ongoing').length} /></p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div
                                onClick={() => handlePaymentCardClick('unpaid')}
                                className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                                <div className='bg-red-200 p-3 flex rounded-full'>
                                    <IonIcon className='text-red-500 text-[30px]' name="cash"></IonIcon>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-bold">Unpaid Requests</h3>
                                    <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_payment === 'unpaid').length} /></p>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
                <div className="instruksi-ketiga md:grid hidden grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <Fade>
                        <div
                            onClick={() => handleCardClickYear(currentYear)}
                            className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <div className='bg-green-200 p-3 flex rounded-full'>
                                <IonIcon className='text-xl' name="stats-chart"></IonIcon>
                            </div>
                            <div className='flex flex-col'>
                                <h3 className="text-xl font-bold">Total Transaksi ({currentYear})</h3>
                                <p className="text-3xl"><SlotCounter value={transactions.length} /></p>
                            </div>
                        </div>
                        <div
                            onClick={() => handleStatusCardClick('pending')}
                            className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <div className='bg-yellow-200 p-3 flex rounded-full'>
                                <IonIcon className='text-yellow-500 text-[30px]' name="warning" />
                            </div>
                            <div className='flex flex-col'>
                                <h3 className="text-xl font-bold">Pending Requests</h3>
                                <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_job === 'pending').length} /></p>
                            </div>
                        </div>
                        <div
                            onClick={() => handleStatusCardClick('done')}
                            className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <div className='bg-green-200 p-3 flex rounded-full'>
                                <IonIcon className='text-green-500 text-[30px]' name="checkmark"></IonIcon>
                            </div>
                            <div className='flex flex-col'>
                                <h3 className="text-xl font-bold">Done Requests</h3>
                                <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_job === 'done').length} /></p>
                            </div>
                        </div>
                        <div
                            onClick={() => handleStatusCardClick('cancel')}
                            className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <div className='bg-red-200 p-3 flex rounded-full'>
                                <IonIcon className='text-red-500 text-[30px]' name="ban"></IonIcon>
                            </div>
                            <div className='flex flex-col'>
                                <h3 className="text-xl font-bold">Canceled Requests</h3>
                                <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_job === 'cancel').length} /></p>
                            </div>
                        </div>
                        <div
                            onClick={() => handleStatusCardClick('ongoing')}
                            className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <div className='bg-blue-200 p-3 flex rounded-full'>
                                <IonIcon className='text-blue-500 text-[30px]' name="calendar"></IonIcon>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl font-bold">Ongoing Requests</h3>
                                <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_job === 'ongoing').length} /></p>
                            </div>
                        </div>
                        <div
                            onClick={() => handlePaymentCardClick('unpaid')}
                            className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <div className='bg-red-200 p-3 flex rounded-full'>
                                <IonIcon className='text-red-500 text-[30px]' name="cash"></IonIcon>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl font-bold">Unpaid Requests</h3>
                                <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_payment === 'unpaid').length} /></p>
                            </div>
                        </div>
                    </Fade>
                </div>

                {/*pindahkan semua elemen dibawah ini ke dalam CustomerAddTransactionPage dan sesuaikan dengan layout CustomerAddTransactionPage saya. saya akan menggunakan tabs buatan saya*/}
                {/* <main className="instruksi-keempat">
                    <div className="bg-white shadow sm:rounded-lg md:p-6 p-0">
                        {loading && <p>Loading transactions...</p>}

                        {showNotificationTwilio && !showEntryTransaction && !selectedTransactionId && (
                            <div ref={notificationRef}>
                                <NotificationTwilio
                                    handleToggleNotificationTwilio={handleToggleNotificationTwilio}
                                />
                            </div>
                        )}
                        {selectedTransactionId ? (
                            <TransactionDetail
                                customerId={customerData?.id}
                                transactionId={selectedTransactionId}
                                onClose={() => setSelectedTransactionId(null)}
                            />
                        ) : (
                            <Fade>
                                <div id="transactions" className="mx-auto max-w-7xl lg:p-3 p-0 mb-10 bg-white rounded-lg">
                                    <div className="mb-6">
                                        {showEntryTransaction && (
                                            <div className="bg-gray-100 p-0 pb-4 mb-5 rounded-lg shadow-lg">
                                                <div ref={entryTransactionRef} className="flex p-4 justify-between items-center mb-4">
                                                    <h3 className="text-xl text-center font-semibold">Masukkan Info Transaksi Anda</h3>
                                                    <button
                                                        className="text-red-500 hover:text-red-600 font-bold"
                                                        onClick={handleCloseEntryTransaction}
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
                                        <div className="flex flex-col text-black lg:space-y-0 space-y-4 p-3 xl:flex-row lg:space-x-4">
                                            <Tooltip content={
                                                <div className="p-4">
                                                    <h1>Warna Status</h1>
                                                    <ul className="list-disc">
                                                        <li>status job: cancel - <strong className="text-red-500">merah</strong></li>
                                                        <li>status job: ongoing - <strong className="text-blue-500">biru</strong></li>
                                                        <li>status job: pending - <strong className="text-yellow-500">kuning</strong></li>
                                                        <li>status job: done - <strong className="text-green-500">hijau</strong></li>
                                                    </ul>
                                                </div>
                                            }>
                                                <div className="flex flex-row gap-1">
                                                    <p>Hint:</p> 
                                                    <IonIcon className="text-black animate-bounce text-[20px]" name="alert-circle" />
                                                </div>
                                            </Tooltip>
                                            <div className="flex flex-col">
                                                <label htmlFor="">Penelusuri</label>
                                                <input
                                                    type="text"
                                                    placeholder="Search by Product Name"
                                                    className="border px-4 py-2 rounded-md focus:outline-none focus:ring"
                                                    value={filterProductName}
                                                    onChange={(e) => setFilterProductName(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="">Status Pembayaran</label>
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
                                            <div className="flex flex-col">
                                                <label htmlFor="">Status Job</label>
                                                <select
                                                    className="border px-4 py-2 rounded-md focus:outline-none focus:ring"
                                                    value={filterStatusJob}
                                                    onChange={(e) => setFilterStatusJob(e.target.value)}
                                                >
                                                    <option value="">All Status Job</option>
                                                    <option value="ongoing">Ongoing</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="cancel">Canceled</option>
                                                    <option value="done">Done</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="start date">Tanggal Mulai</label>
                                                <input
                                                    type="date"
                                                    className="border px-4 py-2 rounded-md focus:outline-none focus:ring"
                                                    value={filterStartDate}
                                                    onChange={(e) => setFilterStartDate(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="end date">Tanggal Selesai</label>
                                                <input
                                                    type="date"
                                                    className="border px-4 py-2 rounded-md focus:outline-none focus:ring"
                                                    value={filterEndDate}
                                                    onChange={(e) => setFilterEndDate(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <ul>
                                        {currentTransactions.map((transaction) => (
                                            <li key={transaction.id} className="border-b py-2 px-3">
                                                <button
                                                    className={`${transaction.status_job === 'cancel'
                                                        ? 'bg-red-500'
                                                        : transaction.status_job === 'pending'
                                                            ? 'bg-yellow-500'
                                                            : transaction.status_job === 'ongoing'
                                                                ? 'bg-blue-500'
                                                                : transaction.status_job === 'done'
                                                                    ? 'bg-green-500'
                                                                    : 'bg-gray-500'
                                                        } text-white w-full px-3 py-2 rounded-xl`}
                                                    onClick={() => handleViewDetails(transaction.id)}
                                                >
                                                    <div className="relative text-white hover:font-bold cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-white before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-white after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]">
                                                        <span className="flex sm:flex-row flex-col items-center sm:space-x-5 space-x-0 justify-between">
                                                            <p>
                                                                View Transaction {transaction.nama_produk} status (
                                                                {transaction.status_payment})
                                                            </p>
                                                            <p>Status Job: {transaction.status_job}</p>
                                                            <p>Tanggal Mulai: {transaction.start_date}</p>
                                                            <p>Tanggal Selesai: {transaction.end_date}</p>
                                                        </span>
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>

                                    <EntryInstructionModal
                                        isOpen={showEntryInstructionModal}
                                        onClose={handleCloseEntryModal}
                                        logo={logo}
                                    />
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
                </main> */}
            </CustomerDashboardLayout>
        </>
    );
}