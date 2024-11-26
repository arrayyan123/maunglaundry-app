import AddCustomer from '@/Components/AdminDashboard/AddCustomer';
import Request_Table from '@/Components/AdminDashboard/Request_Table';
import EntryTransaction from '@/Components/AdminDashboard/EntryTransaction';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import TransactionDetail from '@/Components/AdminDashboard/TransactionDetail';
import axios from 'axios';
import AddCustButton from '@/Components/AdminDashboard/AddCustButton';
import { Fade } from 'react-reveal';

export default function Dashboard({ auth, customers }) {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isAddingCustomer, setIsAddingCustomer] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setSelectedTransactionId(null); // Reset transaction ID
        setTransactionDetails(null); // Reset transaction details
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
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard" />
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
            <Request_Table
                customers={customers}
                onSelectCustomer={handleSelectCustomer}
                onViewDetails={handleViewDetails}
            />
            {selectedCustomer && !selectedTransactionId && transactions.length > 0 && (
                <Fade>
                    <div className='mx-auto max-w-3xl p-6 mb-10 bg-white rounded-lg'>
                        <h3 className="text-lg font-semibold">Transactions</h3>
                        <ul>
                            {transactions.map(transaction => (
                                <li key={transaction.id}>
                                    <button
                                        className="text-blue-600"
                                    // onClick={() => handleViewDetailsOn(transaction.id)}
                                    >
                                        View Transaction {transaction.nama_produk} status ({transaction.status_payment})
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Fade>
            )}

        </AuthenticatedLayout>
    );
}
