import CustomerDashboardLayout from '@/Layouts/CustomerDashboardLayout'
import React, { useState, useEffect, useRef } from "react";
import SlotCounter from 'react-slot-counter';
import Chart from 'chart.js/auto';
import IonIcon from '@reacticons/ionicons';
import { Head } from '@inertiajs/react';

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

    const barChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const barChartInstance = useRef(null);
    const lineChartInstance = useRef(null);

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
       
        const laundryTypeCounts = { 'Dry Cleaning': 0, 'Wet Laundry': 0, 'Tanpa Kategori': 0 };
        reports.forEach((report) => {
            if (report.laundry_type === 'Dry Cleaning') {
                laundryTypeCounts['Dry Cleaning']++;
            } else if (report.laundry_type === 'Wet Laundry') {
                laundryTypeCounts['Wet Laundry']++;
            } else {
                laundryTypeCounts['Tanpa Kategori']++;
            }
        });

        const paymentStatusCounts = { paid: 0, unpaid: 0 };
        reports.forEach((report) => {
            if (report.status_payment === 'paid') {
                paymentStatusCounts.paid++;
            } else if (report.status_payment === 'unpaid') {
                paymentStatusCounts.unpaid++;
            }
        });

        const barChartData = {
            labels: ['Dry Cleaning', 'Wet Laundry', 'Tanpa Kategori'],
            datasets: [
                {
                    label: 'Jumlah Laundry per Kategori',
                    data: Object.values(laundryTypeCounts),
                    backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
                    borderRadius: 10,
                },
            ],
        };

        if (barChartInstance.current) {
            barChartInstance.current.destroy();
        }

        barChartInstance.current = new Chart(barChartRef.current, {
            type: 'bar',
            data: barChartData,
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
                },
            },
        });

        // Update Line Chart
        const lineChartData = {
            labels: ['Paid', 'Unpaid'],
            datasets: [
                {
                    label: 'Payment Status',
                    data: [paymentStatusCounts.paid, paymentStatusCounts.unpaid],
                    borderColor: '#42A5F5',
                    backgroundColor: 'rgba(66, 165, 245, 0.2)',
                    fill: true,
                    tension: 0.4,
                },
            ],
        };

        if (lineChartInstance.current) {
            lineChartInstance.current.destroy();
        }

        lineChartInstance.current = new Chart(lineChartRef.current, {
            type: 'line',
            data: lineChartData,
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
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
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-medium mb-4">Laundry Type</h3>
                            <canvas ref={barChartRef}></canvas>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-medium mb-4">Payment Status</h3>
                            <canvas ref={lineChartRef}></canvas>
                        </div>
                    </div>
                </div>
            </CustomerDashboardLayout>
        </div>
    )
}

export default CustomerGraph