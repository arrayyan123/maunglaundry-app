import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Fade, Zoom } from 'react-reveal';
import IonIcon from '@reacticons/ionicons';
import EditTransactionModal from './EditTransactionModal';
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'

function TransactionDetail({ customerId, transactionId, onClose }) {
  const [transactions, setTransactions] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [countdown, setCountdown] = useState(5);
  const [customerNames, setCustomerNames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState(2);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [downPayments, setDownPayments] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [enableSelect, setEnableSelect] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

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

        const transactionIds = Array.isArray(transactionsData)
          ? transactionsData.map(transaction => transaction.id)
          : [transactionsData.id];

        const partialTransactionIds = transactionIds.filter(id =>
          transactionsData.find(transaction => transaction.id === id).status_payment === "partial"
        );
        for (const id of partialTransactionIds) {
          await fetchDownPayment(id);
        }

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

  const openPrintModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowReceiptModal(true);
  };

  const openDeleteModal = (transaction) => {
    if (showDeleteModal) return;
    setSelectedTransaction(transaction);
    setShowDeleteModal(true);
  };

  const openEditModal = (transaction) => {
    if (showEditModal) return;
    setSelectedTransaction(transaction);
    setShowEditModal(true);
  };

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

  const refreshTransactionDetails = async () => {
    try {
      setLoading(true);
      const endpoint = transactionId
        ? `/api/admin/transactions/${transactionId}`
        : `/api/customer/${customerId}`;

      const response = await axios.get(endpoint);
      const transactionsData = response.data.transaction || response.data.transactions;

      setTransactions(transactionsData);
      setFilteredTransactions(transactionsData);

      const transactionIds = Array.isArray(transactionsData)
        ? transactionsData.map((transaction) => transaction.id)
        : [transactionsData.id];

      const partialTransactionIds = transactionIds.filter((id) =>
        transactionsData.find((transaction) => transaction.id === id).status_payment === "partial"
      );

      for (const id of partialTransactionIds) {
        await fetchDownPayment(id);
      }

      if (transactionsData.length > 0) {
        const uniqueCustomerIds = [...new Set(transactionsData.map((t) => t.customer_id))];

        const customerData = await Promise.all(
          uniqueCustomerIds.map(async (idCustomer) => {
            const customerResponse = await axios.get(`/api/customer/${idCustomer}`);
            return { id: idCustomer, name: customerResponse.data.name };
          })
        );

        const customerNamesObject = customerData.reduce((acc, { id, name }) => {
          acc[id] = name;
          return acc;
        }, {});
        setCustomerNames(customerNamesObject);
      }
    } catch (error) {
      console.error("Failed to refresh transaction details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      const endpoint = transactionId
        ? `/api/admin/transactions/${transactionId}`
        : `/api/customer/${customerId}`;

      const response = await axios.get(endpoint, {
        params: {
          start_date: startDate || undefined,
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

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleUpdatePaymentStatus = (transactionId, newStatus) => {
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
    const filtered = Array.isArray(transactions) ? transactions.filter((transaction) => {
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
    }) : [];

    setFilteredTransactions(filtered);

    if (searchQuery !== '') {
      setCurrentPage(1);
    }
  }, [searchQuery, paymentFilter, transactions]);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = showAll
    ? filteredTransactions
    : filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction
    );

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
    if (showAll) {
      setCurrentPage(1);
    }
  };

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
      window.open(`/api/admin/transactions/${selectedTransaction.id}/receipt`, "_blank");
      setShowReceiptModal(false);
    }
  };

  const handleSelectTransaction = (id) => {
    setSelectedTransactions((prev) =>
      prev.includes(id)
        ? prev.filter((transactionId) => transactionId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setEnableSelect(false);
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions.map((transaction) => transaction.id));
      setEnableSelect(true);
    }
  }

  const isAllSelected = selectedTransactions.length === transactions.length && transactions.length > 0;

  const handlePrintSelected = () => {
    if (selectedTransactions.length === 0) {
      alert("Mohon pilih setidaknya satu transaksi.");
      return;
    }
    const queryString = selectedTransactions.map((id) => `ids[]=${id}`).join("&");
    window.open(`/admin/transactions/receipt-multiple?${queryString}`, "_blank");
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowEditModal(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const openDrawerWithTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsOpen(true);
  };

  if (loading) {
    return <div className="flex gap-4 items-center justify-center h-screen text-gray-700"><div class="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />Loading...</div>;
  }

  if (transactions.length === 0) {
    return <div className="flex items-center justify-center h-screen text-gray-500">No transactions found.</div>;
  }

  return (
    <div className="max-w-full mx-auto p-4 mb-5 bg-white shadow-md rounded-lg">
      <div className="flex md:flex-row flex-col items-center gap-3 justify-end mb-4">
        <button
          onClick={toggleShowAll}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {showAll ? "Show Paginated" : "Show All"}
        </button>
        <button
          onClick={toggleSelectAll}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {isAllSelected ? "Deselect All" : "Select All"}
        </button>
        <button
          onClick={handlePrintSelected}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Print Selected
        </button>
      </div>
      <div className="flex w-full md:flex-row flex-col md:space-y-0 space-y-3 space-x-0 md:space-x-4 mb-6">
        <div className='w-full text-black'>
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
        <div className='w-full text-black'>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className='w-full text-black'>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className='w-full text-black'>
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
            <option value="partial">Partial</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
        <div className="w-full text-black">
          <label className="block text-sm font-medium text-gray-700">Transaksi Per Halaman</label>
          <input
            type="number"
            min="1"
            className="w-full p-2 border border-gray-300 rounded"
            value={transactionsPerPage}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setTransactionsPerPage(value > 0 ? value : 1);
              setCurrentPage(1);
            }}
          />
        </div>
        <button
          onClick={handleFilter}
          className="self-end px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          <IonIcon name='filter'></IonIcon>
        </button>
      </div>
      {currentTransactions.map(transaction => (
        <div
          key={transaction.id}
          className='border border-gray-300 w-full cursor-pointer rounded-lg p-4 mb-6 bg-gray-50 hover:bg-gray-100'
          onClick={() => openDrawerWithTransaction(transaction)}
        >
          <div onClick={toggleDrawer}>
            {enableSelect && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedTransactions.includes(transaction.id)}
                  onChange={() => handleSelectTransaction(transaction.id)}
                  className="mr-4"
                />
                <h3 className="text-lg font-bold text-gray-800">Transaction: {transaction.id}</h3>
              </div>
            )}
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
            <div className='flex items-center justify-between'>
              <h3 className="text-lg font-bold text-gray-800">Transaction Details</h3>
              <button
                onClick={onClose}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
            <div className='text-black'>
              <h1 className='text-[22px] font-bold'>{transaction.nama_produk}</h1>
              <h1>{transaction.laundry_type}</h1>
              {Array.isArray(transaction?.details) && transaction.details.length > 0 ? (
                transaction.details.map((detail) => (
                  <div className='py-2 px-3 flex items-start bg-green-400 w-48 rounded-lg mt-3'>
                    <p className='font-bold text-[16px] text-white'><strong>Total Harga:</strong> Rp.{formatNumber(detail?.price || "N/A")}</p>
                  </div>
                ))
              ) : (
                <p>No service details available.</p>
              )}
            </div>
          </div>
        </div>
      ))}
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction='left'
        className="p-4 bg-white" size={322}
      >
        {selectedTransaction ? (
          <>
            <div className='flex flex-col items-start'>
              <div onClick={toggleDrawer} className=''>
                <h1 className='text-[20px] cursor-pointer'>X</h1>
              </div>
              {selectedTransaction?.customer_id && customerNames[selectedTransaction?.customer_id] ? (
                <p className='text-black font-bold'> {customerNames[selectedTransaction?.customer_id]}</p>
              ) : (
                <p> Loading...</p>
              )}
              <div className='flex flex-col items-start gap-2 my-3'>
                <p className='text-black'>
                  {selectedTransaction?.start_date
                    ? new Intl.DateTimeFormat('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    }).format(new Date(selectedTransaction.start_date))
                    : "N/A"}
                </p>
                <div className='flex flex-row gap-2'>
                  <span
                    className={`p-2 rounded-lg ${selectedTransaction.status_payment === 'paid' ? 'bg-green-500 text-white' :
                      selectedTransaction.status_payment === 'partial' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                      }`}
                  >
                    {selectedTransaction.status_payment}
                  </span>
                  <span className={` p-2 text-white rounded-lg 
                    ${selectedTransaction.status_job === 'cancel'
                      ? 'bg-red-500'
                      : selectedTransaction.status_job === 'pending'
                        ? 'bg-yellow-500'
                        : selectedTransaction.status_job === 'ongoing'
                          ? 'bg-blue-500'
                          : selectedTransaction.status_job === 'done'
                            ? 'bg-green-500'
                            : 'bg-gray-500'
                    }`}
                  >
                    <p>{selectedTransaction.status_job}</p>
                  </span>
                </div>
              </div>
            </div>
            <div className='flex flex-col '>
              <h1 className='text-black text-[20px] font-bold'> {selectedTransaction?.nama_produk}</h1>
              <p className='text-black'><strong>Tipe Laundry: </strong> {selectedTransaction?.laundry_type}</p>
            </div>
            <p className='text-black'>
              <strong>Estimasi Selesai:</strong>{" "}
              {selectedTransaction?.end_date
                ? new Intl.DateTimeFormat('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                }).format(new Date(selectedTransaction.end_date))
                : "N/A"}
            </p>
            <p className='text-black'><strong>Metode Pembayaran</strong> {selectedTransaction?.payment_method?.name || "N/A"}</p>
            <h3 className="text-lg text-black font-medium mb-2">Services</h3>
            <ul className=" list-inside">
              {Array.isArray(selectedTransaction?.details) && selectedTransaction.details.length > 0 ? (
                selectedTransaction.details.map((detail) => (
                  <li key={detail.id} className="mb-2">
                    <p className='text-black'><strong>Tipe Service: </strong> {detail?.service_type?.jenis_pelayanan || "N/A"}</p>
                    <p className='text-black'><strong>Harga Service: </strong> Rp.{formatNumber(detail?.service_price?.harga || "N/A")}</p>
                    <p className='text-black'><strong>Kuantitas:</strong> {detail?.quantity || "N/A"}</p>
                  </li>
                ))
              ) : (
                <p>No service details available.</p>
              )}
            </ul>
            {Array.isArray(selectedTransaction?.details) && selectedTransaction.details.length > 0 ? (
              selectedTransaction.details.map((detail) => (
                <div className='py-2 px-3 flex items-center bg-green-400 rounded-lg mt-3'>
                  <p className='font-bold text-[16px] text-white text-center'><strong>Total Harga:</strong> Rp.{formatNumber(detail?.price || "N/A")}</p>
                </div>
              ))
            ) : (
              <p>No service details available.</p>
            )}
            {selectedTransaction.status_payment === 'partial' && downPayments[selectedTransaction.id] && (
              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-800">Down Payment</h3>
                <p className='text-black'>DP: Rp.{formatNumber(downPayments[selectedTransaction.id].dp)}</p>
                <p className='text-black'>Sisa: Rp.{formatNumber(downPayments[selectedTransaction.id].remaining)}</p>
                <p className='text-black'>
                  Tanggal Dp: {new Intl.DateTimeFormat('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  }).format(new Date(downPayments[selectedTransaction.id].created_at))}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col items-center space-y-2 w-full">
              <div className="flex-1 flex flex-col w-full">
                <button
                  onClick={() => {
                    toggleDrawer()
                    openEditModal(selectedTransaction)
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
                >
                  Edit
                </button>
              </div>
              <div className="flex-1 flex flex-col w-full">
                <button
                  onClick={() => {
                    toggleDrawer()
                    openDeleteModal(selectedTransaction)
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded mt-2 w-full"
                >
                  <span className="flex flex-row items-center justify-center space-x-2">
                    <p>Hapus</p>
                    <IonIcon name="trash"></IonIcon>
                  </span>
                </button>
              </div>
              <div className="flex-1 flex flex-col w-full">
                <button
                  onClick={() => {
                    toggleDrawer()
                    openPrintModal(selectedTransaction)
                  }}
                  className="bg-gray-300 text-black px-4 py-2 rounded mt-2 w-full"
                >
                  <span className="flex flex-row items-center justify-center space-x-2">
                    <p>Cetak Struk</p>
                    <IonIcon name="print"></IonIcon>
                  </span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <p>Loading transaction details...</p>
        )}
      </Drawer>
      {showDeleteModal && selectedTransaction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Fade>
            <div className="bg-white p-6 text-black rounded shadow-lg max-w-md w-full">
              <p className="text-md">Are you sure you want to delete this {selectedTransaction.id} transaction?</p>
              <div className='my-3'>
                <p>Rincian Transaksi sebagai berikut: </p>
                <ul className='list-disc'>
                  <li>Produk: {selectedTransaction.nama_produk}</li>
                  <li>Tipe Laundry: {selectedTransaction.laundry_type}</li>
                </ul>
              </div>
              <div className="mt-4 flex justify-end space-x-4">
                <button onClick={() => handleDeleteTransaction(selectedTransaction.id)} className="bg-red-500 text-white px-4 py-2 rounded">
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
      {/* {showConfirmModal && (
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
          )} */}
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
      {showEditModal && selectedTransaction && (
        <EditTransactionModal
          transactionId={selectedTransaction.id}
          onClose={() => setShowEditModal(false)}
          onUpdate={refreshTransactionDetails}
        />
      )}
      {showReceiptModal && selectedTransaction && (
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
      {!showAll && (
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
      )}
    </div>

  );
}
export default TransactionDetail;