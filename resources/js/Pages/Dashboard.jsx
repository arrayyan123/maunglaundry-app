import AddCustomer from '@/Components/AdminDashboard/AddCustomer';
import Request_Table from '@/Components/AdminDashboard/Request_Table';
import EntryTransaction from '@/Components/AdminDashboard/EntryTransaction';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import TransactionDetail from '@/Components/AdminDashboard/TransactionDetail';
import axios from 'axios';
import AddCustButton from '@/Components/AdminDashboard/AddCustButton';
import { Bar } from 'react-chartjs-2';
import { Fade } from 'react-awesome-reveal';
import IonIcon from '@reacticons/ionicons';
import Joyride from 'react-joyride';
import SlotCounter from 'react-slot-counter';
import {
    Breadcrumbs,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
    Card,
    Typography,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CursorArrowRaysIcon } from "@heroicons/react/24/solid";

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

export default function Dashboard({ auth, customers: initialCustomers }) {
    const [customers, setCustomers] = useState(initialCustomers);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isAddingCustomer, setIsAddingCustomer] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [transactionsPerPage] = useState(5);
    const [reports, setReports] = useState([]);
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const customerTable = useRef(null);
    const [run, setRun] = useState(false);
    const entryTransactionRef = useRef(null);
    const detailTransactionRef = useRef(null);
    const addCustomerRef = useRef(null);
    const [openMenu, setOpenMenu] = React.useState(false);
    const [currentYear] = useState(new Date().getFullYear());
    const [currentMonth] = useState(new Date().getMonth() + 1);

    const handleCardClick = (status) => {
        const routeUrl = route('admin.report', { status_job: status });
        window.location.href = routeUrl;
    };

    const handleCardClickYear = (year) => {
        const routeUrl = route('admin.report', { year });
        window.location.href = routeUrl;
    };

    const handleCardCustomer = () => {
        const routeUrl = route('customer-transaction', { openListCustomer: true });
        window.location.href = routeUrl;
    };

    const scrollTo = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setSelectedTransactionId(null);
        setTransactionDetails(null);
        fetchTransactions(customer.id);

        const refsToScroll = [entryTransactionRef, detailTransactionRef];
        refsToScroll.forEach((ref, index) => {
            setTimeout(() => {
                if (ref.current) {
                    ref.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }, index * 100);
        });
    };

    useEffect(() => {
        if (selectedTransactionId && detailTransactionRef.current) {
            detailTransactionRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [selectedTransactionId, selectedCustomer]);

    const fetchTransactions = async (customerId) => {
        try {
            const response = await axios.get(`/api/admin/transactions/${customerId}`);
            setTransactions(response.data.transaction);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const handleViewDetails = async (transactionId) => {
        try {
            setLoading(true);
            const details = await fetchTransactionDetails(transactionId);
            if (details) {
                setTransactionDetails(details);
                setSelectedTransactionId(transactionId);
                setSelectedCustomer(details.customer);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching transaction details:", error);
            setLoading(false);
        }
    };

    const fetchTransactionDetails = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/admin/transactions/${id}`);
            console.log("Transaction details fetched:", response.data);
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            console.error("Error fetching transaction details:", error);
            return null;
        }
    };

    const handleAddCustomer = () => {
        setIsAddingCustomer(true)
        setTimeout(() => {
            if (addCustomerRef.current) {
                addCustomerRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 100);
    }

    const handleDeleteCustomer = async (customerId) => {
        try {
            await axios.delete(`/api/admin/customer/${customerId}`);
            const updatedCustomers = customers.filter(customer => customer.id !== customerId);
            setCustomers(updatedCustomers);
            alert("Customer deleted successfully!");
        } catch (error) {
            console.error("Error deleting customer:", error);
            alert("Failed to delete customer. Please try again.");
        }
    };

    const handleCloseTransactionDetail = () => {
        setSelectedTransactionId(null);
        setTransactionDetails(null);
    };
    const handleCancelEntryTransaction = () => {
        setSelectedCustomer(null);
        setTransactions([]);
    };

    const fetchReport = async () => {
        try {
            const response = await axios.get('/api/admin/reports', {
                params: { month, year, start_date: startDate, end_date: endDate, status_job: status },
            });
            setReports(response.data.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };
    useEffect(() => {
        fetchReport();
        const interval = setInterval(() => {
            fetchReport();
        }, 10000);

        return () => clearInterval(interval);
    }, [month, year, startDate, endDate, status]);

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
            {
                label: 'Transactions',
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                hoverBorderColor: 'rgba(75,192,192,1)',
                data: [65, 59, 80, 81, 56],
            },
        ],
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='start-instruksi'>
                    <h2 className="text-xl font-semibold leading-tight text-white">
                        Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard" />
            <Breadcrumbs>
                <Link href={route('dashboard')} className="opacity-60">
                    Dashboard
                </Link>
                <Menu>
                    <MenuHandler>
                        <Button
                            variant="text"
                            className="flex items-center gap-3 text-base font-normal capitalize tracking-normal"
                        >
                            Pilih{" "}
                            <ChevronDownIcon
                                strokeWidth={2.5}
                                className={`h-3.5 w-3.5 transition-transform ${openMenu ? "rotate-180" : ""
                                    }`}
                            />
                        </Button>
                    </MenuHandler>
                    <MenuList className='text-black'>
                        <MenuItem>
                            <Link href={route('admin.report')} className="opacity-60">
                                Laporan
                            </Link>
                        </MenuItem>
                        <MenuItem>
                            <Link href={route('customer-transaction')} className="opacity-60">
                                Customer & Transaction
                            </Link>
                        </MenuItem>
                        <MenuItem>
                            <Link href={route('diagram.page')} className="opacity-60">
                                Chart Penjualan
                            </Link>
                        </MenuItem>
                        <MenuItem>
                            <Link href={route('inbox.admin')} className="opacity-60">
                                Inbox
                            </Link>
                        </MenuItem>
                        <MenuItem>
                            <Link href={route('content.manage')} className="opacity-60">
                                Content Manage
                            </Link>
                        </MenuItem>
                        <MenuItem>
                            <Link href={route('service-prices.index')} className="opacity-60">
                                Service Manage
                            </Link>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Breadcrumbs>
            <div className="instruksi-pertama relative my-6 p-10 md:py-12 py-20 animated-background bg-gradient-to-r from-[#5482FF] to-indigo-300 rounded-xl text-black">
                <div className="absolute z-0 top-1/2 left-10 -translate-y-1/2">
                    <img
                        src={adminPic}
                        className="w-[60%] md:block hidden sm:w-[30%] lg:w-[30%] xl:w-[25%] h-auto"
                        alt="Admin"
                    />
                </div>
                <h1 className="font-bold lg:text-[35px] text-right sm:text-[25px] text-[20px] text-black">
                    HI! {auth.user.name}
                </h1>
                <p className='text-right'>Selamat Datang di dashboard admin Laundry</p>
            </div>
            <div className='my-3 instruksi-kedua relative z-0 md:hidden block'>
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
                    className="h-full"
                >
                    <SwiperSlide>
                        <div
                            onClick={() => handleCardCustomer()}
                            className="bg-white text-black h-full flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <div className='bg-blue-200 p-3 flex rounded-full'>
                                <IonIcon className='text-blue-500 text-[30px]' name='person' />
                            </div>
                            <div className='flex flex-col'>
                                <h3 className="text-sm font-bold">Total Pelanggan</h3>
                                <p className="text-3xl"><SlotCounter value={customers.length} /></p>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div
                            onClick={() => handleCardClickYear(currentYear)}
                            className="bg-white text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <div className='bg-green-200 p-3 flex rounded-full'>
                                <IonIcon className='text-green-500 text-[30px]' name="stats-chart" />
                            </div>
                            <div className='flex flex-col'>
                                <h3 className="text-sm font-bold">Total Transaksi ({currentYear})</h3>
                                <p className="text-3xl"><SlotCounter value={reports.length} /></p>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div
                            onClick={() => handleCardClick('pending')}
                            className="bg-white text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <div className='bg-yellow-200 p-3 flex rounded-full'>
                                <IonIcon className='text-yellow-500 text-[30px]' name="warning" />
                            </div>
                            <div className='flex flex-col'>
                                <h3 className="text-sm font-bold">Pending Requests</h3>
                                <p className="text-3xl"><SlotCounter value={reports.filter(report => report.status_job === 'pending').length} /></p>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div
                            onClick={() => handleCardClick('done')}
                            className="bg-white text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <div className='bg-green-200 p-3 flex rounded-full'>
                                <IonIcon className='text-green-500 text-[30px]' name="checkmark"></IonIcon>
                            </div>
                            <div className='flex flex-col'>
                                <h3 className="text-sm font-bold">Done Requests</h3>
                                <p className="text-3xl"><SlotCounter value={reports.filter(report => report.status_job === 'done').length} /></p>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div
                            onClick={() => handleCardClick('cancel')}
                            className="bg-white text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <div className='bg-red-200 p-3 flex rounded-full'>
                                <IonIcon className='text-red-500 text-[30px]' name="ban"></IonIcon>
                            </div>
                            <div className='flex flex-col'>
                                <h3 className="text-sm font-bold">Canceled Requests</h3>
                                <p className="text-3xl"><SlotCounter value={reports.filter(report => report.status_job === 'cancel').length} /></p>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div
                            onClick={() => handleCardClick('ongoing')}
                            className="bg-white text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <div className='bg-blue-200 p-3 flex rounded-full'>
                                <IonIcon className='text-blue-500 text-[30px]' name="calendar"></IonIcon>
                            </div>
                            <div className='flex flex-col'>
                                <h3 className="text-sm font-bold">Ongoing Requests</h3>
                                <p className="text-3xl"><SlotCounter value={reports.filter(report => report.status_job === 'ongoing').length} /></p>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
            <div className="instruksi-kedua md:grid hidden grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <Fade>
                    {/*saya mau ketika klik total pelanggan, langsung redirect ke customer-transaction dan langsung membuat listCustomer nya*/}
                    <div
                        onClick={() => handleCardCustomer()}
                        className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                        <div className='bg-blue-200 p-3 flex rounded-full'>
                            <IonIcon className='text-blue-500 text-[30px]' name='person' />
                        </div>
                        <div className='flex flex-col'>
                            <h3 className="text-xl font-bold">Total Pelanggan</h3>
                            <p className="text-3xl"><SlotCounter value={customers.length} /></p>
                        </div>
                    </div>
                    <div
                        onClick={() => handleCardClickYear(currentYear)}
                        className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                        <div className='bg-green-200 p-3 flex rounded-full'>
                            <IonIcon className='text-green-500 text-[30px]' name="stats-chart" />
                        </div>
                        <div className='flex flex-col'>
                            <h3 className="text-xl font-bold">Total Transaksi ({currentYear})</h3>
                            <p className="text-3xl"><SlotCounter value={reports.length} /></p>
                        </div>
                    </div>
                    <div
                        onClick={() => handleCardClick('pending')}
                        className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                        <div className='bg-yellow-200 p-3 flex rounded-full'>
                            <IonIcon className='text-yellow-500 text-[30px]' name="warning" />
                        </div>
                        <div className='flex flex-col'>
                            <h3 className="text-xl font-bold">Pending Requests</h3>
                            <p className="text-3xl"><SlotCounter value={reports.filter(report => report.status_job === 'pending').length} /></p>
                        </div>
                    </div>
                    <div
                        onClick={() => handleCardClick('done')}
                        className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                        <div className='bg-green-200 p-3 flex rounded-full'>
                            <IonIcon className='text-green-500 text-[30px]' name="checkmark"></IonIcon>
                        </div>
                        <div className='flex flex-col'>
                            <h3 className="text-xl font-bold">Done Requests</h3>
                            <p className="text-3xl"><SlotCounter value={reports.filter(report => report.status_job === 'done').length} /></p>
                        </div>
                    </div>
                    <div
                        onClick={() => handleCardClick('cancel')}
                        className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                        <div className='bg-red-200 p-3 flex rounded-full'>
                            <IonIcon className='text-red-500 text-[30px]' name="ban"></IonIcon>
                        </div>
                        <div className='flex flex-col'>
                            <h3 className="text-xl font-bold">Canceled Requests</h3>
                            <p className="text-3xl"><SlotCounter value={reports.filter(report => report.status_job === 'cancel').length} /></p>
                        </div>
                    </div>
                    <div
                        onClick={() => handleCardClick('ongoing')}
                        className="bg-white h-full text-black flex items-center flex-row space-x-3 p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                        <div className='bg-blue-200 p-3 flex rounded-full'>
                            <IonIcon className='text-blue-500 text-[30px]' name="calendar"></IonIcon>
                        </div>
                        <div className='flex flex-col'>
                            <h3 className="text-xl font-bold">Ongoing Requests</h3>
                            <p className="text-3xl"><SlotCounter value={reports.filter(report => report.status_job === 'ongoing').length} /></p>
                        </div>
                    </div>
                </Fade>
            </div>
            {/* <div className="instruksi-ketiga bg-gray-100 p-6 rounded-lg shadow my-6">
                <h3 className="text-lg font-bold">Tugas Admin</h3>
                <ul className="list-disc pl-6">
                    <li>Menambahkan customer yang belum terdaftar</li>
                    <li>membuat transaksi baru customer</li>
                    <li>Update status transaksi</li>
                    <li>Membuat laporan bulanan penjualan</li>
                </ul>
            </div>

            <AddCustButton className="instruksi-keempat instruksi-keenam mb-4" onClick={handleAddCustomer} />
            {isAddingCustomer && (
                <div ref={addCustomerRef} className="mx-auto max-w-7xl p-6 my-10 bg-white rounded-lg instruksi-ketujuh">
                    <h3 className="text-lg font-semibold text-center">Add Customer</h3>
                    <AddCustomer />
                    <button
                        className="mt-2 bg-red-500 text-white p-2 rounded"
                        onClick={() => setIsAddingCustomer(false)}
                    >
                        Cancel
                    </button>
                </div>
            )}
            {selectedTransactionId ? (
                <div ref={detailTransactionRef}>
                    <TransactionDetail
                        customerId={selectedCustomer?.id}
                        transactionId={selectedTransactionId}
                        onClose={handleCloseTransactionDetail}
                    />
                </div>
            ) : selectedCustomer ? (
                <div ref={entryTransactionRef} className="mx-auto max-w-7xl p-3 my-10 bg-white rounded-lg">
                    <Fade>
                        <EntryTransaction
                            customerId={selectedCustomer.id}
                            onSave={() => alert('Transaction saved!')}
                            onNavigateToPayment={() => navigate('/admin/payment-detail')}
                        />
                        <button
                            className="mt-2 bg-red-500 text-white p-2 rounded"
                            onClick={handleCancelEntryTransaction}
                        >
                            Cancel
                        </button>
                    </Fade>
                </div>
            ) : null}
            {selectedCustomer && !selectedTransactionId && transactions.length > 0 && (
                <Fade>
                    <div className="mx-auto max-w-7xl p-6 mb-10 bg-white rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Transactions</h3>
                        <ul>
                            {currentTransactions.map(transaction => (
                                <li key={transaction.id} className="border-b py-2">
                                    <button
                                        className="text-blue-600 hover:text-blue-800"
                                    // onClick={() => handleViewDetails(transaction.id)}
                                    >
                                        Lihat Transaksi {transaction.nama_produk} status ({transaction.status_payment})
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-300 text-gray-600 rounded-l-md disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={indexOfLastTransaction >= transactions.length}
                                className="px-4 py-2 bg-gray-300 text-gray-600 rounded-r-md disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </Fade>
            )}
            <Request_Table
                className="instruksi-kelima"
                customers={customers}
                onSelectCustomer={handleSelectCustomer}
                onViewDetails={handleViewDetails}
                onDeleteCustomer={handleDeleteCustomer}
            /> */}
        </AuthenticatedLayout>
    );
}
