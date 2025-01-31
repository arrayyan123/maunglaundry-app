import CustomerDashboardLayout from '@/Layouts/CustomerDashboardLayout'
import React, { useState, useEffect, useRef } from "react";
import SlotCounter from 'react-slot-counter';
import Chart from 'chart.js/auto';
import IonIcon from '@reacticons/ionicons';
import { Head } from '@inertiajs/react';
import { Fade } from 'react-awesome-reveal';

const pngImages = import.meta.glob("/public/assets/Images/*.png", { eager: true });
const jpgImages = import.meta.glob("/public/assets/Images/*.jpg", { eager: true });
const webpImages = import.meta.glob("/public/assets/Images/*.webp", { eager: true });
const laundryImages = import.meta.glob("/public/assets/Images/laundry_pics/*.jpg", { eager: true });
const images = { ...pngImages, ...webpImages, ...laundryImages, ...jpgImages };

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const Maintenance = getImageByName('maintenance');

function CustomerGraph() {
    const [customerData, setCustomerData] = useState(null);
    const [reports, setReports] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [status, setStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [statuspayment, setStatusPayment] = useState('');
    const itemsPerPage = 15;

    const lineChartRef = useRef(null);
    const barChartRef = useRef(null);

    const lineChartInstance = useRef(null);
    const barChartInstance = useRef(null);

    const [showMobileModal, setShowMobileModal] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setShowMobileModal(true);
            }
        };

        handleResize(); 
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize); 
        };
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem("customer-token");
        if (!storedToken) {
            window.location.href = "/customer/login";
        } else {
            const storedCustomer = localStorage.getItem("customer-data");
            if (storedCustomer) {
                const customer = JSON.parse(storedCustomer);
                setCustomerData(customer);
                fetchReport(customer.id);
                fetchTotalPrice(customer.id);
            }
        }
    }, []);
    const fetchReport = async (customerId) => {
        try {
            const response = await axios.get(`/api/admin/reports/customer/${customerId}`, {
                params: { month, year, start_date: startDate, end_date: endDate, status_job: status, status_payment: statuspayment },
            });
            setReports(response.data.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const updateCharts = () => {
        const laundryTypeCounts = {
            "Dry Cleaning": 0,
            "Wet Laundry": 0,
            "Tanpa Kategori": 0,
        };
        const paymentStatusCounts = { paid: 0, unpaid: 0, partial: 0 };

        reports.forEach((report) => {
            const { laundry_type, status_payment } = report;

            // Count Laundry Types
            if (laundry_type === "Dry Cleaning") {
                laundryTypeCounts["Dry Cleaning"]++;
            } else if (laundry_type === "Wet Laundry") {
                laundryTypeCounts["Wet Laundry"]++;
            } else {
                laundryTypeCounts["Tanpa Kategori"]++;
            }

            if (status_payment === "paid") paymentStatusCounts.paid++;
            else if (status_payment === "unpaid") paymentStatusCounts.unpaid++;
            else if (status_payment === "partial") paymentStatusCounts.partial++;
        });

        if (lineChartInstance.current) lineChartInstance.current.destroy();
        if (barChartInstance.current) barChartInstance.current.destroy();

        const lineCtx = lineChartRef.current.getContext("2d");
        lineChartInstance.current = new Chart(lineCtx, {
            type: "line",
            data: {
                labels: ["Dry Cleaning", "Wet Laundry", "Tanpa Kategori"],
                datasets: [
                    {
                        label: "Laundry Categories",
                        data: Object.values(laundryTypeCounts),
                        borderColor: "#4CAF50",
                        backgroundColor: "rgba(76, 175, 80, 0.2)",
                        tension: 0.4,
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: "Jumlah Laundry" },
                    },
                },
            },
        });

        const barCtx = barChartRef.current.getContext("2d");
        barChartInstance.current = new Chart(barCtx, {
            type: "bar",
            data: {
                labels: ["Paid", "Unpaid", "Partial"],
                datasets: [
                    {
                        label: "Payment Status",
                        data: [
                            paymentStatusCounts.paid,
                            paymentStatusCounts.unpaid,
                            paymentStatusCounts.partial,
                        ],
                        backgroundColor: [
                            "#42A5F5", // Color for Paid
                            "#F44336", // Color for Unpaid
                            "#FFC107", // Color for Partial
                        ],
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: "Jumlah Payment Status" },
                    },
                },
            },
        });
    };

    const fetchTotalPrice = async (customerId) => {
        try {
            const response = await axios.get(`/api/admin/total-price/customer/${customerId}`, {
                params: { month, year, start_date: startDate, end_date: endDate, status_job: status, status_payment: statuspayment },
            });
            setTotalPrice(response.data.total_price);
        } catch (error) {
            console.error('Error fetching total price:', error);
        }
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    useEffect(() => {
        if (customerData) {
            fetchReport(customerData.id);
            fetchTotalPrice(customerData.id);
        }
    }, [customerData, month, year, startDate, endDate, status, statuspayment]);
    useEffect(() => {
        if (reports.length > 0) {
            updateCharts();
        }
    }, [reports]);
    return (
        <div>
            <CustomerDashboardLayout
                header={
                    <div>
                        <h2 className="text-xl start-instruksi font-semibold leading-tight text-white">
                            Perkembangan Customer
                        </h2>
                    </div>
                }
            >
                <Head title='Perkembangan Customer' />
                <div className='p-4 text-black'>
                    {/*FITUR FILTER*/}
                    <div className="flex flex-col lg:flex-row lg:space-x-6 mb-6 items-start lg:items-center">
                        {/* Select Month */}
                        <div className="flex flex-col w-full lg:w-auto">
                            <label className="text-sm font-medium mb-1">Select Month</label>
                            <select
                                className="border border-gray-300 rounded-md p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                <option value="">Select Month</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Select Year */}
                        <div className="flex flex-col w-full lg:w-auto">
                            <label className="text-sm font-medium mb-1">Select Year</label>
                            <select
                                className="border border-gray-300 rounded-md p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            >
                                <option value="">Select Year</option>
                                {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => (
                                    <option key={i} value={2000 + i}>
                                        {2000 + i}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Start Date */}
                        <div className="flex flex-col w-full lg:w-auto">
                            <label className="text-sm font-medium mb-1">Start Date</label>
                            <input
                                type="date"
                                className="border border-gray-300 rounded-md p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        {/* End Date */}
                        <div className="flex flex-col w-full lg:w-auto">
                            <label className="text-sm font-medium mb-1">End Date</label>
                            <input
                                type="date"
                                className="border border-gray-300 rounded-md p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        {/* Select Status */}
                        <div className="flex flex-col w-full lg:w-auto">
                            <label className="text-sm font-medium mb-1">Select Status</label>
                            <select
                                className="border border-gray-300 rounded-md p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="pending">Pending</option>
                                <option value="done">Done</option>
                                <option value="cancel">Cancel</option>
                            </select>
                        </div>
                        <div className="flex flex-col w-full lg:w-auto">
                            <label className="text-sm font-medium mb-1">Select Status Payment</label>
                            <select
                                className="border border-gray-300 rounded-md p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={statuspayment}
                                onChange={(e) => setStatusPayment(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="paid">Paid</option>
                                <option value="partial">Partial</option>
                                <option value="unpaid">Unpaid</option>
                            </select>
                        </div>
                        <div className="mt-3 lg:mt-6 lg:w-auto w-full">
                            <button
                                className="bg-blue-500 text-white py-3 px-6 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                                onClick={() => {
                                    fetchReport(customerData?.id);
                                    fetchTotalPrice(customerData?.id);
                                }}
                            >
                                <span className='flex items-center space-x-3'>
                                    <IonIcon name='filter'></IonIcon>
                                </span>
                            </button>
                        </div>
                    </div>
                    {/*TEMPAT CHART DIBAWAH*/}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-medium mb-4">
                                Tipe Laundry yang Paling Dipilih
                            </h3>
                            <canvas ref={lineChartRef} width={600} height={100}></canvas>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-medium mb-4">Status Pembayaran</h3>
                            <canvas ref={barChartRef} width={600} height={100}></canvas>
                        </div>
                    </div>
                    {showMobileModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <Fade>
                                <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                                    <h2 className="text-xl font-bold text-red-500 mb-4">Peringatan!</h2>
                                    <p className="text-gray-700 mb-4">
                                        Halaman ini lebih baik diakses menggunakan perangkat desktop untuk pengalaman yang optimal.
                                    </p>
                                    <button
                                        onClick={() => setShowMobileModal(false)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Mengerti
                                    </button>
                                </div>
                            </Fade>
                        </div>
                    )}
                </div>
            </CustomerDashboardLayout>
        </div>
    )
}

export default CustomerGraph