import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown } from "flowbite-react";
import IonIcon from '@reacticons/ionicons';

function Notification() {
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
                    {displayedNotifications.length > 0 ? (
                        <>
                            {displayedNotifications.map((notification) => (
                                <div
                                    key={notification.transaction_id}
                                    className="border-b border-gray-200 pb-2 mb-2 flex justify-between items-center"
                                >
                                    <p className="text-xs text-gray-600">
                                        <strong>{notification.nama_produk}</strong> - {notification.customer_name} - {notification.start_date} - {notification.status_job} - {notification.status_payment}
                                    </p>
                                    <button
                                        onClick={() => removeNotification(notification.transaction_id)}
                                        className="text-red-500 text-xs"
                                    >
                                        Remove
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
                        <p className="text-xs text-gray-500">No new notifications.</p>
                    )}
                </div>
            </Dropdown>
        </div>
    );
}

export default Notification;