import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionDetail({ customerId, transactionId, onClose }) {
  const [transactions, setTransactions] = useState([]); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint = transactionId
          ? `/api/admin/transactions/${transactionId}`
          : `/api/admin/transactions/${customerId}`;

        const response = await axios.get(endpoint);
        setTransactions(response.data.transaction || response.data.transactions);
      } catch (error) {
        console.error("Failed to load transaction details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId || transactionId) fetchData();
  }, [customerId, transactionId]);

  const handleUpdatePaymentStatus = (transactionId) => {
    axios.put(`/api/admin/transactions/${transactionId}/payment`, { status: 'paid' })
      .then(() => {
        setTransactions(prev =>
          prev.map(transaction =>
            transaction.id === transactionId
              ? { ...transaction, status_payment: 'paid' }
              : transaction
          )
        );
      })
      .catch(error => {
        console.error('Failed to update payment status:', error);
      });
  };

  const handleUpdateJobStatus = (transactionId, status) => {
    axios.put(`/api/admin/transactions/${transactionId}/update-job-status`, { status })
      .then(() => {
        setTransactions(prev =>
          prev.map(transaction =>
            transaction.id === transactionId
              ? { ...transaction, status_job: status }
              : transaction
          )
        );
      })
      .catch(error => {
        console.error('Failed to update job status:', error);
      });
  };

  const handleDeleteTransaction = (transactionId) => {
    axios.delete(`/api/admin/transactions/${transactionId}`)
      .then(() => {
        setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId));
        onClose();
      })
      .catch(error => {
        console.error('Failed to delete transaction:', error);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (transactions.length === 0) {
    return <p>No transactions found for this customer.</p>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Transactions for Customer ID: {customerId}</h2>

      {transactions.map(transaction => (
        <div key={transaction.id}>
          <h3 className="text-xl font-semibold mb-4">Transaction Details</h3>
          <p><strong>Customer ID:</strong> {transaction?.customer_id}</p>
          <p><strong>Laundry Type:</strong> {transaction?.laundry_type}</p>

          <div className="flex items-center mb-4">
            <p className="mr-2"><strong>Status Payment:</strong> {transaction.status_payment}</p>
            <button
              className={`px-4 py-2 rounded ${transaction?.status_payment === "paid" ? "bg-gray-400" : "bg-green-500"
                } text-white`}
              onClick={() => handleUpdatePaymentStatus(transaction.id)}
              disabled={transaction?.status_payment === "paid"}
            >
              {transaction?.status_payment === "unpaid" ? "Mark as Paid" : "Paid"}
            </button>
          </div>

          <div className="mb-4">
            <p><strong>Status Job:</strong> {transaction.status_job}</p>
            <select
              value={transaction?.status_job || "ongoing"}
              onChange={(e) => handleUpdateJobStatus(transaction.id, e.target.value)}
              className="border border-gray-300 p-2 rounded mt-2 w-full"
            >
              <option value="ongoing">Ongoing</option>
              <option value="pending">Pending</option>
              <option value="done">Done</option>
              <option value="cancel">Cancel</option>
            </select>
          </div>

          <h3 className="text-lg font-medium mb-2">Services</h3>
          <ul className="list-disc list-inside">
            {Array.isArray(transaction?.details) && transaction.details.length > 0 ? (
              transaction.details.map((detail) => (
                <li key={detail.id} className="mb-2">
                  <p><strong>Payment Method: </strong> {detail?.payment_methods?.name}</p>
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


          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete Transaction
            </button>
            <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">
              Close
            </button>
          </div>

          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                <p className="text-lg">Are you sure you want to delete this transaction?</p>
                <div className="mt-4 flex justify-end space-x-4">
                  <button onClick={() => handleDeleteTransaction(transaction.id)} className="bg-red-500 text-white px-4 py-2 rounded">
                    Yes, Delete
                  </button>
                  <button onClick={() => setShowDeleteModal(false)} className="bg-gray-300 text-black px-4 py-2 rounded">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default TransactionDetail;