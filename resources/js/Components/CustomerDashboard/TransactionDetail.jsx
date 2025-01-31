import React, { useState, useEffect } from "react";
import axios from "axios";
import { Fade } from "react-reveal";
import TransferCard from "./Payment/TransferCard";
import CashCard from "./Payment/CashCard";
import EwalletCard from "./Payment/EwalletCard";
import { Link } from "@inertiajs/react";

function TransactionDetail({ customerId, transactionId, onClose, onCancel, onPayment }) {
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPaymentComponent, setSelectedPaymentComponent] = useState(null);
    const [showNoteArea, setShowNoteArea] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [notes, setNotes] = useState([]);
    const [downPayments, setDownPayments] = useState({});

    const linkNo = 'https://wa.link/kn9lsq';

    const addNote = async () => {
        if (!newNote.trim()) {
            alert("Note content cannot be empty");
            return;
        }
        if (!transactionId) {
            console.error("Transaction ID is missing");
            alert("Cannot add note because transaction ID is missing");
            return;
        }
        try {
            const response = await axios.post(`/api/admin/transactions/${transactionId}/notes`, {
                content: newNote,
            });
            setNotes((prevNotes) => [...prevNotes, response.data.note]);
            alert("Note added successfully!");
            setNewNote("");
            setShowNoteArea(false);
        } catch (error) {
            console.error("Failed to add note", error);
            alert("Failed to add note");
        }
    };

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

    const formatNumber = (value) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/admin/transaction-details/${transactionId}`);
                const transactionData = response.data;
                setTransaction(transactionData);

                if (Array.isArray(transactionData)) {
                    const partialTransactions = transactionData.filter(
                        (transaction) => transaction.status_payment === "partial"
                    );

                    for (const transaction of partialTransactions) {
                        await fetchDownPayment(transaction.id);
                    }
                } else if (transactionData.status_payment === "partial") {
                    await fetchDownPayment(transactionData.id);
                }

            } catch (error) {
                console.error("Failed to fetch transaction details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (transactionId) fetchTransactionDetails();
    }, [transactionId]);

    const fetchDownPayment = async (transactionId) => {
        try {
            const downPaymentResponse = await axios.get(`/api/admin/transactions/${transactionId}/down-payment`);
            const downPaymentData = downPaymentResponse.data.down_payment;

            setDownPayments((prevDownPayments) => ({
                ...prevDownPayments,
                [transactionId]: downPaymentData,
            }));
        } catch (error) {
            console.error("Failed to fetch down payment:", error);
        }
    };

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

    const handleShowNoteArea = () => {
        setShowNoteArea(!showNoteArea)
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!transaction) {
        return <p>No transaction details found for this transaction ID.</p>;
    }

    return (
        <div className="bg-white w-full max-w-2xl lg:max-w-3xl mx-auto rounded-md shadow-md overflow-y-auto max-h-[calc(100vh-2rem)] p-6 sm:p-8 md:p-8">
            <div className="mb-6 text-black">
                <div className="flex flex-row justify-between space-x-4 items-center border-b py-2 mb-3">
                    <h3 className="text-xl font-bold text-gray-800">Transaction Details</h3>
                    <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded w-full md:w-auto">
                        Close
                    </button>
                </div>
                <div className='flex flex-row my-2 gap-2'>
                    <span
                        className={`p-2 rounded-lg ${transaction.status_payment === 'paid' ? 'bg-green-500 text-white' :
                            transaction.status_payment === 'partial' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                            }`}
                    >
                        {transaction.status_payment}
                    </span>
                    <span className={` p-2 text-white rounded-lg 
                    ${transaction.status_job === 'cancel'
                            ? 'bg-red-500'
                            : transaction.status_job === 'pending'
                                ? 'bg-yellow-500'
                                : transaction.status_job === 'ongoing'
                                    ? 'bg-blue-500'
                                    : transaction.status_job === 'done'
                                        ? 'bg-green-500'
                                        : 'bg-gray-500'
                        }`}
                    >
                        <p>{transaction.status_job}</p>
                    </span>
                </div>
                <p><strong>Nama Customer:</strong> {customerName} </p>
                <p><strong>Nama Produk:</strong> {transaction?.nama_produk}</p>
                <p><strong>Tipe Laundry:</strong> {transaction?.laundry_type}</p>
                <p>
                    <strong>Metode Pembayaran:</strong> {transaction.payment_method?.name || "N/A"}{" "}
                    {transaction.payment_method?.name && (
                        <button
                            className="text-blue-500 underline"
                            onClick={onPayment}
                        >
                            Cara Pembayaran
                        </button>
                    )}
                </p>
                <p><strong>Tanggal Mulai:</strong>
                    {new Intl.DateTimeFormat('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }).format(new Date(transaction.start_date))}
                </p>
                <p><strong>Estimasi selesai:</strong>
                    {new Intl.DateTimeFormat('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }).format(new Date(transaction.end_date))}
                </p>

                <h3 className="text-lg font-bold my-2">Services</h3>
                <ul className="list-inside">
                    {Array.isArray(transaction?.details) && transaction.details.length > 0 ? (
                        transaction.details.map((detail) => (
                            <li key={detail.id} className="mb-2">
                                <p><strong>Service Type:</strong> {detail?.service_type?.jenis_pelayanan || "N/A"}</p>
                                <p><strong>Service Price:</strong> Rp.{formatNumber(detail?.service_price?.harga || "N/A")}</p>
                                <p><strong>Quantity:</strong> {detail?.quantity || "N/A"}</p>
                                <div className='py-2 px-3 flex items-center bg-green-400 rounded-lg mt-3'>
                                    <p className='font-bold text-[16px] text-white text-center'><strong>Total Harga:</strong> Rp.{formatNumber(detail?.price || "N/A")}</p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No service details available.</p>
                    )}
                </ul>
                {transaction.status_payment === 'partial' && downPayments[transaction.id] ? (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold text-gray-800">Down Payment</h3>
                        <p className='text-black'>DP: Rp.{formatNumber(downPayments[transaction.id]?.dp || 0)}</p>
                        <p className='text-black'>Sisa: Rp.{formatNumber(downPayments[transaction.id]?.remaining || 0)}</p>
                        <p className='text-black'>
                            Tanggal Dp: {downPayments[transaction.id]?.created_at 
                            ? new Intl.DateTimeFormat('id-ID', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              }).format(new Date(downPayments[transaction.id].created_at)) : "N/A"}
                        </p>
                    </div>
                ) : null}
                {showNoteArea && (
                    <div className="mt-4">
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Add your note here..."
                            className="border rounded p-2 w-full"
                        />
                        <button
                            onClick={addNote}
                            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                        >
                            Tambah Catatan
                        </button>
                    </div>
                )}
                <div className="mt-6 flex flex-col space-y-4 items-center w-full">
                    {(transaction?.status_payment !== 'paid' && transaction?.status_payment !== 'partial') && transaction?.status_job !== 'done' && transaction?.status_job !== 'pending' && transaction?.status_job !== 'cancel' &&(
                        <button
                            onClick={onCancel}
                            className="bg-red-500 text-white px-4 py-2 rounded w-full"
                        >
                            Cancel
                        </button>
                    )}
                    {(transaction?.status_payment === 'unpaid' || transaction?.status_payment === 'partial') && transaction?.status_job !== 'cancel' && (
                        <button className="px-4 py-2 rounded text-white bg-blue-500 w-full">
                            <a href={linkNo} target="_blank" rel="noopener noreferrer">
                                Ingin Membayar? hubungi Admin
                            </a>
                        </button>
                    )}

                    <button
                        onClick={handleShowNoteArea}
                        className="py-2 px-4 bg-blue-500 text-white rounded w-full">
                        <span>
                            <p>Berikan Catatan</p>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TransactionDetail;
