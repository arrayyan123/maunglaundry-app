import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown } from "flowbite-react";
import IonIcon from '@reacticons/ionicons';

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [fetchedIds, setFetchedIds] = useState(new Set()); // Set untuk menyimpan ID unik
    const fetchReports = async () => {
        try {
            const response = await axios.get('/api/admin/reports');
            const newReports = response.data.data;
            const filteredReports = newReports.filter(report => !fetchedIds.has(report.id));
            if (filteredReports.length > 0) {
                setNotifications((prev) => [...prev, ...filteredReports]);
                setFetchedIds((prev) => {
                    const updatedIds = new Set(prev);
                    filteredReports.forEach(report => updatedIds.add(report.id));
                    return updatedIds;
                });
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    // Hapus notifikasi berdasarkan ID
    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter(notification => notification.id !== id));
        setFetchedIds((prev) => {
            const updatedIds = new Set(prev);
            updatedIds.delete(id);
            return updatedIds;
        });
    };

    useEffect(() => {
        fetchReports(); // Panggil sekali saat komponen dimuat
        const interval = setInterval(fetchReports, 5000); // Fetch setiap 5 detik
        return () => clearInterval(interval); // Bersihkan interval saat komponen dilepas
    }, []);

    return (
        <div>
            <Dropdown
                label=""
                dismissOnClick={false}
                renderTrigger={() => (
                    <span className="text-white font-bold text-lg">
                        <IonIcon name="notifications-outline" />
                        {notifications.length > 0 && (
                            <span className="ml-1 text-xs text-red-500">
                                ({notifications.length})
                            </span>
                        )}
                    </span>
                )}
            >
                <div className="w-56 p-4 bg-white rounded-lg shadow-md">
                    <h1 className="text-sm font-bold">Notifications</h1>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="border-b border-gray-200 pb-2 mb-2 flex justify-between items-center"
                            >
                                <p className="text-xs text-gray-600">
                                    <strong>{notification.nama_produk}</strong> - {notification.customer_name}
                                </p>
                                <button
                                    onClick={() => removeNotification(notification.id)}
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
