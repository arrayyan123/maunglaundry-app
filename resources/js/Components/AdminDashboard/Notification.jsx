import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown } from "flowbite-react";
import IonIcon from '@reacticons/ionicons';

function Notification() {
    const [notifications, setNotifications] = useState([]); // Notifikasi yang ditampilkan
    const [fetchedIds, setFetchedIds] = useState(new Set()); // ID transaksi yang sudah diambil
    const [removedIds, setRemovedIds] = useState(new Set()); // ID transaksi yang sudah dihapus
    const [lastChecked, setLastChecked] = useState(null); 
    const [isFetching, setIsFetching] = useState(false); 

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
                setNotifications((prev) => {
                    const updatedNotifications = [...filteredReports, ...prev].slice(0, 5);
                    return updatedNotifications;
                });

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

    // Panggil fetchReports saat komponen pertama kali dimuat
    useEffect(() => {
        fetchReports();
    }, []);
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         fetchReports();
    //     }, 5000);
    //     return () => clearInterval(interval);
    // }, []);

    const filteredNotifications = notifications.filter(notification => notification.status_job !== 'done');

    return (
        <div>
            <Dropdown
                label=""
                dismissOnClick={false}
                renderTrigger={() => (
                    <span className="text-white font-bold text-lg">
                        <IonIcon name="notifications-outline" />
                        {filteredNotifications.length > 0 && (
                            <span className="ml-1 text-xs text-red-500">
                                ({filteredNotifications.length})
                            </span>
                        )}
                    </span>
                )}
            >
                <div className="w-56 p-4 bg-white rounded-lg shadow-md">
                    <h1 className="text-sm font-bold">Notifications</h1>
                    {notifications.length > 0 ? (
                        notifications
                            .filter(notification => notification.status_job !== 'done')
                            .map((notification) => (
                                <div
                                    key={notification.transaction_id}
                                    className="border-b border-gray-200 pb-2 mb-2 flex justify-between items-center"
                                >
                                    <p className="text-xs text-gray-600">
                                        <strong>{notification.nama_produk}</strong> - {notification.customer_name} - {notification.start_date} - {notification.status_job}
                                    </p>
                                    <button
                                        onClick={() => removeNotification(notification.transaction_id)}
                                        className="text-red-500 text-xs"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                    ) : (
                        <p className="text-xs text-gray-500">No new notifications.</p>
                    )}
                </div>
            </Dropdown>
        </div>
    );
}

export default Notification;