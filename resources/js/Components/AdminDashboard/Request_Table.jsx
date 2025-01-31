import { Link } from '@inertiajs/react'
import React, { useState } from 'react'
import DistanceCalculator from '../DistanceCalculator';
import IonIcon from '@reacticons/ionicons';
import { Tooltip } from 'flowbite-react';

function Request_Table({ customers, onSelectCustomer, onViewDetails, scrollToEntry, onDeleteCustomer, className }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [emailFilter, setEmailFilter] = useState('');
    const [createdAtFilter, setCreatedAtFilter] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const itemsPerPage = 5;

    const filteredCustomers = customers
        .filter((customer) =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone.includes(searchQuery)
        )
        .filter((customer) => {
            if (createdAtFilter) {
                const customerDate = new Date(customer.created_at).toDateString();
                const filterDate = new Date(createdAtFilter).toDateString();
                return customerDate === filterDate;
            }
            return true;
        })
        .filter((customer) => {
            if (emailFilter) {
                return customer.email && customer.email.toLowerCase().startsWith(emailFilter.toLowerCase());
            }
            return true;
        })
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });

    const indexOfLastCustomer = currentPage * itemsPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    const openDeleteModal = (customer) => {
        setCustomerToDelete(customer);
        setDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        if (customerToDelete) {
            onDeleteCustomer(customerToDelete.id);
        }
        setDeleteModalOpen(false);
        setCustomerToDelete(null);
    };

    const closeModal = () => {
        setDeleteModalOpen(false);
        setCustomerToDelete(null);
    };
    return (
        <div className={`${className} py-12 motion motion-preset-slide-up-md`}>
            <div className="mx-auto max-w-full sm:px-6 lg:px-0">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <div className="mb-4">
                            <div className='flex lg:flex-row flex-col w-full gap-4'>
                                <div className='w-full'>
                                    <h1>Search nama atau nomor</h1>
                                    <input
                                        type="text"
                                        placeholder="Search by name or phone number..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className='w-full'>
                                    <h1>asc/dsc</h1>
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="asc">Sort Ascending</option>
                                        <option value="desc">Sort Descending</option>
                                    </select>
                                </div>
                                <div className='w-full'>
                                    <h1>Search email</h1>
                                    <input
                                        type="text"
                                        placeholder="Filter by email domain (e.g., @gmail.com)"
                                        value={emailFilter}
                                        onChange={(e) => setEmailFilter(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className='w-full'>
                                    <h1>Tanggal Registrasi</h1>
                                    <input
                                        type="date"
                                        value={createdAtFilter}
                                        onChange={(e) => setCreatedAtFilter(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full max-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Action
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Address
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Jarak
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Registration Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentCustomers.length > 0 ? (
                                        currentCustomers.map((customer) => (
                                            <tr key={customer.id}>
                                                <td className="px-6 py-4 flex space-x-4 whitespace-nowrap">
                                                    <Tooltip content="Menambah Transaksi">
                                                        <button
                                                            onClick={() => onSelectCustomer(customer)}
                                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                        >
                                                            <span className="flex flex-row items-center space-x-3">
                                                                <IonIcon name="create" />
                                                            </span>
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip content="Detail transaksi">
                                                        <button
                                                            onClick={() => onViewDetails(customer.id)}
                                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                        >
                                                            <span className="flex flex-row items-center space-x-3">
                                                                <IonIcon name="cash" />
                                                            </span>
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip content="hapus pelanggan">
                                                        <button
                                                            onClick={() => openDeleteModal(customer)}
                                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                        >
                                                            <span className="flex flex-row items-center space-x-3">
                                                                <IonIcon name="trash" />
                                                            </span>
                                                        </button>
                                                    </Tooltip>
                                                </td>
                                                <td className="px-6 py-4 truncate">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {customer.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 truncate">
                                                    <div className="text-sm text-gray-900">
                                                        {customer.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 truncate">
                                                    <div className="text-sm text-gray-900">
                                                        {customer.phone}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 truncate">
                                                    <div className="text-sm text-gray-900">
                                                        {customer.address}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        <DistanceCalculator customerAddress={customer.address} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Intl.DateTimeFormat('id-ID', {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false
                                                        }).format(new Date(customer.created_at))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                                No customers found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="px-4 py-2 text-sm bg-blue-500 text-white rounded disabled:opacity-50"
                                disabled={currentPage === 1}
                            >
                                <IonIcon name='caret-back'></IonIcon>
                            </button>
                            <div className="flex space-x-2">
                                {/* Display page numbers */}
                                {currentPage > 2 && (
                                    <>
                                        <button
                                            onClick={() => handlePageChange(1)}
                                            className="px-4 py-2 text-sm bg-gray-200 rounded"
                                        >
                                            1
                                        </button>
                                        <span className="px-2 py-2 text-sm text-gray-500">...</span>
                                    </>
                                )}
                                {currentPage > 1 && (
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        className="px-4 py-2 text-sm bg-gray-200 rounded"
                                    >
                                        {currentPage - 1}
                                    </button>
                                )}
                                <button
                                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded"
                                >
                                    {currentPage}
                                </button>
                                {currentPage < totalPages && (
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        className="px-4 py-2 text-sm bg-gray-200 rounded"
                                    >
                                        {currentPage + 1}
                                    </button>
                                )}
                                {currentPage < totalPages - 1 && (
                                    <span className="px-2 py-2 text-sm text-gray-500">...</span>
                                )}
                                {currentPage < totalPages && (
                                    <button
                                        onClick={() => handlePageChange(totalPages)}
                                        className="px-4 py-2 text-sm bg-gray-200 rounded"
                                    >
                                        {totalPages}
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="px-4 py-2 text-sm bg-blue-500 text-white rounded disabled:opacity-50"
                                disabled={currentPage === totalPages}
                            >
                                <IonIcon name='caret-forward'></IonIcon>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {deleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white text-black p-6 rounded shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Delete Customer</h2>
                        <p>Anda yakin ingin menghapus <strong>{customerToDelete?.name}</strong>?</p>
                        <p>menghapus data customer akan menghapus transaksi seluruh dari customer tersebut.</p>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Request_Table
