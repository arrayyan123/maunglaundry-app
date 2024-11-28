import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Fade, Zoom } from 'react-reveal';

function TransactionDetail({ customerId, transactionId, onClose }) {
  const [transactions, setTransactions] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [countdown, setCountdown] = useState(5);
  const [customerName, setCustomerName] = useState('');
  const [customerNames, setCustomerNames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 2;
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');


  useEffect(() => {
    if (showConfirmModal) {
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showConfirmModal]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint = transactionId
          ? `/api/admin/transactions/${transactionId}`
          : `/api/customer/${customerId}`;

        const response = await axios.get(endpoint);
        const transactionsData = response.data.transaction || response.data.transactions;
        setTransactions(transactionsData);
        setFilteredTransactions(transactionsData);

        if (transactionsData.length > 0) {
          const uniqueCustomerIds = [...new Set(transactionsData.map((t) => t.customer_id))];
          console.log("Unique Customer IDs:", uniqueCustomerIds);

          const customerData = await Promise.all(
            uniqueCustomerIds.map(async (idCustomer) => {
              const customerResponse = await axios.get(`/api/customer/${idCustomer}`);
              return { id: idCustomer, name: customerResponse.data.name };
            })
          );
          console.log("Fetched customer data:", customerData);

          const customerNamesObject = customerData.reduce((acc, { id, name }) => {
            acc[id] = name;
            return acc;
          }, {});
          setCustomerNames(customerNamesObject);  // Store as an object mapping id to name
        }
      } catch (error) {
        console.error("Failed to load transaction details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId || transactionId) fetchData();
  }, [customerId, transactionId]);


  const customer = customerNames[transaction?.customer_id];

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const openConfirmModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowConfirmModal(true);
  };

  const confirmMarkAsPaid = () => {
    if (selectedTransaction) {
      handleUpdatePaymentStatus(selectedTransaction.id);
      setShowConfirmModal(false);
    }
  };

  const handleUpdatePaymentStatus = (transactionId) => {
    axios.put(`/api/admin/transactions/${transactionId}/payment`, {
      status_payment: 'paid'
    })
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
    axios.put(`/api/admin/transactions/${transactionId}/update-job-status`, { status_job: status })
      .then(() => {
        setTransactions(prev =>
          prev.map(transaction =>
            transaction.id === transactionId
              ? { ...transaction, status_job: status }
              : transaction
          )
        );
        setAlertMessage(`Status Pengerjaan menjadi "${status}" berhasil`);
        setShowAlertModal(true);
      })
      .catch(error => {
        console.error('Failed to update job status:', error);
      });
  };

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = transactions.filter((transaction) => {
      const matchesProductName = transaction.nama_produk
        ?.toLowerCase()
        .includes(lowerCaseQuery);
      const matchesLaundryType = transaction.laundry_type
        ?.toLowerCase()
        .includes(lowerCaseQuery);
      const matchesServiceType = transaction.details?.some((detail) =>
        detail.service_type?.jenis_pelayanan?.toLowerCase().includes(lowerCaseQuery)
      );
      return matchesProductName || matchesLaundryType || matchesServiceType;
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchQuery, transactions]);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
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
  const handlePrintReceipt = () => {
    if (selectedTransaction) {
      window.open(`/api/admin/transactions/${selectedTransaction}/receipt`, "_blank");
      setShowReceiptModal(false); 
    }
  };
  
  const handleClickPrint = (transactionId) => {
    setSelectedTransaction(transactionId);
    setShowReceiptModal(true); 
  };  

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-700">Loading...</div>;
  }

  if (transactions.length === 0) {
    return <div className="flex items-center justify-center h-screen text-gray-500">No transactions found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mb-10 bg-white shadow-md rounded-lg">
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by product name, laundry type, or service type..."
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      {currentTransactions.map(transaction => (
        <div key={transaction.id} className='border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50 hover:bg-gray-100'>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Transaction Details</h3>
          {transaction?.customer_id && customerNames[transaction?.customer_id] ? (
            <p><strong>Customer Name:</strong> {customerNames[transaction?.customer_id]}</p>
          ) : (
            <p><strong>Customer Name:</strong> Loading...</p>
          )}
          <p><strong>Nama Produk:</strong> {transaction?.nama_produk}</p>
          <p><strong>Laundry Type:</strong> {transaction?.laundry_type}</p>
          <p>
            <strong>Start Date:</strong>{" "}
            {transaction?.start_date
              ? new Date(transaction.start_date).toLocaleString()
              : "N/A"}
          </p>
          <p>
            <strong>End Date:</strong>{" "}
            {transaction?.end_date
              ? new Date(transaction.end_date).toLocaleString()
              : "N/A"}
          </p>

          {/* Payment Method Display */}
          <p><strong>Payment Method:</strong> {transaction?.payment_method?.name || "N/A"}</p>

          <div className="flex items-center mb-4">
            <p className="mr-2"><strong>Status Payment:</strong> {transaction.status_payment}</p>
            <button
              className={`px-4 py-2 rounded ${transaction?.status_payment === "paid" ? "bg-gray-400" : "bg-green-500"} text-white`}
              onClick={() => openConfirmModal(transaction)}
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
            // disabled={transaction?.status_job === "done"}
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
                  <p><strong>Service Type:</strong> {detail?.service_type?.jenis_pelayanan || "N/A"}</p>
                  <p><strong>Service Price:</strong> Rp.{formatNumber(detail?.service_price?.harga || "N/A")}</p>
                  <p><strong>Quantity:</strong> {detail?.quantity || "N/A"}</p>
                  <p><strong>Total Price:</strong> Rp.{formatNumber(detail?.price || "N/A")}</p>
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
            <button onClick={() => handleClickPrint(transaction.id)} className='bg-gray-300 text-black px-4 py-2 rounded'>
              Print Receipt
            </button>
            <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">
              Close
            </button>
          </div>
          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <Fade>
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
              </Fade>
            </div>
          )}
          {showConfirmModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <Fade>
                <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                  <h2 className="text-lg font-semibold mb-4">Confirm Payment</h2>
                  <p>Apakah anda yakin bahwa customer telah membayar?</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {/* <strong>Customer:</strong> {selectedTransaction?.customer_id}<br /> */}
                    {transaction?.customer_id && customerNames[transaction?.customer_id] ? (
                      <p><strong>Customer Name:</strong> {customerNames[transaction?.customer_id]}</p>
                    ) : (
                      <p><strong>Customer Name:</strong> Loading...</p>
                    )}
                    <p><strong>Nama Produk:</strong> {selectedTransaction?.nama_produk}</p>
                    <strong>Details:</strong>
                    <ul className="mt-2">
                      {selectedTransaction?.details?.map((detail, index) => (
                        <li key={index}>
                          <p>Service: {detail?.service_type?.jenis_pelayanan || "N/A"}</p>
                          <p>Price: Rp {detail?.price || "N/A"}</p>
                          <p>Quantity: {detail?.quantity || 1}</p>
                        </li>
                      ))}
                    </ul>
                  </p>

                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="bg-gray-300 text-black px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmMarkAsPaid}
                      className={`px-4 py-2 rounded ${countdown === 0 ? "bg-green-500" : "bg-gray-400"} text-white`}
                      disabled={countdown > 0}
                    >
                      {countdown > 0 ? `Wait ${countdown}s` : "Yes, Mark as Paid"}
                    </button>

                  </div>
                </div>
              </Fade>
            </div>
          )}
          {showAlertModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-md w-full text-center">
                <p className="text-lg font-medium">{alertMessage}</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => setShowAlertModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          )}
          {showReceiptModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-md shadow-md">
                <h3 className="text-lg font-semibold mb-4">Cetak Struk?</h3>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowReceiptModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Tidak
                  </button>
                  <button
                    onClick={() => {
                      setShowReceiptModal(false);
                      handlePrintReceipt();
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Ya, Cetak
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className='border-b-2 border-b-gray-900 w-full h-0 my-10' />
        </div>
      ))}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"}`}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1)
          .filter(
            (page) =>
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 2 && page <= currentPage + 2)
          )
          .map((page, index, pages) => (
            <>
              {index > 0 && pages[index - 1] !== page - 1 && (
                <span key={`ellipsis-${page}`} className="text-gray-500">
                  ...
                </span>
              )}
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-300"}`}
              >
                {page}
              </button>
            </>
          ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"}`}
        >
          Next
        </button>
      </div>
    </div>

  );
}

export default TransactionDetail;