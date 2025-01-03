import React, { useState, useEffect } from "react";
import { addDays, addHours } from "date-fns";
import axios from "axios";
const pngImages = import.meta.glob("/public/assets/Images/*.png", { eager: true });
const webpImages = import.meta.glob("/public/assets/Images/*.webp", { eager: true });
const images = { ...pngImages, ...webpImages };
const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};
const logo = getImageByName('Logo_maung');

function EntryTransaction({ customerId, onSave, onNavigateToPayment }) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const [formData, setFormData] = useState({
        payment_method_id: "",
        name: ""
    });
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [customerDetails, setCustomerDetails] = useState({});
    const [serviceTypes, setServiceTypes] = useState([]);
    const [servicePrices, setServicePrices] = useState([]);
    const [selectedServiceType, setSelectedServiceType] = useState("");
    const [selectedLaundryType, setSelectedLaundryType] = useState("");
    const [selectedServices, setSelectedServices] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [transactionId, setTransactionId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState([]);
    const [statusPayment, setStatusPayment] = useState("unpaid");
    const [statusJob, setStatusJob] = useState("ongoing");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        axios.get(`/api/customer/${customerId}`).then((res) => setCustomerDetails(res.data));
        axios.get("/api/admin/service-types").then((res) => setServiceTypes(res.data));
    }, [customerId]);

    const formatNumber = (value) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };   

    const handleServiceTypeChange = (e) => {
        const serviceTypeId = e.target.value;
        setSelectedServiceType(serviceTypeId);
        axios.get(`/api/admin/service-prices/${serviceTypeId}`).then((res) => setServicePrices(res.data));
        const selectedServiceType = serviceTypes.find((type) => type.id === parseInt(serviceTypeId));
        if (selectedServiceType) {
            const durasiHari = selectedServiceType.durasi_hari;

            let estimatedEndDate = null;
            if (durasiHari < 1) {
                estimatedEndDate = addHours(startDate, durasiHari * 24);
            } else {
                estimatedEndDate = addDays(startDate, durasiHari);
            }

            setEndDate(estimatedEndDate);
        }
    };
        
    const handleLaundryTypeChange = (e) => {
        const laundryType = e.target.value;
        setSelectedLaundryType(laundryType);
    };

    const handleSelectService = (e) => {
        const selectedServiceId = parseInt(e.target.value, 10);
        const selectedService = servicePrices.find((service) => service.id === selectedServiceId);

        if (selectedService) {
            setSelectedServices(() => {
                return [{ ...selectedService, service_type_id: selectedServiceType }];
            });

            setQuantity((prev) => {
                const prevQuantity = Object.values(prev)[0] || 0;
                return { [selectedServiceId]: prevQuantity };
            });
        }
    };
    const handleQuantityChange = (serviceId, qty) => {
        const parsedQty = parseInt(qty, 10);
        setQuantity((prev) => ({
            ...prev,
            [serviceId]: isNaN(parsedQty) || parsedQty <= 0 ? 0 : parsedQty,
        }));
    };
    const addNote = async (id) => {
        const noteTransactionId = id || transactionId; 
        if (!newNote.trim()) {
            alert("Note content cannot be empty");
            return;
        }
        if (!noteTransactionId) {
            console.error("Transaction ID is missing");
            alert("Cannot add note because transaction ID is missing");
            return;
        }
        try {
            const response = await axios.post(`/api/admin/transactions/${noteTransactionId}/notes`, {
                content: newNote,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
            });
            setNotes((prevNotes) => [...prevNotes, response.data.note]);
            setNewNote("");
        } catch (error) {
            console.error("Failed to add note", error);
            alert("Failed to add note");
        }
    };
    const sendWhatsAppNotification = async (transactionData) => {
        try {
            let phone = customerDetails.phone;
            if (phone && phone.startsWith('0')) {
                phone = '+62' + phone.substring(1);
            }
            const message = `
            Halo ${customerDetails.name}, berikut adalah detail transaksi laundry Anda:
            - Produk: ${transactionData.nama_produk}
            - Total Harga: Rp.${formatNumber(transactionData.services.reduce((acc, service) => acc + service.price, 0))}
            - Tanggal Mulai: ${startDate.toLocaleDateString()}
            - Tanggal Selesai: ${endDate.toLocaleDateString()}

            Terima kasih telah menggunakan layanan kami!`;
            await axios.post("/send-whatsapp", {
                phone: customerDetails.phone,
                message,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
            });
            console.log("WhatsApp notification sent successfully");
        } catch (error) {
            console.error("Error sending WhatsApp notification:", error);
        }
    };

    useEffect(() => {
        axios.get("/api/admin/payment-methods").then((res) => setPaymentMethod(res.data));
    }, []);  

    useEffect(() => {
        const total = selectedServices.reduce((acc, service) => {
            const qty = quantity[service.id] || 0;
            return acc + service.harga * qty;
        }, 0);
        setTotalPrice(total);
    }, [selectedServices, quantity]);

    const handleSave = async () => {
        if (isSaving) return; 
        setIsSaving(true);
        if (!customerId || !formData.payment_method_id || selectedServices.length === 0) {
            alert("Please fill all required fields.");
            return;
        }

        const dataToSend = {
            customer_id: customerId,
            nama_produk: selectedServices.map(service => service.nama_produk).join(", "),
            laundry_type: selectedLaundryType,
            payment_method_id: formData.payment_method_id,
            status_payment: statusPayment,
            status_job: statusJob,
            start_date: startDate,
            end_date: endDate,
            services: selectedServices.map((service) => ({
                service_type_id: service.service_type_id,
                service_price_id: service.id,
                quantity: quantity[service.id] || 0,
                price: (service.harga * (quantity[service.id] || 0)),
                nama_produk: service.nama_produk,
            })),
        };

        console.log("Data to send:", dataToSend);
        try {
            const response = await axios.post("/api/admin/transactions", dataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
            });

            if (response.status === 201) {
                const transaction = response.data.transaction;
                setTransactionId(transaction.id);                 
                if (newNote.trim()) {
                    await addNote(transaction.id); 
                }
                alert("Transaction saved successfully");
                setTransactionId(response.data.transaction.id);
                setShowReceiptModal(true);
                sendWhatsAppNotification(dataToSend);
                onSave && onSave();
            } else {
                alert("Failed to save transaction");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("There was an error while saving the transaction");
        } finally {
            setIsSaving(false);
        }
    };
    const handlePrintReceipt = () => {
        if (transactionId) {
            window.open(`api/admin/transactions/${transactionId}/receipt`, "_blank");
            setShowReceiptModal(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 my-8 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Entry Transaction</h2>
            <div className="mb-6">
                <h3 className="text-lg font-semibold">Real-time Notifications</h3>
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold">Customer Details</h3>
                <p className="text-gray-700">Name: {customerDetails.name}</p>
                <p className="text-gray-700">Email: {customerDetails.email}</p>
                <p className="text-gray-700">Phone: {customerDetails.phone}</p>
            </div>
            <div className="mb-6">
                <h4 className="text-lg font-semibold">Select Service Type</h4>
                <select
                    onChange={handleServiceTypeChange}
                    value={selectedServiceType}
                    className="w-full border border-gray-300 px-4 py-2 rounded-md"
                >
                    <option value="">Select Service Type</option>
                    {serviceTypes.map((serviceType) => (
                        <option key={serviceType.id} value={serviceType.id}>
                            {serviceType.jenis_pelayanan}
                        </option>
                    ))}
                </select>
            </div>

            {selectedServiceType && (
                <div className="mb-6">
                    <h4 className="text-lg font-semibold">Select Laundry Type</h4>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="laundryType"
                                value="Wet Laundry"
                                checked={selectedLaundryType === "Wet Laundry"}
                                onChange={handleLaundryTypeChange}
                            />
                            Wet Laundry
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="laundryType"
                                value="Dry Cleaning"
                                checked={selectedLaundryType === "Dry Cleaning"}
                                onChange={handleLaundryTypeChange}
                            />
                            Dry Cleaning
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="laundryType"
                                value="Tanpa Kategori"
                                checked={selectedLaundryType === "Tanpa Kategori"}
                                onChange={handleLaundryTypeChange}
                            />
                            Tanpa Kategori
                        </label>
                    </div>
                </div>
            )}
            <div className="mb-6">
                <h4 className="text-lg font-semibold">Select Service</h4>
                <select
                    onChange={handleSelectService}
                    className="w-full border border-gray-300 px-4 py-2 rounded-md"
                >
                    <option value="">Select Service</option>
                    {servicePrices
                        .filter((service) =>
                            selectedLaundryType === 'Tanpa Kategori'
                                ? service.laundry_types === 'Tanpa Kategori' || service.laundry_types === null || service.laundry_types === ''
                                : service.laundry_types === selectedLaundryType
                        )
                        .map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.nama_produk} - Rp.{formatNumber(service.harga)}
                            </option>
                        ))}
                </select>
            </div>
            <div className="mb-6">
                {selectedServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between mb-2">
                        <p>{service.nama_produk}</p>
                        <input
                            type="number"
                            className="border px-2 py-1 rounded w-16"
                            value={quantity[service.id] || 0}
                            onChange={(e) => handleQuantityChange(service.id, e.target.value)}
                        />
                        <p>Rp.{formatNumber(service.harga * (quantity[service.id] || 0))}</p>
                    </div>
                ))}
            </div>
            <h4 className="text-lg font-semibold mb-2">Total Price: Rp.{formatNumber(totalPrice)}</h4>

            <div className="mb-6">
                <h4 className="text-lg font-semibold">Payment Method</h4>
                <select
                    value={formData.payment_method_id}
                    onChange={(e) =>
                        setFormData({ ...formData, payment_method_id: e.target.value })
                    }
                    className="w-full border border-gray-300 px-4 py-2 rounded-md"
                >
                    <option value="">Select Payment Method</option>
                    {paymentMethod.map((method) => (
                        <option key={method.id} value={method.id}>
                            {method.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-6">
                <h4 className="text-lg font-semibold">Notes</h4>
                <textarea
                    className="w-full border border-gray-300 px-4 py-2 rounded-md"
                    placeholder="Add a note for this transaction"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                />
            </div>
            <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                disabled={!formData.payment_method_id || selectedServices.length === 0}
            >
                Save Transaction
            </button>
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
        </div>
    );
}

export default EntryTransaction;