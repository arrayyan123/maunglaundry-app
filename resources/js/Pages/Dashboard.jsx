import AddCustomer from '@/Components/AdminDashboard/AddCustomer';
import Request_Table from '@/Components/AdminDashboard/Request_Table';
import EntryTransaction from '@/Components/AdminDashboard/EntryTransaction';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import TransactionDetail from '@/Components/AdminDashboard/TransactionDetail';
import axios from 'axios';
import AddCustButton from '@/Components/AdminDashboard/AddCustButton';

export default function Dashboard({ auth, customers }) {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isAddingCustomer, setIsAddingCustomer] = useState(false);

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setSelectedTransactionId(null);
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

    const handleCloseTransactionDetail = () => {
        setSelectedTransactionId(null);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Customer List
                </h2>
            }
        >
            <Head title="Dashboard" />
            <Request_Table
                customers={customers}
                onSelectCustomer={handleSelectCustomer}
                onViewDetails={handleViewDetails}
            />
            {selectedCustomer && !selectedTransactionId && (
                <EntryTransaction
                    customerId={selectedCustomer.id}
                    onSave={() => alert('Transaction saved!')}
                    onNavigateToPayment={() => navigate('/admin/payment-detail')}
                />
            )}

            {selectedTransactionId && selectedCustomer && (
                <TransactionDetail
                    customerId={selectedCustomer.id}
                    transactionId={selectedTransactionId}
                    onClose={handleCloseTransactionDetail}
                />
            )}

            {selectedCustomer && !selectedTransactionId && transactions.length > 0 && (
                <div className='mx-auto max-w-7xl p-6 my-10 bg-white rounded-lg'>
                    <h3 className="text-lg font-semibold">Transactions</h3>
                    <ul>
                        {transactions.map(transaction => (
                            <li key={transaction.id}>
                                <button
                                    className="text-blue-600"
                                    onClick={() => handleViewDetails(transaction.id)}
                                >
                                    View Transaction {transaction.id}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <AddCustButton onClick={() => setIsAddingCustomer(true)} />
            {isAddingCustomer && (
                <div className="mx-auto max-w-7xl p-6 my-10 bg-white rounded-lg">
                    <h3 className="text-lg font-semibold">Add Customer</h3>
                    <AddCustomer />
                    <button
                        className="mt-2 bg-red-500 text-white p-2 rounded"
                        onClick={() => setIsAddingCustomer(false)}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
