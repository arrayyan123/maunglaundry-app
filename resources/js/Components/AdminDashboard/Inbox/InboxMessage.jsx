import IonIcon from "@reacticons/ionicons";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "@inertiajs/react";

const InboxMessage = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [activeSection, setActiveSection] = useState("notes");
    const [notifications, setNotifications] = useState([]);
    const [fetchedIds, setFetchedIds] = useState(new Set());
    const [removedIds, setRemovedIds] = useState(new Set());
    const [lastChecked, setLastChecked] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [visibleCount, setVisibleCount] = useState(5);

    const fetchReports = async () => {
        if (isFetching) return;
        setIsFetching(true);

        try {
            const response = await axios.get('/api/admin/new-transactions', {
                params: { lastChecked },
            });

            const newReports = response.data.newTransactions;
            const filteredReports = newReports.filter(
                (report) => !fetchedIds.has(report.transaction_id) && !removedIds.has(report.transaction_id)
            );

            if (filteredReports.length > 0) {
                setNotifications((prev) => [...filteredReports, ...prev]);

                setFetchedIds((prev) => {
                    const updatedIds = new Set(prev);
                    filteredReports.forEach((report) => updatedIds.add(report.transaction_id));
                    return updatedIds;
                });
                setLastChecked(newReports[0]?.start_date);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setIsFetching(false);
        }
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notification) => notification.transaction_id !== id));

        setRemovedIds((prev) => {
            const updatedIds = new Set(prev);
            updatedIds.add(id);
            return updatedIds;
        });
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const loadMoreNotifications = () => {
        setVisibleCount((prev) => prev + 5);
    };

    const filteredNotifications = notifications.filter(
        (notification) => notification.status_job !== 'done' || notification.status_payment !== 'paid'
    );

    const displayedNotifications = filteredNotifications.slice(0, visibleCount);

    useEffect(() => {
        axios
            .get("/api/admin/inbox-notes")
            .then((response) => {
                setMessages(response.data);
            })
            .catch((error) => {
                console.error("Error fetching notes:", error);
            });
    }, []);

    const deleteMessage = async (id) => {
        try {
            await axios.delete(`/api/admin/notes/${id}`);
            setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
            alert("Message deleted successfully");
        } catch (error) {
            console.error("Error deleting message:", error);
            alert("Failed to delete message");
        }
    };
    const deleteSelectedMessages = async () => {
        try {
            await Promise.all(
                selectedMessages.map((id) => axios.delete(`/api/admin/notes/${id}`))
            );
            setMessages((prevMessages) =>
                prevMessages.filter((msg) => !selectedMessages.includes(msg.id))
            );
            setSelectedMessages([]); // Reset pesan yang dipilih
            alert("Selected messages deleted successfully");
        } catch (error) {
            console.error("Error deleting selected messages:", error);
            alert("Failed to delete selected messages");
        }
    };
    const toggleMessageSelection = (id) => {
        setSelectedMessages((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((msgId) => msgId !== id)
                : [...prevSelected, id]
        );
    };
    const toggleSelectAll = () => {
        if (selectedMessages.length === messages.length) {
            setSelectedMessages([]);
        } else {
            setSelectedMessages(messages.map((msg) => msg.id));
        }
    };

    const isAllSelected = selectedMessages.length === messages.length && messages.length > 0;

    const renderMessageDetails = () => {
        if (!selectedMessage) {
            return (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Pilih pesan yang mau di lihat</p>
                </div>
            );
        }

        return (
            <div className="p-4">
                <h1 className="text-xl font-semibold text-gray-700">
                    Nama Produk: {selectedMessage.transaction_nama_produk}
                </h1>
                <p className="text-sm text-gray-500 mb-2">
                    Dari: {selectedMessage.customer_name} ({selectedMessage.customer_email})
                </p>
                <p className="text-gray-700 mb-4">
                    Note created at: {selectedMessage.created_at}
                </p>
                <h2 className="text-sm text-gray-700">
                    {selectedMessage.content}
                </h2>
            </div>
        );
    };

    return (
        <div className="flex flex-row lg:h-full h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`${isSidebarExpanded ? "w-64" : "w-16"
                    } bg-blue-400 text-white flex flex-col transition-all duration-300`}
            >
                <div
                    className={`p-4 border-b border-blue-700 flex items-center justify-between ${isSidebarExpanded ? "space-x-8" : "space-x-1"
                        }`}
                >
                    <span
                        className={`${isSidebarExpanded ? "block" : "hidden"
                            } font-semibold text-lg`}
                    >
                        Inbox
                    </span>
                    <button
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                        className="text-white flex items-center mx-auto"
                    >
                        <IonIcon name={isSidebarExpanded ? "arrow-down-circle-outline" : "menu-outline"} className={`text-2xl transform transition-transform duration-500 ${isSidebarExpanded ? "rotate-90" : "rotate-0"
                            }`} />
                    </button>
                </div>
                <nav className="flex-1 p-2">
                    <ul className="space-y-2">
                        <li
                            onClick={() => setActiveSection("notes")}
                            className={`py-2 px-4 rounded cursor-pointer flex items-center gap-4 ${activeSection === "notes" ? "bg-blue-700" : "hover:bg-blue-700"
                                }`}
                        >
                            <IonIcon name="mail-outline" className="text-[20px] text-white" />
                            <span
                                className={`${isSidebarExpanded ? "block" : "hidden"
                                    } text-sm`}
                            >
                                Message
                            </span>
                        </li>
                        <li
                            onClick={() => setActiveSection("notifications")}
                            className={`py-2 px-4 rounded cursor-pointer flex items-center gap-4 ${activeSection === "notifications" ? "bg-blue-700" : "hover:bg-blue-700"
                                }`}
                        >
                            <IonIcon name="notifications-outline" className="text-[20px] text-white" />
                            <span
                                className={`${isSidebarExpanded ? "block" : "hidden"
                                    } text-sm`}
                            >
                                Notification
                            </span>
                        </li>
                    </ul>
                </nav>
                {/* <div
                    className={`${isSidebarExpanded ? "p-4" : "p-2"
                        } border-t border-blue-700`}
                >
                    <Link href={route('logout')} method="post"><button className="w-full bg-blue-700 py-2 rounded text-white hover:bg-blue-600 text-sm">
                        {isSidebarExpanded ? "Logout" : <IonIcon name="log-out-outline" />}
                    </button></Link>
                </div> */}
            </aside>
            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {activeSection === "notes" && (
                    <section id="notes" className="flex-1 flex flex-col">
                        {/* Header */}
                        <header className="flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow">
                            <h1 className="text-lg font-semibold text-gray-700 mb-2 md:mb-0">
                                Inbox
                            </h1>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={toggleSelectAll}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    {isAllSelected ? "Deselect All" : "Select All"}
                                </button>

                                <button
                                    onClick={deleteSelectedMessages}
                                    className={`px-4 py-2 bg-red-500 text-white flex items-center rounded-md ${selectedMessages.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                    disabled={selectedMessages.length === 0}
                                >
                                    <IonIcon className="text-[20px]" name="trash-outline"></IonIcon>
                                </button>
                            </div>
                        </header>
                        {/* Body */}
                        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
                            {/* Message List */}
                            <section className="w-full md:w-1/3 border-r bg-white overflow-y-auto max-h-[75vh]">
                                <div>
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`p-4 border-b cursor-pointer ${selectedMessage?.id === message.id
                                                ? "bg-blue-50"
                                                : "hover:bg-gray-100"
                                                }`}
                                        >
                                            <div className="flex items-center overflow-hidden">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMessages.includes(message.id)}
                                                    onChange={() => toggleMessageSelection(message.id)}
                                                    className="mr-2"
                                                />
                                                <div
                                                    onClick={() => setSelectedMessage(message)}
                                                    className="flex justify-between items-center w-full"
                                                >
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-gray-700">
                                                            {message.customer_name}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {message.content}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {message.created_at}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Message Details */}
                            <section className="flex-1 bg-gray-50 flex-shrink-0">
                                {renderMessageDetails()}
                            </section>
                        </div>
                    </section>
                )}

                {activeSection === "notifications" && (
                    <section id="notifications" className="flex-1 flex flex-col">
                        {/* Header */}
                        <header className="flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow">
                            <h1 className="text-lg font-semibold text-gray-700 mb-2 md:mb-0">
                                Notification
                            </h1>
                            {/* <input
                                type="text"
                                placeholder="Search notifications..."
                                className="px-4 py-2 w-full md:w-1/3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            /> */}
                        </header>
                        {/* Body */}
                        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
                            <section className="w-full border-r bg-white overflow-y-auto">
                                <div>
                                    {displayedNotifications.length > 0 ? (
                                        <>
                                            {displayedNotifications.map((notification) => (
                                                <div
                                                    key={notification.transaction_id}
                                                    className="border-b border-gray-200 p-4 mb-2 flex justify-between items-center"
                                                >
                                                    <div>
                                                        <p className="text-lg text-gray-600">
                                                            <strong>{notification.nama_produk}</strong>
                                                        </p>
                                                        <p className="text-[15px] text-gray-600">
                                                            {notification.customer_name} - {notification.start_date} - {notification.status_job} - {notification.status_payment}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeNotification(notification.transaction_id)}
                                                        className="text-red-500 text-sm"
                                                    >
                                                        <span className="flex flex-row items-center space-x-3"> 
                                                            <IonIcon name='trash'></IonIcon>
                                                            <p>Remove</p>
                                                        </span>
                                                    </button>
                                                </div>
                                            ))}
                                            {filteredNotifications.length > visibleCount && (
                                                <button
                                                    onClick={loadMoreNotifications}
                                                    className="text-blue-500 text-xs mt-2"
                                                >
                                                    See More
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-xl mx-4 text-gray-500">Tidak ada notifikasi baru.</p>
                                    )}
                                </div>
                            </section>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default InboxMessage;