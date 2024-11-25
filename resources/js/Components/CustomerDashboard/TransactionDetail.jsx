import React, { useState, useEffect } from "react";
import axios from "axios";
import { Fade } from "react-reveal";
import TransferCard from "./Payment/TransferCard";
import CashCard from "./Payment/CashCard";
import EwalletCard from "./Payment/EwalletCard";

function TransactionDetail({ customerId, transactionId, onClose }) {
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPaymentComponent, setSelectedPaymentComponent] = useState(null);

    useEffect(() => {
        const fetchCustomerName = async () => {
            try {
                const response = await axios.get(`/api/customer/${customerId}`);
                setCustomerName(response.data.name);
            } catch (error) {
                console.error("Error fetching customer name:", error);
            }
        };

        if (customerId) fetchCustomerName();
    }, [customerId]);
    useEffect(() => {
        const fetchTransactionDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/admin/transaction-details/${transactionId}`);
                const transactionData = response.data;
                setTransaction(transactionData);
            } catch (error) {
                console.error("Failed to fetch transaction details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (transactionId) fetchTransactionDetails();
    }, [transactionId]);

    const handleCancelRequest = (transactionId) => {
        axios
            .put(`/api/admin/transactions/${transactionId}/update-job-status`, { status_job: "cancel" })
            .then(() => {
                setTransaction((prev) => ({
                    ...prev,
                    status_job: "cancel"
                }));
                setShowCancelModal(false);
            })
            .catch((error) => {
                console.error("Failed to update job status:", error);
            });
    };

    const paymentComponentMapping = {
        'Transfer': TransferCard,
        'E-Wallet': EwalletCard,
        'Cash': CashCard,
    };
    const handleShowPaymentModal = () => {
        if (transaction?.payment_method?.name) {
            const SelectedComponent = paymentComponentMapping[transaction.payment_method.name];
            if (SelectedComponent) {
                setSelectedPaymentComponent(() => SelectedComponent);
                setShowPaymentModal(true);
            }
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!transaction) {
        return <p>No transaction details found for this transaction ID.</p>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Transaction Details</h3>
                <p><strong>Nama Customer:</strong> {customerName} </p>
                <p><strong>Nama Produk:</strong> {transaction?.nama_produk}</p>
                <p><strong>Laundry Type:</strong> {transaction?.laundry_type}</p>
                <p>
                    <strong>Payment Method:</strong> {transaction.payment_method?.name || "N/A"}{" "}
                    {transaction.payment_method?.name && (
                        <button
                            className="text-blue-500 underline"
                            onClick={handleShowPaymentModal}
                        >
                            View Details
                        </button>
                    )}
                </p>
                <p><strong>Status Payment:</strong> {transaction.status_payment}</p>
                <p><strong>Status Job:</strong> {transaction.status_job}</p>

                <h3 className="text-lg font-medium mb-2">Services</h3>
                <ul className="list-disc list-inside">
                    {Array.isArray(transaction?.details) && transaction.details.length > 0 ? (
                        transaction.details.map((detail) => (
                            <li key={detail.id} className="mb-2">
                                <p><strong>Service Type:</strong> {detail?.service_type?.jenis_pelayanan || "N/A"}</p>
                                <p><strong>Service Price:</strong> {detail?.service_price?.harga || "N/A"}</p>
                                <p><strong>Quantity:</strong> {detail?.quantity || "N/A"}</p>
                                <p><strong>Total Price:</strong> {detail?.price || "N/A"}</p>
                            </li>
                        ))
                    ) : (
                        <p>No service details available.</p>
                    )}
                </ul>

                <div className="mt-6 flex md:flex-row flex-col md:space-x-4 space-x-0 md:space-y-0 space-y-3 items-center">
                    <button
                        onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowCancelModal(true);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded w-full md:w-auto"
                    >
                        Cancel Request
                    </button>
                    <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded w-full md:w-auto">
                        Close
                    </button>
                    {transaction?.status_payment === 'unpaid' && (
                        <a href="">
                            <button className="px-4 py-2 text-white bg-blue-500 w-full md:w-auto">
                                Belum Membayar? hubungi Admin
                            </button>
                        </a>
                    )}
                </div>


                {showCancelModal && selectedTransaction && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <Fade>
                            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                                <p className="text-lg">Are you sure you want to cancel this transaction?</p>
                                <p><strong>Transaction ID:</strong> {selectedTransaction.id}</p>
                                <p><strong>Nama Produk:</strong> {selectedTransaction.nama_produk}</p>
                                <div className="mt-4 flex justify-end space-x-4">
                                    <button
                                        onClick={() => handleCancelRequest(selectedTransaction.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Yes, Cancel
                                    </button>
                                    <button
                                        onClick={() => setShowCancelModal(false)}
                                        className="bg-gray-300 text-black px-4 py-2 rounded"
                                    >
                                        No, Go Back
                                    </button>
                                </div>
                            </div>
                        </Fade>
                    </div>
                )}
                {showPaymentModal && selectedPaymentComponent && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-md shadow-md mx-7">
                            <button
                                className="absolute top-12 right-12 text-[30px] hover:font-bold text-white"
                                onClick={() => setShowPaymentModal(false)}
                            >
                                ✕
                            </button>
                            {React.createElement(selectedPaymentComponent)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TransactionDetail;
