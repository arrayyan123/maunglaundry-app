import AddCustomer from '@/Components/AdminDashboard/AddCustomer';
import Request_Table from '@/Components/AdminDashboard/Request_Table';
import EntryTransaction from '@/Components/AdminDashboard/EntryTransaction';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import TransactionDetail from '@/Components/AdminDashboard/TransactionDetail';
import axios from 'axios';
import AddCustButton from '@/Components/AdminDashboard/AddCustButton';
import { Bar } from 'react-chartjs-2';
import { Fade } from 'react-awesome-reveal';
import IonIcon from '@reacticons/ionicons';
import Joyride from 'react-joyride';
import SlotCounter from 'react-slot-counter';

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

    const handleClickStart = () => {
        setRun(true);
    };
    const steps = [
        {
            target: '.start-instruksi',
            content: 'Selamat Datang di website admin maung laundry',
        },
        {
            target: '.instruksi-pertama',
            content: 'Disini anda bisa melihat informasi mengenai akun anda',
        },
        {
            target: '.instruksi-kedua',
            content: 'Disini anda bisa melihat informasi mengenai penjualan toko',
        },
        {
            target: '.instruksi-ketiga',
            content: 'Disini diberitahu apa saja tugas dari admin',
        },
        {
            target: '.instruksi-keempat',
            content: 'Tombol ini untuk menambahkan Customer baru yang belum terdaftar. Pastikan dengan benar untuk informasi customer',
        },
        {
            target: '.instruksi-kelima',
            content: 'Dan disini untuk daftar customer yang telah didaftar/terdaftar oleh admin atau customer',
        },
        {
            target: '.instruksi-keenam',
            content: 'Coba anda klik Add customer. Selamat Mencoba :)',
        },
    ];

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

    const handleViewDetails = (transactionId) => {
        console.log("Setting transaction ID:", transactionId);
        setSelectedTransactionId(transactionId);
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
    const handleViewDetailsOn = async (transactionId) => {
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
            handleClickStart={handleClickStart} // Pass the function here
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
                <p className='text-right'>Selamat Datang di dashboard admin Maung Laundry</p>
            </div>
            <div className='my-3 instruksi-kedua md:hidden block'>
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
                        <Link href={route('admin.report')}>
                            <div className="bg-blue-500 text-white p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                                <IonIcon className='text-xl' name="person"></IonIcon>
                                <h3 className="text-xl font-bold">Total Customers</h3>
                                <p className="text-3xl"><SlotCounter value={customers.length} /></p>
                            </div>
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Link href={route('admin.report')}>
                            <div className="bg-green-500 text-white p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                                <IonIcon className='text-xl' name="stats-chart"></IonIcon>
                                <h3 className="text-xl font-bold">Total Transactions</h3>
                                <p className="text-3xl"><SlotCounter value={reports.length} /></p>
                            </div>
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Link href={route('admin.report')}>
                            <div className="bg-yellow-500 text-white p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                                <IonIcon className='text-xl' name="warning"></IonIcon>
                                <h3 className="text-xl font-bold">Pending Requests</h3>
                                <p className="text-3xl"><SlotCounter value={reports.filter(report => report.status_job === 'pending').length} /></p>
                            </div>
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Link href={route('admin.report')}>
                            <div className="bg-green-500 text-white p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                                <IonIcon className='text-xl font-bold' name="checkmark"></IonIcon>
                                <h3 className="text-xl font-bold">Done Requests</h3>
                                <p className="text-3xl"><SlotCounter value={reports.filter(report => report.status_job === 'done').length} /></p>
                            </div>
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Link href={route('admin.report')}>
                            <div className="bg-red-500 text-white p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                                <IonIcon className='text-xl' name="ban"></IonIcon>
                                <h3 className="text-xl font-bold">Cancel Requests</h3>
                                <p className="text-3xl"><SlotCounter value={reports.filter(report => report.status_job === 'cancel').length} /></p>
                            </div>
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Link href={route('admin.report')}>
                            <div className="bg-blue-500 text-white p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                                <IonIcon className='text-xl' name="calendar"></IonIcon>
                                <h3 className="text-xl font-bold">Ongoing Requests</h3>
                                <p className="text-3xl"><SlotCounter value={reports.filter(report => report.status_job === 'ongoing').length} /></p>
                            </div>
                        </Link>
                    </SwiperSlide>
                </Swiper>
            </div>
            <div className="instruksi-kedua md:grid hidden grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <Fade>
                    <Link href={route('admin.report')}>
                        <div className="bg-blue-500 text-white p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <IonIcon className='text-xl' name="person"></IonIcon>
                            <h3 className="text-xl font-bold">Total Customers</h3>
                            <p className="text-3xl"><SlotCounter value={customers.length} /></p>
                        </div>
                    </Link>
                    <Link href={route('admin.report')}>
                        <div className="bg-green-500 text-white p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <IonIcon className='text-xl' name="stats-chart"></IonIcon>
                            <h3 className="text-xl font-bold">Total Transactions</h3>
                            <p className="text-3xl"><SlotCounter value={reports.length} /></p>
                        </div>
                    </Link>
                    <Link href={route('admin.report')}>
                        <div className="bg-yellow-500 text-white p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <IonIcon className='text-xl' name="warning"></IonIcon>
                            <h3 className="text-xl font-bold">Pending Requests</h3>
                            <p className="text-3xl"><SlotCounter value={reports.filter(report => report.status_job === 'pending').length} /></p>
                        </div>
                    </Link>
                    <Link href={route('admin.report')}>
                        <div className="bg-green-500 text-white p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <IonIcon className='text-xl font-bold' name="checkmark"></IonIcon>
                            <h3 className="text-xl font-bold">Done Requests</h3>
                            <p className="text-3xl"><SlotCounter value={reports.filter(report => report.status_job === 'done').length} /></p>
                        </div>
                    </Link>
                    <Link href={route('admin.report')}>
                        <div className="bg-red-500 text-white p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <IonIcon className='text-xl' name="ban"></IonIcon>
                            <h3 className="text-xl font-bold">Cancel Requests</h3>
                            <p className="text-3xl"><SlotCounter value={reports.filter(report => report.status_job === 'cancel').length} /></p>
                        </div>
                    </Link>
                    <Link href={route('admin.report')}>
                        <div className="bg-blue-500 text-white p-6 scale-100 hover:scale-110 transition-all ease-in-out duration-300 rounded-lg shadow-xl">
                            <IonIcon className='text-xl' name="calendar"></IonIcon>
                            <h3 className="text-xl font-bold">Ongoing Requests</h3>
                            <p className="text-3xl"><SlotCounter value={reports.filter(report => report.status_job === 'ongoing').length} /></p>
                        </div>
                    </Link>
                </Fade>
            </div>
            <div className="instruksi-ketiga bg-gray-100 p-6 rounded-lg shadow my-6">
                <h3 className="text-lg font-bold">Tugas Admin</h3>
                <ul className="list-disc pl-6">
                    <li>Menambahkan customer yang belum terdaftar</li>
                    <li>membuat transaksi baru customer</li>
                    <li>Update status transaksi</li>
                    <li>Membuat laporan bulanan penjualan</li>
                </ul>
            </div>

            <AddCustButton className="instruksi-keempat instruksi-keenam" onClick={handleAddCustomer} />
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
            {selectedCustomer && !selectedTransactionId && (
                <div ref={entryTransactionRef} className='mx-auto max-w-7xl p-3 my-10 bg-white rounded-lg'>
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
            )}

            {selectedTransactionId && selectedCustomer && (
                <div ref={detailTransactionRef}>
                    <TransactionDetail
                        customerId={selectedCustomer.id}
                        transactionId={selectedTransactionId}
                        onClose={handleCloseTransactionDetail}
                    />
                </div>
            )}
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

                        {/* Pagination */}
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
            />
        </AuthenticatedLayout>
    );
}
