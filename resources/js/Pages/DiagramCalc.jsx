import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import IonIcon from '@reacticons/ionicons';
import SlotCounter from 'react-slot-counter';
import { Breadcrumbs } from "@material-tailwind/react";
import { Fade } from 'react-awesome-reveal';

export default function DiagramCalc({ auth, customers }) {
    const [totalPrice, setTotalPrice] = useState(0);
    const [reports, setReports] = useState([]);
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [customer, setCustomer] = useState([]);
    const [barChart, setBarChart] = useState(null);
    const [doughnutChart, setDoughnutChart] = useState(null);
    const [prevReportsLength, setPrevReportsLength] = useState(0);
    const [prevAvgTransaction, setPrevAvgTransaction] = useState(0);
    const [prevPaidTransactions, setPrevPaidTransactions] = useState(0);
    const [prevUnpaidTransactions, setPrevUnpaidTransactions] = useState(0);
    const [prevPartialTransactions, setPrevPartialTransactions] = useState(0);
    const chartRef01 = useRef(null);
    const chartRef02 = useRef(null);

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

    const fetchTotalPrice = async () => {
        try {
            const response = await axios.get('/api/admin/total-price');
            setTotalPrice(response.data.total_price);
        } catch (error) {
            console.error('Error fetching total price:', error);
        }
    };

    const fetchReport = async () => {
        try {
            const response = await axios.get('/api/admin/reports', {
                params: {
                    month: month || null,
                    year: year || null,
                    start_date: startDate || null,
                    end_date: endDate || null,
                    status_job: status || null,
                },
            });
            setReports(response.data.data);
            updateBarChart(response.data.data);
            updateDoughnutChart(response.data.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const fetchCustomer = async () => {
        try {
            const response = await axios.get('/api/admin/customers');
            setCustomer(response.data);
        } catch (error) {
            console.error('Error fetching customer:', error);
        }
    };

    const updateBarChart = (data) => {
        if (!data || data.length === 0) {
            console.warn("Data is empty or undefined.");
            return;
        }

        const sortedData = data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

        const recentData = sortedData

        const labels = [...new Set(recentData.map((item) => item.start_date))];

        const paidData = labels.map((label) => {
            return recentData.filter((item) => item.status_payment === 'paid' && item.start_date === label)
                .reduce((sum, item) => sum + item.total_price, 0);
        });

        const unpaidData = labels.map((label) => {
            return recentData.filter((item) => item.status_payment === 'unpaid' && item.start_date === label)
                .reduce((sum, item) => sum + item.total_price, 0);
        });

        const partialData = labels.map((label) => {
            return recentData.filter((item) => item.status_payment === 'partial' && item.start_date === label)
                .reduce((sum, item) => sum + item.total_price, 0);
        });

        if (barChart) {
            barChart.data.labels = labels;
            barChart.data.datasets[0].data = paidData;
            barChart.data.datasets[1].data = unpaidData;
            barChart.data.datasets[2].data = partialData;
            barChart.update();
        } else {
            if (!chartRef01.current) {
                console.warn("Chart reference is not available yet.");
                return;
            }

            const ctx = chartRef01.current.getContext('2d');
            const newChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'Paid (Rp)',
                            data: paidData,
                            borderColor: '#0dbb18',
                            backgroundColor: '#00ff0f',
                            fill: false,
                            tension: 0.1,
                        },
                        {
                            label: 'Unpaid (Rp)',
                            data: unpaidData,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            fill: false,
                            tension: 0.1,
                        },
                        {
                            label: 'Partial (Rp)', // Add a label for partial data
                            data: partialData,
                            borderColor: 'rgba(255, 206, 86, 1)', // Choose a color for partial
                            backgroundColor: 'rgba(255, 206, 86, 0.2)', // Background color for partial
                            fill: false,
                            tension: 0.1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
            setBarChart(newChart);
        }
    };

    const updateDoughnutChart = (data) => {
        const labels = ['Done', 'Pending', 'Cancel', 'Ongoing'];
        const statusCounts = {
            done: data.filter((item) => item.status_job === 'done').length,
            pending: data.filter((item) => item.status_job === 'pending').length,
            cancel: data.filter((item) => item.status_job === 'cancel').length,
            ongoing: data.filter((item) => item.status_job === 'ongoing').length,
        };

        const chartData = [statusCounts.done, statusCounts.pending, statusCounts.cancel, statusCounts.ongoing];

        if (doughnutChart) {
            doughnutChart.data.labels = labels;
            doughnutChart.data.datasets[0].data = chartData;
            doughnutChart.update();
        } else {
            if (!chartRef02.current) {
                console.warn("Chart reference is not available yet.");
                return;
            }
            const ctx = chartRef02.current.getContext('2d');
            const newChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'Status Transaksi',
                            data: chartData,
                            backgroundColor: ['#4CAF50', '#FFC107', '#F44336', '#2196F3'],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                        },
                    },
                },
            });
            setDoughnutChart(newChart);
        }
    };

    const [totalTrend, setTotalTrend] = useState({ icon: 'trending-up', color: 'green' });
    const [avgTrend, setAvgTrend] = useState({ icon: 'trending-up', color: 'green' });
    const [paidTrend, setPaidTrend] = useState({ icon: 'trending-up', color: 'green' });
    const [unpaidTrend, setUnpaidTrend] = useState({ icon: 'trending-up', color: 'green' });
    const [partialTrend, setPartialTrend] = useState({ icon: 'trending-up', color: 'green' });
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        if (reports.length > 0 && totalPrice > 0) {
            setIsDataLoaded(true);
        }
    }, [reports, totalPrice]);

    useEffect(() => {
        if (!isDataLoaded) return;

        if (reports.length > prevReportsLength) {
            setTotalTrend({ icon: 'trending-up', color: 'green' });
        } else if (reports.length < prevReportsLength) {
            setTotalTrend({ icon: 'trending-down', color: 'red' });
        }
        setPrevReportsLength(reports.length);

        const currentAvg = totalPrice / (reports.length || 1);
        if (currentAvg > prevAvgTransaction) {
            setAvgTrend({ icon: 'trending-up', color: 'green' });
        } else if (currentAvg < prevAvgTransaction) {
            setAvgTrend({ icon: 'trending-down', color: 'red' });
        }
        setPrevAvgTransaction(currentAvg);

        const paidCount = reports.filter((report) => report.status_payment === 'paid').length;
        if (paidCount > prevPaidTransactions) {
            setPaidTrend({ icon: 'trending-up', color: 'green' });
        } else if (paidCount < prevPaidTransactions) {
            setPaidTrend({ icon: 'trending-down', color: 'red' });
        }
        setPrevPaidTransactions(paidCount);

        const unpaidCount = reports.filter((report) => report.status_payment === 'unpaid').length;
        if (unpaidCount > prevUnpaidTransactions) {
            setUnpaidTrend({ icon: 'trending-up', color: 'red' });
        } else if (unpaidCount < prevUnpaidTransactions) {
            setUnpaidTrend({ icon: 'trending-down', color: 'green' });
        }
        setPrevUnpaidTransactions(unpaidCount);

        const partialCount = reports.filter((report) => report.status_payment === 'partial').length;
        if (partialCount > prevPartialTransactions) {
            setPartialTrend({ icon: 'trending-up', color: 'red' });
        } else if (partialCount < prevPartialTransactions) {
            setPartialTrend({ icon: 'trending-down', color: 'green' });
        }
        setPrevUnpaidTransactions(partialCount);
    }, [reports, totalPrice, isDataLoaded]);

    const formatNumber = (value) => {
        return new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    useEffect(() => {
        fetchCustomer();
        fetchTotalPrice();
        fetchReport();
        const interval = setInterval(() => {
            fetchReport();
            fetchCustomer();
            fetchTotalPrice();
        }, 6000);

        return () => clearInterval(interval);
    }, [month, year, startDate, endDate, status]);

    useEffect(() => {
        fetchCustomer();
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-white">
                        Chart Penjualan
                    </h2>
                </div>
            }
        >
            <Head title="Diagram Penjualan" />
            <Breadcrumbs>
                <Link href={route('dashboard')} className="opacity-60">
                    Dashboard
                </Link>
                <Link href={route('diagram.page')} className="opacity-60">
                    Chart Penjualan
                </Link>
            </Breadcrumbs>
            <div className="mx-auto p-6 bg-white rounded-lg shadow-lg space-y-8">
                {/* Total Pemasukan dan Grafik */}
                <div className='flex lg:flex-row flex-col p-2 h-full lg:space-x-2 space-x-0 lg:space-y-0 space-y-2'>
                    <div className='shadow-xl flex flex-row space-x-3 items-center border w-full p-10 h-auto rounded-xl'>
                        <div className='bg-green-200 flex p-3 rounded-full'>
                            <IonIcon className='text-green-500 text-[30px]' name='cash' />
                        </div>
                        <h2 className="text-sm text-black font-semibold">Total Keseluruhan Transaksi:<br /> {reports.length} transaksi</h2>
                        <IonIcon className={`text-[30px] text-${totalTrend.color}-400 font-bold`} name={totalTrend.icon} />
                    </div>
                    <div className='shadow-xl flex flex-row space-x-3 items-center border w-full p-10 h-auto rounded-xl'>
                        <div className='bg-green-200 flex p-3 rounded-full'>
                            <IonIcon className='text-black text-[30px]' name='man' />
                        </div>
                        <h2 className="text-sm text-black font-semibold">Rata-rata Nilai Transaksi:<br /> Rp.{formatNumber(totalPrice / reports.length || 0)}</h2>
                        <IonIcon className={`text-[30px] text-${avgTrend.color}-400 font-bold`} name={avgTrend.icon} />
                    </div>
                    <div className='shadow-xl flex flex-row space-x-3 items-center border w-full p-10 h-auto rounded-xl'>
                        <div className='bg-green-200 flex p-3 rounded-full'>
                            <IonIcon className='text-green-500 text-[30px]' name='cart' />
                        </div>
                        <h2 className="text-sm text-black font-semibold">Transaksi yang sudah dibayar:<br /> {reports.filter(report => report.status_payment === 'paid').length} transaksi</h2>
                        <IonIcon className={`text-[30px] text-${paidTrend.color}-400 font-bold`} name={paidTrend.icon} />
                    </div>
                    <div className=' shadow-xl flex flex-row space-x-3 items-center border w-full p-10 h-auto rounded-xl'>
                        <div className='bg-red-200 flex p-3 rounded-full'>
                            <IonIcon className='text-red-500 text-[30px]' name='cart' />
                        </div>
                        <h2 className="text-sm text-black font-semibold">Transaksi yang Belum Membayar<br /> {reports.filter(report => report.status_payment === 'unpaid').length} transaksi</h2>
                        <IonIcon className={`text-[30px] text-${unpaidTrend.color}-400 font-bold`} name={unpaidTrend.icon} />
                    </div>
                </div>
                <div className='flex-1 max-w-full bg-white shadow-xl text-gray-700 rounded-lg p-6'>
                    <h2 className="text-lg font-semibold mb-4">Total Pemasukan: Rp.{formatNumber(totalPrice)}</h2>
                    <div className="p-4 bg-white w-full h-auto shadow rounded">
                        <canvas ref={chartRef01} width={500} height={150}/>
                    </div>
                </div>
                {/* <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
                    <div className="flex-1 bg-gradient-to-r bg-gray-300 text-gray-700 rounded-lg p-6 shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Total Pemasukan: Rp.{formatNumber(totalPrice)}</h2>
                        <div className="p-4 bg-white w-full h-auto shadow rounded">
                            <canvas ref={chartRef02} />
                        </div>
                    </div>
                    <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                        <div className="border-t-4 border-blue-500 pt-4 pb-4">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Pelanggan Paling Aktif</h3>
                            <ul className="space-y-2">
                                {customers.slice(0, 5).map((customer) => (
                                    <li
                                        key={customer.id}
                                        className="text-lg text-gray-700 font-medium p-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        {customer.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="border-t-4 border-green-500 pt-4 pb-4 mt-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-4">List Status Count</h1>
                            <ul className="space-y-2">
                                {['done', 'pending', 'cancel', 'ongoing'].map((status) => {
                                    const count = reports.filter((report) => report.status_job === status).length;
                                    return (
                                        <li
                                            key={status}
                                            className="text-lg text-gray-700 font-medium p-2 rounded-md hover:bg-green-50 hover:text-green-600 transition-colors"
                                        >
                                            {status.charAt(0).toUpperCase() + status.slice(1)}: {count}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div> */}
                {/* Filter dan Statistik */}
                <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
                    <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Filter Penjualan</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label>Bulan</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    className="border rounded p-2 w-full"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Tahun</label>
                                <input
                                    type="number"
                                    min="2000"
                                    max="2100"
                                    className="border rounded p-2 w-full"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Tanggal Mulai</label>
                                <input
                                    type="date"
                                    className="border rounded p-2 w-full"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Tanggal Akhir</label>
                                <input
                                    type="date"
                                    className="border rounded p-2 w-full"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabel Transaksi Terbaru */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Transaksi Terbaru</h3>
                    <div className="overflow-x-auto rounded-2xl">
                        <table className="min-w-full bg-gray-300 text-white shadow-md">
                            <thead>
                                <tr className='bg-gray-700 text-left'>
                                    <th className="py-3 px-4">Nama Pelanggan</th>
                                    <th className="py-3 px-4">Produk</th>
                                    <th className="py-3 px-4">Tipe Laundry</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Status Pembayaran</th>
                                    <th className="py-3 px-4">Start Date</th>
                                    <th className="py-3 px-4">End Date</th>
                                    <th className="py-3 px-4">Total Harga</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.slice(0, 5).map((report, index) => (
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
        </AuthenticatedLayout >
    );
}
