import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Fade, Zoom } from 'react-reveal';
import IonIcon from '@reacticons/ionicons';

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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentFilter, setPaymentFilter] = useState('');

  useEffect(() => {
    if (showConfirmModal) {
      setCountdown(3);
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

        const response = await axios.get(endpoint)
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
          setCustomerNames(customerNamesObject);
        }
      } catch (error) {
        console.error("Failed to load transaction details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId || transactionId) fetchData();
  }, [customerId, transactionId]);

  const handleFilter = async () => {
    try {
      const endpoint = transactionId
        ? `/api/admin/transactions/${transactionId}`
        : `/api/customer/${customerId}`;

      const response = await axios.get(endpoint, {
        params: {
          start_date: startDate || undefined, // Kirim hanya jika tidak kosong
          end_date: endDate || undefined,
        },
      });

      const transactionsData = response.data.transaction || response.data.transactions;
      setTransactions(transactionsData);
      setFilteredTransactions(transactionsData);
    } catch (error) {
      console.error("Failed to filter transactions:", error);
    }
  };

  const customer = customerNames[transaction?.customer_id];

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleUpdatePaymentStatus = (transactionId, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
    axios
      .put(`/api/admin/transactions/${transactionId}/payment`, {
        status_payment: newStatus,
      })
      .then(() => {
        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction.id === transactionId
              ? { ...transaction, status_payment: newStatus }
              : transaction
          )
        );
      })
      .catch((error) => {
        console.error('Failed to update payment status:', error);
      });
  };

  const openConfirmModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowConfirmModal(true);
  };

  const confirmMarkAsPaid = () => {
    if (selectedTransaction) {
      handleUpdatePaymentStatus(selectedTransaction.id, selectedTransaction.status_payment);
      setShowConfirmModal(false);
    }
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

      const matchesPaymentFilter =
        paymentFilter === '' || transaction.status_payment === paymentFilter;

      return (
        (matchesProductName || matchesLaundryType || matchesServiceType) &&
        matchesPaymentFilter
      );
    });

    setFilteredTransactions(filtered);

    if (searchQuery !== '') {
      setCurrentPage(1);
    }
  }, [searchQuery, paymentFilter, transactions]);

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
    <div className="max-w-full mx-auto p-6 mb-10 bg-white shadow-md rounded-lg">
      <div className="flex max-w-full md:flex-row flex-col md:space-y-0 space-y-3 space-x-0 md:space-x-4 mb-6">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by product name, laundry type, or service type..."
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)} // Update state saat tanggal dipilih
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)} // Update state saat tanggal dipilih
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label htmlFor="payment-filter" className="block text-sm font-medium text-gray-700">
            Payment Status
          </label>
          <select
            id="payment-filter"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
        <button
          onClick={handleFilter}
          className="self-end px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          <IonIcon name='filter'></IonIcon>
        </button>
      </div>

      {currentTransactions.map(transaction => (
        <div key={transaction.id} className='border border-gray-300 w-full rounded-lg p-4 mb-6 bg-gray-50 hover:bg-gray-100'>
          <div className='flex items-center justify-between'>
            <h3 className="text-lg font-bold text-gray-800">Transaction Details</h3>
            <button
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
          <div className='flex md:flex-row flex-col md:space-x-2 space-x-0 md:items-center items-start'>
            {transaction?.customer_id && customerNames[transaction?.customer_id] ? (
              <p> {customerNames[transaction?.customer_id]}</p>
            ) : (
              <p> Loading...</p>
            )}
            <p className='font-bold md:block hidden'>
              |
            </p>
            <div className='flex md:flex-row flex-col md:items-center items-start space-x-0 md:space-x-2'>
              <p>
                {transaction?.start_date
                  ? new Date(transaction.start_date).toLocaleString()
                  : "N/A"}
              </p>
              <p className='font-bold md:block hidden'>
                |
              </p>
              <p className={`mr-2 p-2 text-white rounded-lg ${transaction.status_payment === 'unpaid' ?
                'bg-red-500' : transaction.status_payment === 'paid' ?
                  'bg-green-500' : 'bg-transparent'
                }`}> {transaction.status_payment}</p>
            </div>
          </div>
          <div className='flex md:flex-row flex-col space-x-0 md:space-x-2'>
            <p> {transaction?.nama_produk}</p>
            <p className='font-bold md:block hidden'>
              -
            </p>
            <p><strong>Laundry Type:</strong> {transaction?.laundry_type}</p>
          </div>
          <p>
            <strong>Estimasi Selesai:</strong>{" "}
            {transaction?.end_date
              ? new Date(transaction.end_date).toLocaleString()
              : "N/A"}
          </p>
          <p><strong>Payment Method:</strong> {transaction?.payment_method?.name || "N/A"}</p>
          <h3 className="text-lg font-medium mb-2">Services</h3>
          <ul className=" list-inside">
            {Array.isArray(transaction?.details) && transaction.details.length > 0 ? (
              transaction.details.map((detail) => (
                <li key={detail.id} className="mb-2">
                  <p><strong>Service Type:</strong> {detail?.service_type?.jenis_pelayanan || "N/A"}</p>
                  <p><strong>Service Price:</strong> Rp.{formatNumber(detail?.service_price?.harga || "N/A")}</p>
                  <p><strong>Quantity:</strong> {detail?.quantity || "N/A"}</p>
                  <div className='py-2 px-4 bg-green-400 rounded-lg mt-3 w-48'>
                    <p className='font-bold text-[20px] text-white'><strong>Total Harga:</strong> Rp.{formatNumber(detail?.price || "N/A")}</p>
                  </div>
                </li>
              ))
            ) : (
              <p>No service details available.</p>
            )}
          </ul>

          <div className="mt-6 flex lg:flex-row flex-col items-center md:space-y-0 space-y-4 w-full md:space-x-4 space-x-0">
            <div className="flex-1 flex flex-col w-full">
              <p><strong>Mark As Paid</strong></p>
              <button
                className={`px-4 py-2 mt-2 rounded w-full ${transaction?.status_payment === "paid" ? "bg-red-500" : "bg-green-500"
                  } text-white`}
                onClick={() => handleUpdatePaymentStatus(transaction.id, transaction.status_payment)}
              >
                {transaction?.status_payment === "unpaid" ? "Mark as Paid" : "Mark as Unpaid"}
              </button>
            </div>
            <div className="flex-1 flex flex-col w-full">
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
            <div className="flex-1 flex flex-col w-full">
              <p><strong>Hapus Transaksi</strong></p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-500 text-white px-4 py-2 rounded mt-2 w-full"
              >
                <span className="flex flex-row items-center justify-center space-x-2">
                  <p>Hapus</p>
                  <IonIcon name="trash"></IonIcon>
                </span>
              </button>
            </div>
            <div className="flex-1 flex flex-col w-full">
              <p><strong>Print Transaksi</strong></p>
              <button
                onClick={() => handleClickPrint(transaction.id)}
                className="bg-gray-300 text-black px-4 py-2 rounded mt-2 w-full"
              >
                <span className="flex flex-row items-center justify-center space-x-2">
                  <p>Cetak Struk</p>
                  <IonIcon name="print"></IonIcon>
                </span>
              </button>
            </div>
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
                  <p>
                    Apakah anda yakin bahwa customer telah membayar?
                    {selectedTransaction?.status_payment === 'paid' ? 'Unpaid' : 'Paid'}?
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
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
          <div className='border-b-2 border-b-gray-400 w-full h-0 my-6' />
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