import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReportTable from '@/Components/AdminDashboard/ReportTable';
import { Breadcrumbs } from "@material-tailwind/react";


export default function ReportPage({ auth, customers }) {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isAddingCustomer, setIsAddingCustomer] = useState(false);
    const { query } = usePage().props;
    const [status, setStatus] = useState('');
    const [year, setYear] = useState('');

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

    useEffect(() => {
        if (query && query.status_job) {
            setStatus(query.status_job);
        }
    }, [query]);

    useEffect(() => {
        if (query && query.year) {
            setYear(query.year);
        }
    }, [query]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
              <div>
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Laporan Data Transaksi
                </h2>
              </div>
            }
        >
            <Head title="Report" />
            <Breadcrumbs>
                <Link href={route('dashboard')} className="opacity-60">
                    Dashboard
                </Link>
                <Link href={route('admin.report')} className="opacity-60">
                    Laporan
                </Link>
            </Breadcrumbs>
            <ReportTable 
                initialStatus={status} 
                initialYear={year}
            />
        </AuthenticatedLayout>
    );
}
