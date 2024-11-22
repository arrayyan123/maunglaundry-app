import AddCustomer from '@/Components/AdminDashboard/AddCustomer';
import Request_Table from '@/Components/AdminDashboard/Request_Table';
import EntryTransaction from '@/Components/AdminDashboard/EntryTransaction';  
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import TransactionDetail from '@/Components/AdminDashboard/TransactionDetail';

export default function Dashboard({ auth, customers }) {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setSelectedTransactionId(null);
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
            <AddCustomer />
        </AuthenticatedLayout>
    );
}
