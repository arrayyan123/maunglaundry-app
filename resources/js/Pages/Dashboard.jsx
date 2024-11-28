import AddCustomer from '@/Components/AdminDashboard/AddCustomer';
import Request_Table from '@/Components/AdminDashboard/Request_Table';
import EntryTransaction from '@/Components/AdminDashboard/EntryTransaction';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import TransactionDetail from '@/Components/AdminDashboard/TransactionDetail';
import axios from 'axios';
import AddCustButton from '@/Components/AdminDashboard/AddCustButton';
import { Bar } from 'react-chartjs-2';
import { Fade } from 'react-awesome-reveal';

export default function Dashboard({ auth, customers }) {
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
    };

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
            user={auth.user}
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-white">
                        Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard" />
            <div className='my-6'>
                <h1 className='font-bold text-lg '>Selamat Datang {auth.user.name} !!</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <Fade cascade>
                    <div className="bg-blue-500 text-white p-6 rounded-lg shadow-xl">
                        <h3 className="text-xl font-bold">Total Customers</h3>
                        <p className="text-3xl">{customers.length}</p>
                    </div>
                    <div className="bg-green-500 text-white p-6 rounded-lg shadow-xl">
                        <h3 className="text-xl font-bold">Total Transactions</h3>
                        <p className="text-3xl">{reports.length}</p>
                    </div>
                    <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-xl">
                        <h3 className="text-xl font-bold">Pending Requests</h3>
                        <p className="text-3xl">{reports.filter(report => report.status_job === 'pending').length}</p>
                    </div>
                    <div className="bg-green-500 text-white p-6 rounded-lg shadow-xl">
                        <h3 className="text-xl font-bold">Done Requests</h3>
                        <p className="text-3xl">{reports.filter(report => report.status_job === 'done').length}</p>
                    </div>
                    <div className="bg-red-500 text-white p-6 rounded-lg shadow-xl">
                        <h3 className="text-xl font-bold">Cancel Requests</h3>
                        <p className="text-3xl">{reports.filter(report => report.status_job === 'cancel').length}</p>
                    </div>
                    <div className="bg-blue-500 text-white p-6 rounded-lg shadow-xl">
                        <h3 className="text-xl font-bold">Ongoing Requests</h3>
                        <p className="text-3xl">{reports.filter(report => report.status_job === 'ongoing').length}</p>
                    </div>
                </Fade>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow my-6">
                <h3 className="text-lg font-bold">Tugas Admin</h3>
                <ul className="list-disc pl-6">
                    <li>Menambahkan customer yang belum terdaftar</li>
                    <li>membuat transaksi baru customer</li>
                    <li>Update status transaksi</li>
                    <li>Membuat laporan bulanan penjualan</li>
                </ul>
            </div>

            <AddCustButton onClick={() => setIsAddingCustomer(true)} />
            {isAddingCustomer && (
                <div className="mx-auto max-w-7xl p-6 my-10 bg-white rounded-lg">
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
                <div className='mx-auto max-w-7xl p-6 my-10 bg-white rounded-lg'>
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
                <TransactionDetail
                    customerId={selectedCustomer.id}
                    transactionId={selectedTransactionId}
                    onClose={handleCloseTransactionDetail}
                />
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
                                        onClick={() => handleViewDetails(transaction.id)}
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
                customers={customers}
                onSelectCustomer={handleSelectCustomer}
                onViewDetails={handleViewDetails}
            />
        </AuthenticatedLayout>
    );
}
