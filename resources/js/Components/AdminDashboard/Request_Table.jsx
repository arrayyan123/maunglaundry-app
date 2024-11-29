import { Link } from '@inertiajs/react'
import React, { useState } from 'react'
import DistanceCalculator from '../DistanceCalculator';

function Request_Table({ customers, onSelectCustomer, onViewDetails, scrollToEntry, onDeleteCustomer }) {
    const [searchQuery, setSearchQuery] = useState(''); 
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const itemsPerPage = 5;

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)
    );
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
        <div className="customer-section py-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search by name or phone number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Address
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jarak
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Registration Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentCustomers.length > 0 ? (
                                        currentCustomers.map((customer) => (
                                            <tr key={customer.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {customer.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {customer.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {customer.phone}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
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
                                                        {new Date(customer.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 space-x-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => onSelectCustomer(customer)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                                    >
                                                        Add Transaction
                                                    </button>
                                                    <button
                                                        onClick={() => onViewDetails(customer.id)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                                    >
                                                        See Details
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(customer)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-4 text-center text-gray-500"
                                            >
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
                                Prev
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
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {deleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Delete Customer</h2>
                        <p>Are you sure you want to delete <strong>{customerToDelete?.name}</strong>?</p>
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
