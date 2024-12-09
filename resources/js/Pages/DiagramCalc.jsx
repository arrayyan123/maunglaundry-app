import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

export default function DiagramCalc({ auth, customers }) {
    const [totalPrice, setTotalPrice] = useState(0);
    const [reports, setReports] = useState([]);
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [barChart, setBarChart] = useState(null);
    const [doughnutChart, setDoughnutChart] = useState(null);
    const chartRef01 = useRef(null);
    const chartRef02 = useRef(null);

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
                    status_job: status || null
                },
            });
            console.log('Server Response:', response.data);
            setReports(response.data.data);
            updateBarChart(response.data.data);
            updateDoughnutChart(response.data.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const updateBarChart = (data) => {
        const labels = data.map((item) => item.start_date.slice(0, 10));
        const chartData = data.map((item) => item.total_price);

        if (barChart) {
            barChart.data.labels = labels;
            barChart.data.datasets[0].data = chartData;
            barChart.update();
        } else {
            if (!chartRef01.current) {
                console.warn("Chart reference is not available yet.");
                return;
            }
            const ctx = chartRef01.current.getContext('2d');
            const newChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'Penjualan (Rp)',
                            data: chartData,
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
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

    const formatNumber = (value) => {
        return new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    useEffect(() => {
        fetchTotalPrice();
        fetchReport();
    }, [month, year, startDate, endDate, status]);

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
            <div className="container mx-auto p-6  bg-white rounded-lg shadow-lg space-y-8">
                {/* Total Pemasukan dan Grafik */}
                <div className='flex-1 bg-gray-300 text-gray-700 rounded-lg p-6 shadow-md'>
                    <h2 className="text-lg font-semibold mb-4">Total Pemasukan: Rp.{formatNumber(totalPrice)}</h2>
                    <div className="p-4 bg-white w-full h-auto shadow rounded">
                        <canvas ref={chartRef01} />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
                    <div className="flex-1 bg-gradient-to-r bg-gray-300 text-gray-700 rounded-lg p-6 shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Total Pemasukan: Rp.{formatNumber(totalPrice)}</h2>
                        <div className="p-4 bg-white w-full h-auto shadow rounded">
                            <canvas ref={chartRef02} />
                        </div>
                    </div>
                    <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                        {/* Pelanggan Paling Aktif */}
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

                        {/* List Status Count */}
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
                </div>
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
                    <div className="flex-1 bg-gray-200 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Statistik Penjualan</h3>
                        <ul className="space-y-2">
                            <li>Total Transaksi: {reports.length}</li>
                            <li>Rata-rata Nilai Transaksi: Rp.{formatNumber(totalPrice / reports.length || 0)}</li>
                            <li>Pelanggan Baru Bulan Ini: {reports.slice(0, 5).length}</li>
                        </ul>
                    </div>
                </div>

                {/* Tabel Transaksi Terbaru */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Transaksi Terbaru</h3>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">ID Pelanggan</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Pelanggan</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.slice(0, 5).map((report, index) => (
                                    <tr
                                        key={report.transaction_id}
                                        className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            } hover:bg-blue-50`}
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-700">{report.customer_id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{report.customer_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                            Rp.{formatNumber(report.total_price)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{report.start_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
