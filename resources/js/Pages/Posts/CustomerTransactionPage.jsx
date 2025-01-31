import React, { useState, useEffect } from "react";
import CustomerDashboardLayout from "@/Layouts/CustomerDashboardLayout";
import EntryTransaction from "@/Components/CustomerDashboard/EntryTransaction";
import NotificationTwilio from "@/Components/CustomerDashboard/NotificationTwilio";
import TransactionDetail from "@/Components/CustomerDashboard/TransactionDetail";
import axios from "axios";
import { Tooltip } from "flowbite-react";
import IonIcon from "@reacticons/ionicons";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'

import TransferCard from "@/Components/CustomerDashboard/Payment/TransferCard";
import EwalletCard from "@/Components/CustomerDashboard/Payment/EwalletCard";
import CashCard from "@/Components/CustomerDashboard/Payment/CashCard";
import { Fade } from "react-awesome-reveal";
import { Head } from "@inertiajs/react";

function CustomerTransactionPage() {
  const [currentTab, setCurrentTab] = useState("addtransaction");
  const [customerData, setCustomerData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const [filterProductName, setFilterProductName] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [filterStatusJob, setFilterStatusJob] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentComponent, setSelectedPaymentComponent] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    if (selectedTransaction) {
      setIsOpen((prevState) => !prevState);
    }
  };

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer-data");
    if (storedCustomer) {
      const customer = JSON.parse(storedCustomer);
      setCustomerData(customer);
      fetchTransactions(customer.id);
    }
  }, []);

  const fetchTransactions = async (customerId) => {
    try {
      const response = await axios.get(`/api/admin/transactions/${customerId}`);
      setTransactions(response.data.transaction);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    return (
      (filterProductName ? transaction.nama_produk
        .toLowerCase()
        .includes(filterProductName.toLowerCase()) : true) &&
      (filterPaymentStatus ? transaction.status_payment === filterPaymentStatus : true) &&
      (filterStatusJob ? transaction.status_job === filterStatusJob : true) &&
      (filterStartDate ? new Date(transaction.start_date) >= new Date(filterStartDate) : true) &&
      (filterEndDate ? new Date(transaction.end_date) <= new Date(filterEndDate) : true)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCancelRequest = async (transactionId) => {
    try {
      await axios.put(`/api/admin/transactions/${transactionId}/update-job-status`, {
        status_job: "cancel",
      });
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === transactionId
            ? { ...transaction, status_job: "cancel" }
            : transaction
        )
      );
      setShowCancelModal(false);
    } catch (error) {
      console.error("Failed to cancel transaction:", error);
    }
  };

  const paymentComponentMapping = {
    Transfer: TransferCard,
    "E-Wallet": EwalletCard,
    Cash: CashCard,
  };

  const handleShowPaymentModal = (transaction) => {
    if (transaction?.payment_method?.name) {
      const SelectedComponent = paymentComponentMapping[transaction.payment_method.name];
      if (SelectedComponent) {
        setSelectedPaymentComponent(() => SelectedComponent);
        setShowPaymentModal(true);
      }
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <CustomerDashboardLayout
      header={
        <div className="start-instruksi">
          <h2 className="text-xl font-semibold leading-tight text-white">
            Transaction Manage
          </h2>
        </div>
      }
    >
      <Head title="Transaction page" />
      <div className="md:p-4 p-2">
        <h1 className="text-[20px] font-bold my-3 text-center text-black">
          Transaction Manage
        </h1>
        <div className="flex border-b border-gray-200">
          {[
            { label: "Add Transaction", value: "addtransaction" },
            { label: "Transaction Detail", value: "transactiondetail" },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => {
                setCurrentTab(value);
                if (value === "transactiondetail") setSelectedTransactionId(null);
              }}
              className={`py-2 px-4 text-sm font-medium ${currentTab === value
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-blue-500"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-4">
          {currentTab === "addtransaction" && (
            <div className="motion motion-preset-slide-up-sm">
              <h1 className="mb-4 text-lg font-bold text-black">Tambah Transaksi</h1>
              {customerData && (
                <EntryTransaction customerId={customerData.id} transactions={transactions} />
              )}
            </div>
          )}
          {currentTab === "transactiondetail" && (
            <div className="">
              <h1 className="mb-4 text-lg font-bold text-black">Detail Transaksi</h1>
              <div className="flex flex-row gap-4 items-center">
                <button
                  className="px-4 py-2 mb-4 text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg"
                  onClick={() => setShowNotification(!showNotification)}
                >
                  Nyalakan Notifikasi
                </button>
                <Tooltip content="untuk memperbarui daftar transaksi">
                  <button onClick={refreshPage} className="px-4 py-2 mb-4 text-white bg-blue-500 hover:bg-blue-600 rounded-lg">
                    Refresh Page
                  </button>
                </Tooltip>
              </div>
              {showNotification && (
                <NotificationTwilio
                  handleToggleNotificationTwilio={() => setShowNotification(false)}
                />
              )}
              <div>
                <div className="flex flex-col text-black lg:space-y-0 space-y-4 p-3 xl:flex-row lg:space-x-4">
                  <Tooltip content={
                    <div className="p-4">
                      <h1>Warna Status</h1>
                      <ul className="list-disc">
                        <li>status job: cancel - <strong className="text-red-500">merah</strong></li>
                        <li>status job: ongoing - <strong className="text-blue-500">biru</strong></li>
                        <li>status job: pending - <strong className="text-yellow-500">kuning</strong></li>
                        <li>status job: done - <strong className="text-green-500">hijau</strong></li>
                      </ul>
                    </div>
                  }>
                    <div className="flex flex-row gap-1">
                      <p>Hint:</p>
                      <IonIcon className="text-black animate-bounce text-[20px]" name="alert-circle" />
                    </div>
                  </Tooltip>
                  <div className="flex flex-col">
                    <label htmlFor="">Penelusuri</label>
                    <input
                      type="text"
                      placeholder="Search by Product Name"
                      className="border px-4 py-2 rounded-md focus:outline-none focus:ring"
                      value={filterProductName}
                      onChange={(e) => setFilterProductName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="">Status Pembayaran</label>
                    <select
                      className="border px-4 py-2 rounded-md focus:outline-none focus:ring"
                      value={filterPaymentStatus}
                      onChange={(e) => setFilterPaymentStatus(e.target.value)}
                    >
                      <option value="">All Payment Status</option>
                      <option value="paid">Paid</option>
                      <option value="partial">Partial</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="">Status Job</label>
                    <select
                      className="border px-4 py-2 rounded-md focus:outline-none focus:ring"
                      value={filterStatusJob}
                      onChange={(e) => setFilterStatusJob(e.target.value)}
                    >
                      <option value="">All Status Job</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="pending">Pending</option>
                      <option value="cancel">Canceled</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  {/* Date Range Inputs */}
                  <div className="flex flex-col">
                    <label htmlFor="start date">Tanggal Mulai</label>
                    <input
                      type="date"
                      className="border px-4 py-2 rounded-md focus:outline-none focus:ring"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="end date">Tanggal Selesai</label>
                    <input
                      type="date"
                      className="border px-4 py-2 rounded-md focus:outline-none focus:ring"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {loading ? (
                <p>Loading transactions...</p>
              ) : (
                paginatedTransactions.map((transaction) => (

                  <div
                    onClick={toggleDrawer}
                    key={transaction.id}
                    className="my-2"
                  >
                    {/* berfungsi untuk mentrigger drawer nya */}
                    <button
                      onClick={() => setSelectedTransaction(transaction)}
                      className={`${transaction.status_job === 'cancel'
                        ? 'bg-red-500'
                        : transaction.status_job === 'pending'
                          ? 'bg-yellow-500'
                          : transaction.status_job === 'ongoing'
                            ? 'bg-blue-500'
                            : transaction.status_job === 'done'
                              ? 'bg-green-500'
                              : 'bg-gray-500'
                        } text-white w-full px-3 py-2 rounded-xl`}
                    >
                      <div className="relative text-white hover:font-bold cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-white before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-white after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]">
                        <span className="flex sm:flex-row flex-col items-center sm:space-x-5 space-x-0 justify-between">
                          <p>
                            View Transaction {transaction.nama_produk} status (
                            {transaction.status_payment})
                          </p>
                          <p>Status Job: {transaction.status_job}</p>
                          <p>Tanggal Mulai: {transaction.start_date}</p>
                          <p>Tanggal Selesai: {transaction.end_date}</p>
                        </span>
                      </div>
                    </button>
                  </div>
                ))
              )}

              {/* membuka transaction detail */}
              <Drawer
                open={isOpen}
                onClose={toggleDrawer}
                direction="left"
                className="p-4 bg-white"
                size={322}
              >
                {selectedTransaction && (
                  <TransactionDetail
                    customerId={customerData?.id}
                    transactionId={selectedTransaction.id}
                    onCancel={() => {
                      setIsOpen(false);
                      setShowCancelModal(true)
                    }}
                    onPayment={() => {
                      setIsOpen(false);
                      handleShowPaymentModal(selectedTransaction)
                    }}
                    onClose={() => {
                      setIsOpen(false);
                      setSelectedTransactionId(null);
                    }}
                  />
                )}
              </Drawer>

              {showCancelModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <Fade>
                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                      <p className="text-lg">
                        Apakah Anda yakin ingin membatalkan transaksi ini?
                      </p>
                      <p>
                        <strong>Nama Produk:</strong>{" "}
                        {selectedTransaction?.nama_produk}
                      </p>
                      <div className="mt-4 flex justify-end space-x-4">
                        <button
                          onClick={() => handleCancelRequest(selectedTransaction?.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Yes, Batalkan
                        </button>
                        <button
                          onClick={() => setShowCancelModal(false)}
                          className="bg-gray-300 text-black px-4 py-2 rounded"
                        >
                          No, Kembali
                        </button>
                      </div>
                    </div>
                  </Fade>
                </div>
              )}

              {showPaymentModal && selectedPaymentComponent && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      setShowPaymentModal(false);
                    }
                  }}
                >
                  <div className="bg-white p-6 rounded-md shadow-md mx-7">
                    <button
                      className="text-[30px] hover:font-bold text-black"
                      onClick={() => setShowPaymentModal(false)}
                    >
                      ✕
                    </button>
                    {React.createElement(selectedPaymentComponent)}
                  </div>
                </div>
              )}

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm font-medium border rounded-lg ${currentPage === 1
                    ? "cursor-not-allowed bg-gray-200 text-gray-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                  Prev
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 text-sm font-medium border rounded-lg ${currentPage === totalPages
                    ? "cursor-not-allowed bg-gray-200 text-gray-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}

export default CustomerTransactionPage;