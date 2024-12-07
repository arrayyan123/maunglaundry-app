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

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Keyboard, Pagination, Navigation } from 'swiper/modules';

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
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [run, setRun] = useState(false);
    const [showEntryInstructionModal, setShowEntryInstructionModal] = useState(false)
    const entryTransactionRef = useRef(null);
    const notificationRef = useRef(null);


    const handleClickStart = () => {
        setRun(true);
    };
    const steps = [
        {
            target: '.start-instruksi',
            content: 'Selamat Datang di website dashboard customer maung laundry',
        },
        {
            target: '.instruksi-pertama',
            content: 'Disini anda bisa melihat informasi mengenai akun anda',
        },
        {
            target: '.instruksi-kedua',
            content: 'email anda (jika belum, anda bisa menambahkannya sendiri melalui halaman profil), alamat anda serta jarak dari alamat anda menuju laundry',
        },
        {
            target: '.instruksi-ketiga',
            content: 'Informasi transaksi anda pada laundry',
        },
        {
            target: '.instruksi-keempat',
            content: 'Disini adalah area input transaksi mandiri, informasi transaksi serta menyalakan notifikasi untuk transaksi anda yang masuk. Mohon gunakan dengan bijaksana. Terimakasih telah menggunakan layanan kami.',
        },
    ];

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

        const transactionStartDate = new Date(transaction.start_date);
        const isDateInRange =
            (!filterStartDate || transactionStartDate >= new Date(filterStartDate)) &&
            (!filterEndDate || transactionStartDate <= new Date(filterEndDate));

        return matchesProductName && matchesPaymentStatus && isDateInRange;
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
        setTimeout(() => {
            if (notificationRef.current) {
                notificationRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 100);
    }

    return (
        <>
            <CustomerDashboardLayout
                handleClickStart={handleClickStart}
                header={
                    <div>
                        <h2 className="text-xl start-instruksi font-semibold leading-tight text-white">
                            Customer Dashboard
                        </h2>
                    </div>
                }
            >
                <Joyride
                    run={run}
                    steps={steps}
                    styles={{
                        options: {
                            arrowColor: '#57c2ff',
                            backgroundColor: '#57c2ff',
                            overlayColor: 'rgba(79, 26, 0, 0.4)',
                            primaryColor: '#000',
                            textColor: '#004a14',
                            width: 400,
                            zIndex: 1000,
                        },
                    }}
                />
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
                    <p className='text-right'>Selamat Datang di Dashboard Customer Maung Laundry</p>
                </div>
                {customerData && (
                    <div className="grid instruksi-kedua md:grid-cols-2 grid-flow-row md:space-x-2 space-x-0 md:space-y-0 space-y-2">
                        <div className="bg-blue-400 px-5 py-4 rounded-lg flex items-center">
                            <h1 className="text-white text-xl font-semibold mx-auto">Email: {customerData.email}</h1>
                        </div>
                        <div className="bg-blue-400 px-5 py-4 rounded-lg text-white">
                            <h1 className="text-white font-semibold">Alamat: {customerData.address}</h1>
                            <DistanceCalculator customerAddress={customerData?.address} />
                        </div>
                    </div>
                )}
                <div className="flex flex-col md:flex-row justify-center md:space-x-4 space-y-4 md:space-y-0 mt-4 w-full">
                    <button
                        onClick={handleToggleEntryTransaction}
                        className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-lg flex-grow"
                    >
                        <span className="flex flex-row items-center justify-center space-x-2">
                            <IonIcon name="add-circle"></IonIcon>
                            <p>Masukkan Transaksi</p>
                        </span>
                    </button>
                    <button
                        onClick={handleToggleNotificationTwilio}
                        className="px-4 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg flex-grow"
                    >
                        <span className="flex flex-row items-center justify-center space-x-2">
                            <IonIcon name="notifications"></IonIcon>
                            <p>Nyalakan Notifikasi</p>
                        </span>
                    </button>
                </div>

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
                        navigation={true}
                        modules={[Keyboard, Pagination, Navigation]}
                        className="mySwiper"
                    >
                        <SwiperSlide>
                            <div className="bg-green-500 text-white p-6 rounded-lg shadow">
                                <IonIcon className='text-xl' name="stats-chart"></IonIcon>
                                <h3 className="text-xl font-bold">Total Transaksi</h3>
                                <p className="text-3xl"><SlotCounter value={transactions.length} /></p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="bg-yellow-500 text-white p-6 rounded-lg shadow">
                                <IonIcon className='text-xl' name="warning"></IonIcon>
                                <h3 className="text-xl font-bold">Pending Requests</h3>
                                <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_job === 'pending').length} /></p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="bg-green-500 text-white p-6 rounded-lg shadow">
                                <IonIcon className='text-xl font-bold' name="checkmark"></IonIcon>
                                <h3 className="text-xl font-bold">Done Requests</h3>
                                <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_job === 'done').length} /></p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="bg-red-500 text-white p-6 rounded-lg shadow">
                                <IonIcon className='text-xl' name="ban"></IonIcon>
                                <h3 className="text-xl font-bold">Canceled Requests</h3>
                                <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_job === 'cancel').length} /></p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
                                <IonIcon className='text-xl' name="calendar"></IonIcon>
                                <h3 className="text-xl font-bold">Ongoing Requests</h3>
                                <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_job === 'ongoing').length} /></p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="bg-red-500 text-white p-6 rounded-lg shadow">
                                <IonIcon className='text-xl' name="cash"></IonIcon>
                                <h3 className="text-xl font-bold">Unpaid Requests</h3>
                                <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_payment === 'unpaid').length} /></p>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
                <div className="instruksi-ketiga md:grid hidden grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <Fade>
                        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
                            <IonIcon className='text-xl' name="stats-chart"></IonIcon>
                            <h3 className="text-xl font-bold">Total Transaksi</h3>
                            <p className="text-3xl"><SlotCounter value={transactions.length} /></p>
                        </div>
                        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow">
                            <IonIcon className='text-xl' name="warning"></IonIcon>
                            <h3 className="text-xl font-bold">Pending Requests</h3>
                            <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_job === 'pending').length} /></p>
                        </div>
                        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
                            <IonIcon className='text-xl font-bold' name="checkmark"></IonIcon>
                            <h3 className="text-xl font-bold">Done Requests</h3>
                            <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_job === 'done').length} /></p>
                        </div>
                        <div className="bg-red-500 text-white p-6 rounded-lg shadow">
                            <IonIcon className='text-xl' name="ban"></IonIcon>
                            <h3 className="text-xl font-bold">Canceled Requests</h3>
                            <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_job === 'cancel').length} /></p>
                        </div>
                        <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
                            <IonIcon className='text-xl' name="calendar"></IonIcon>
                            <h3 className="text-xl font-bold">Ongoing Requests</h3>
                            <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_job === 'ongoing').length} /></p>
                        </div>
                        <div className="bg-red-500 text-white p-6 rounded-lg shadow">
                            <IonIcon className='text-xl' name="cash"></IonIcon>
                            <h3 className="text-xl font-bold">Unpaid Requests</h3>
                            <p className="text-3xl"><SlotCounter value={transactions.filter(transaction => transaction.status_payment === 'unpaid').length} /></p>
                        </div>
                    </Fade>
                </div>
                <main className="instruksi-keempat">
                    <div className="bg-white shadow sm:rounded-lg p-6">
                        {customerData && (
                            <div className="mb-6">

                            </div>
                        )}

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
                                            <div className="bg-gray-100 p-2 mb-5 rounded-lg shadow-lg">
                                                <div ref={entryTransactionRef} className="flex justify-between items-center mb-4">
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
                                            {/* Date Range Inputs */}
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
                                            <li key={transaction.id} className="border-b py-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800"
                                                    onClick={() => handleViewDetails(transaction.id)}
                                                >
                                                    <span className="flex flex-row items-center space-x-5 justify-between">
                                                        <p>
                                                            View Transaction {transaction.nama_produk} status (
                                                            {transaction.status_payment})
                                                        </p>
                                                        <p>Tanggal Mulai: {transaction.start_date}</p>
                                                        <p>Tanggal Selesai: {transaction.start_date}</p>
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    {showEntryInstructionModal && (
                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                            {console.log("Modal rendered")}
                                            <Slide direction="down">
                                                <div className="bg-white p-6 h-auto md:w-[48%] mx-auto flex flex-col items-center justify-center rounded-md shadow-md z-50">
                                                    <img src={logo} className='w-36 h-auto' alt="sad log out" />
                                                    <h3 className="text-lg font-semibold mb-4">Gunakan Fitur ini dengan bijaksana</h3>
                                                    <Fade cascade>
                                                        <ul className="list-decimal">
                                                            <li>Kejujuran dalam Penginputan Kuantitas:</li>
                                                            <ul className="list-disc ml-3">
                                                                <li>Customer wajib memastikan jumlah pakaian yang dimasukkan sudah ditimbang atau dihitung dengan akurat.</li>
                                                                <li>Data yang dimasukkan harus mencerminkan jumlah pakaian yang sebenarnya, tanpa ada pengurangan atau penambahan yang tidak sesuai.</li>
                                                            </ul>
                                                            <li>Pencegahan Penyalahgunaan Fitur:</li>
                                                            <ul className="list-disc ml-3">
                                                                <li>Fitur input transaksi hanya boleh digunakan untuk transaksi yang valid dan nyata.</li>
                                                                <li>Penggunaan fitur untuk sekadar bersenang-senang, coba-coba, atau iseng tidak diperbolehkan. Hal ini bertujuan untuk menjaga integritas dan keakuratan data transaksi.</li>
                                                            </ul>
                                                            <li>Verifikasi Data oleh Petugas Laundry:</li>
                                                            <ul className="list-disc ml-3">
                                                                <li>Petugas laundry berhak untuk memverifikasi jumlah dan jenis pakaian yang terdaftar dalam transaksi.</li>
                                                                <li>Jika ditemukan ketidaksesuaian antara jumlah yang dilaporkan dengan hasil timbangan aktual, transaksi dapat dibatalkan atau dilakukan koreksi.</li>
                                                            </ul>
                                                            <li>Tanggung Jawab Customer:</li>
                                                            <ul className="list-disc ml-3">
                                                                <li>Customer bertanggung jawab penuh atas keakuratan data transaksi yang diinput. Kesalahan akibat penginputan yang disengaja atau tidak teliti dapat mengakibatkan sanksi atau pembatasan penggunaan fitur.</li>
                                                                <li>Customer harus melaporkan jika ada perubahan jumlah atau jenis pakaian sebelum transaksi diproses.</li>
                                                            </ul>
                                                        </ul>
                                                    </Fade>
                                                    <div className="flex gap-4">
                                                        <button
                                                            onClick={() => setShowEntryInstructionModal(false)}
                                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                                        >
                                                            Ya saya telah membaca.
                                                        </button>
                                                    </div>
                                                </div>
                                            </Slide>
                                        </div>
                                    )}

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
            </CustomerDashboardLayout>
        </>
    );
}