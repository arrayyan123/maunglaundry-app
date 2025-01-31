import CustomerDashboardLayout from '@/Layouts/CustomerDashboardLayout'
import { Head } from '@inertiajs/react';
import IonIcon from '@reacticons/ionicons';
import React, { useState, useEffect } from "react";
import SlotCounter from 'react-slot-counter';

function CustomerReport({ query }) {
    const [customerData, setCustomerData] = useState(null);
    const [reports, setReports] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(query?.year || '');
    const [totalPrice, setTotalPrice] = useState(0);
    const [status, setStatus] = useState(query?.status_job || '');
    const [currentPage, setCurrentPage] = useState(1);
    const [statuspayment, setStatusPayment] = useState(query?.status_payment || '');
    const itemsPerPage = 15;

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
            console.log('API Response:', response.data);
            setReports(response.data.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
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

    const totalPages = Math.ceil(reports.length / itemsPerPage);
    const currentData = reports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        if (customerData) {
            fetchReport(customerData.id);
            fetchTotalPrice(customerData.id);
        }
    }, [customerData, month, year, startDate, endDate, status, statuspayment]);


    return (
        <div>
            <Head title='Laporan Transaksi' />
            <CustomerDashboardLayout
                header={
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-white">
                            Laporan Transaksi
                        </h2>
                    </div>
                }
            >
                <div className="p-2 text-black">
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
                                    fetchReport();
                                    fetchTotalPrice();
                                }}
                            >
                                <span className='flex items-center space-x-3'>
                                    <IonIcon name='filter'></IonIcon>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="my-4">
                        <h2 className="text-lg font-semibold">Total Transaksi: Rp.<SlotCounter value={formatNumber(totalPrice)} /></h2>
                    </div>
                    {/* Table Section */}
                    <div className="overflow-x-auto rounded-xl">
                        <table className="min-w-full bg-gray-300 text-white shadow-md">
                            <thead>
                                <tr className='bg-gray-700 text-left'>
                                    <th className="py-3 px-4">Nama Pelanggan</th>
                                    <th className="py-3 px-4">Produk</th>
                                    <th className="py-3 px-4">Tipe Laundry</th>
                                    <th className="py-3 px-4">Status Pengerjaan</th>
                                    <th className="py-3 px-4">Status Pembayaran</th>
                                    <th className="py-3 px-4">Tanggal Mulai</th>
                                    <th className="py-3 px-4">Tanggal Estimasi Selesai</th>
                                    <th className="py-3 px-4">Total Harga</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((report) => (
                                    <tr key={report.transaction_id} className='border-t border-gray-700 hover:bg-gray-500 text-black hover:text-white'>
                                        <td className="py-3 px-4">{report.customer_name}</td>
                                        <td className="py-3 px-4">{report.nama_produk}</td>
                                        <td className="py-3 px-4">{report.laundry_type}</td>
                                        <td
                                            className="py-3 px-4 text-center text-white">
                                            <div
                                                className={`py-3 px-4 rounded-lg text-center text-white ${report.status_job === 'ongoing'
                                                    ? 'bg-blue-200'
                                                    : report.status_job === 'pending'
                                                        ? 'bg-yellow-200'
                                                        : report.status_job === 'done'
                                                            ? 'bg-green-200'
                                                            : report.status_job === 'cancel'
                                                                ? 'bg-red-200'
                                                                : 'bg-transparent'
                                                    }`}
                                            >
                                                <p
                                                    className={`font-bold ${report.status_job === 'ongoing'
                                                        ? 'text-blue-500'
                                                        : report.status_job === 'pending'
                                                            ? 'text-yellow-500'
                                                            : report.status_job === 'done'
                                                                ? 'text-green-500'
                                                                : report.status_job === 'cancel'
                                                                    ? 'text-red-500'
                                                                    : 'bg-transparent'
                                                        }`}
                                                >
                                                    {report.status_job}
                                                </p>
                                            </div>
                                        </td>
                                        <td
                                            className="py-3 px-4 text-center text-white">
                                            <div
                                                className={`py-3 px-4 rounded-lg text-center text-white ${report.status_payment === 'paid'
                                                    ? 'bg-green-200'
                                                    : report.status_payment === 'unpaid'
                                                        ? 'bg-red-200'
                                                        : report.status_payment === 'partial'
                                                            ? 'bg-yellow-200'
                                                            : 'bg-transparent'
                                                    }`}
                                            >
                                                <p
                                                    className={`font-bold ${report.status_payment === 'paid'
                                                        ? 'text-green-500'
                                                        : report.status_payment === 'unpaid'
                                                            ? 'text-red-500'
                                                            : report.status_payment === 'partial'
                                                                ? 'text-yellow-500'
                                                                : 'bg-transparent'
                                                        }`}
                                                >
                                                    {report.status_payment}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {new Intl.DateTimeFormat('id-ID', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false
                                            }).format(new Date(report.start_date))}
                                        </td>
                                        <td className="py-3 px-4">
                                            {new Intl.DateTimeFormat('id-ID', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false
                                            }).format(new Date(report.end_date))}
                                        </td>
                                        <td className="py-3 px-4">Rp.<SlotCounter value={formatNumber(report.total_price)} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center items-center mt-4 space-x-2">
                        <button
                            className="bg-gray-300 p-2 rounded"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="bg-gray-300 p-2 rounded"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </CustomerDashboardLayout>
        </div>
    )
}

export default CustomerReport