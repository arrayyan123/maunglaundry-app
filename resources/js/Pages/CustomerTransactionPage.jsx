import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import React, { useState, useRef, useEffect } from "react";
import AddCustomer from "@/Components/AdminDashboard/AddCustomer";
import Request_Table from "@/Components/AdminDashboard/Request_Table";
import EntryTransaction from "@/Components/AdminDashboard/EntryTransaction";
import TransactionDetail from "@/Components/AdminDashboard/TransactionDetail";
import { Breadcrumbs } from "@material-tailwind/react";

function CustomerTransactionPage({ auth, customers: initialCustomers }) {
    const [customers, setCustomers] = useState(initialCustomers);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [currentTab, setCurrentTab] = useState("customer");
    const [addCustomerOpen, setAddCustomerOpen] = useState(false);
    const [listCustomerOpen, setListCustomerOpen] = useState(false);
    const { props } = usePage();

    useEffect(() => {
        if (props.openListCustomer) {
            setListCustomerOpen(true);
        }
    }, [props.openListCustomer]);

    const handleAddTransaction = (customer) => {
        setSelectedCustomer(customer);
        setSelectedTransactionId(null);
        setCurrentTab("transaction");
    };

    const handleViewDetails = (transactionId, customer) => {
        setSelectedTransactionId(transactionId);
        setSelectedCustomer(customer);
        setCurrentTab("transaction");
    };

    const handleCloseTransactionDetail = () => {
        setCurrentTab("customer");
        setSelectedTransactionId(null);
        setSelectedCustomer(null);
    };

    const handleSaveTransaction = () => {
        setCurrentTab("customer");
        setSelectedCustomer(null);
    };

    const handleDeleteCustomer = async (customerId) => {
        try {
            await axios.delete(`/api/admin/customer/${customerId}`);
            const updatedCustomers = customers.filter(customer => customer.id !== customerId);
            setCustomers(updatedCustomers);
            alert("Customer deleted successfully!");
        } catch (error) {
            console.error("Error deleting customer:", error);
            alert("Failed to delete customer. Please try again.");
        }
    };

    useEffect(() => {
        console.log("Tab changed to:", currentTab);
    }, [currentTab]);


    const tabs = [
        { label: "Customer", value: "customer" },
        { label: "Transaction", value: "transaction" },
    ];

    const handleOpenAddCustomer = () => {
        setAddCustomerOpen(!addCustomerOpen)
        setListCustomerOpen(false)
    }

    const handleOpenListCustomer = () => {
        setListCustomerOpen(!listCustomerOpen)
        setAddCustomerOpen(false)
    }

    // useEffect(() => {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     if (urlParams.get("listCustomer") === "true") {
    //         setListCustomerOpen(true);
    //     }
    // }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="start-instruksi">
                    <h2 className="text-xl font-semibold leading-tight text-white">
                        Customer & Transaction
                    </h2>
                </div>
            }
        >
            <Head title="Customer & Transaction" />
            <Breadcrumbs>
                <Link href={route('dashboard')} className="opacity-60">
                    Dashboard
                </Link>
                <Link href={route('customer-transaction')} className="opacity-60">
                    Customer & Transaction
                </Link>
            </Breadcrumbs>
            <div className="md:p-4 p-2">
                <h1 className="text-[20px] font-bold my-3 text-center text-black">Customer & Transaction Manage</h1>
                {/* Tabs Header */}
                <div className="flex border-b border-gray-200">
                    {tabs.map(({ label, value }) => (
                        <button
                            key={value}
                            onClick={() => {
                                if (value === "customer") {
                                    setSelectedTransactionId(null);
                                    setSelectedCustomer(null);
                                }
                                setCurrentTab(value);
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
                {/* Tabs Body */}
                <div className="mt-4">
                    {/* Customer Tab */}
                    {currentTab === "customer" && (
                        <div>
                            <div className="flex flex-row gap-4 items-center">
                                <button
                                    onClick={handleOpenAddCustomer}
                                    className="bg-purple-600 py-2 px-3 rounded-xl text-white"
                                >
                                    Add Customer
                                </button>
                                <button
                                    onClick={handleOpenListCustomer}
                                    className="bg-blue-600 py-2 px-3 rounded-xl text-white"
                                >
                                    See Customers
                                </button>
                            </div>

                            {!addCustomerOpen && !listCustomerOpen && (
                                <div className="mt-6 h-full w-auto text-black motion motion-preset-slide-right">
                                    <h1 className="text-[20px] font-bold">Pilih Salah Satu</h1>
                                    <ul className="list-disc ml-4">
                                        <li>Add Customer: Menambahkan Pelanggan Baru.</li>
                                        <li>See Customer: Berisikan list pelanggan serta "action" untuk melakukan penambahan transaksi dan melihat detail pelanggan</li>
                                    </ul>
                                </div>
                            )}

                            {addCustomerOpen &&
                                <div className="my-4">
                                    <AddCustomer
                                        onCustomerAdded={(newCustomer) =>
                                            setCustomers((prev) => [...prev, newCustomer])
                                        }
                                    />
                                </div>
                            }
                            {listCustomerOpen &&
                                <Request_Table
                                    customers={customers}
                                    onSelectCustomer={handleAddTransaction}
                                    onViewDetails={(transactionId, customer) =>
                                        handleViewDetails(transactionId, customer)
                                    }
                                    onDeleteCustomer={handleDeleteCustomer}
                                />
                            }
                        </div>
                    )}
                    {/* Transaction Tab */}
                    {currentTab === "transaction" && (
                        <div>
                            {selectedTransactionId ? (
                                <TransactionDetail
                                    transactionId={selectedTransactionId}
                                    customerId={selectedCustomer?.id}
                                    onClose={handleCloseTransactionDetail}
                                />
                            ) : selectedCustomer ? (
                                <EntryTransaction
                                    customerId={selectedCustomer.id}
                                    onSave={() => alert('Transaction saved!')}
                                    onNavigateToPayment={() => navigate('/admin/payment-detail')}
                                />
                            ) : (
                                <p className="text-center text-gray-500">
                                    No customer or transaction selected.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default CustomerTransactionPage;