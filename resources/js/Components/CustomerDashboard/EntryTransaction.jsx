import React, { useState, useEffect } from "react";
import { addDays, addHours } from "date-fns";
import axios from "axios";
import TransferCard from "./Payment/TransferCard";
import EwalletCard from "./Payment/EwalletCard";
import CashCard from "./Payment/CashCard";
import TransactionStepper from "../AdminDashboard/TransactionStepper";

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
    });
    const [activeStep, setActiveStep] = useState(0);
    const [transactionId, setTransactionId] = useState(null);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
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
    const [showModal, setShowModal] = useState(false);
    const [selectedPaymentComponent, setSelectedPaymentComponent] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState([]);
    const [statusPayment, setStatusPayment] = useState("unpaid");
    const [statusJob, setStatusJob] = useState("ongoing");
    const [isSaving, setIsSaving] = useState(false);
    const [dp, setDp] = useState(0);
    const [remaining, setRemaining] = useState(0);

    const steps = [
        "Service Type",
        "Laundry Type",
        "Service Price",
        "Quantity",
        "Payment Method",
        "Payment Status",
        "Down Payment",
        "Save Transaction",
    ];

    useEffect(() => {
        if (!selectedServiceType) setActiveStep(0);
        else if (!selectedLaundryType) setActiveStep(1);
        else if (selectedServices.length === 0) setActiveStep(2);
        else if (!Object.values(quantity).some((qty) => qty > 0)) setActiveStep(3);
        else if (!formData.payment_method_id) setActiveStep(4);
        else if (!statusPayment) setActiveStep(5);
        else if (statusPayment === "partial" && dp <= 0) setActiveStep(6);
        else setActiveStep(7);
    }, [
        selectedServiceType,
        selectedLaundryType,
        selectedServices,
        quantity,
        formData.payment_method_id,
        statusPayment,
        dp,
    ]);

    const formatNumber = (value) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    useEffect(() => {
        axios.get(`/api/customer/${customerId}`).then((res) => setCustomerDetails(res.data));
        axios.get("/api/admin/service-types").then((res) => setServiceTypes(res.data));
    }, [customerId]);

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
        const parsedQty = parseFloat(qty);
        setQuantity((prev) => ({
            ...prev,
            [serviceId]: isNaN(parsedQty) || parsedQty <= 0 ? 0 : parsedQty,
        }));
    };

    useEffect(() => {
        axios.get("/api/admin/payment-methods").then((res) => setPaymentMethod(res.data));
    }, []);

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
            alert("WhatsApp notification sent successfully");
        } catch (error) {
            console.error("Error sending WhatsApp notification:", error);
            alert("Failed to send WhatsApp notification");
        }
    };

    useEffect(() => {
        const total = selectedServices.reduce((acc, service) => {
            const qty = quantity[service.id] || 0;
            return acc + service.harga * qty;
        }, 0);
        setTotalPrice(total);
    }, [selectedServices, quantity]);

    useEffect(() => {
        if (statusPayment === 'partial') {
            setRemaining(totalPrice - dp);
        } else {
            setRemaining(0);
        }
    }, [statusPayment, dp, totalPrice]);

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        if (!customerId || !formData.payment_method_id || selectedServices.length === 0 || !endDate) {
            alert("Please fill all required fields.");
            return;
        }
        const paymentComponentMapping = {
            2: TransferCard,
            3: EwalletCard,
            1: CashCard,
        };
        const SelectedComponent = paymentComponentMapping[formData.payment_method_id];
        if (SelectedComponent) {
            setSelectedPaymentComponent(() => SelectedComponent);
            setShowModal(true);
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
            dp: dp,
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
            const response = await axios.post("/api/customer/transactions", dataToSend, {
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
                // addNote(response.data.transaction.id);
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

    return (
        <div className="w-full flex flex-col mx-auto text-black bg-white shadow-md rounded-md">
            <div className="animated-background bg-gradient-to-r from-blue-gray-700 to-blue-gray-900 flex md:flex-row flex-col md:justify-between justify-normal items-center p-9 rounded-md">
                <img src={logo} className="md:w-48 w-32 motion motion-preset-slide-left-md" alt="" />
                <h1 className="font-bold text-white md:text-[24px] text-[18px]">Formulir Transaksi</h1>
            </div>
            <div className="w-full flex lg:flex-row flex-col mx-auto p-6">
                <div className="w-full lg:mb-0 mb-20 md:block hidden">
                    {/* Stepper progress bar */}
                    <h1 className="text-[20px] font-bold">Progress</h1>
                    <div className="relative top-1/3">
                        <TransactionStepper activeStep={activeStep} steps={steps} />
                    </div>
                </div>
                <div className="w-full">
                    <h2 className="text-xl font-bold mb-4">Masukkan Transaksi</h2>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold">Detail Pelanggan</h3>
                        <p className="text-gray-700">Nama: {customerDetails.name}</p>
                        <p className="text-gray-700">Email: {customerDetails.email}</p>
                        <p className="text-gray-700">Nomor Telepon: {customerDetails.phone}</p>
                    </div>
                    <div className="mb-6 flex md:flex-row md:items-center flex-col gap-4">
                        <div className="flex flex-col w-72">
                            <h4 className="text-lg font-semibold">Pilih Tipe Service</h4>
                            <ul className="text-gray-500 list-disc ml-4">
                                <li>Reguler: 3-4 Hari (estimasi)</li>
                                <li>Oneday: 24 jam</li>
                                <li>Express: 3 jam</li>
                            </ul>
                        </div>
                        <div className="w-full">
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
                    </div>

                    {selectedServiceType && (
                        <div className="mb-6 flex md:flex-row flex-col md:items-center gap-4">
                            <div className="flex flex-col md:w-72">
                                <h4 className="text-lg font-semibold">Pilih Tipe Laundry</h4>
                                <p className="text-gray-500">Wet Laundry dan Dry Cleaning untuk satuan. Tanpa kategori untuk Kiloan, seperti <strong>kiloan, cuci kiloan, gosok kiloan</strong></p>
                            </div>
                            <div className="flex flex-col mt-2 gap-4 w-full">
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
                    <div className="mb-6 flex md:flex-row flex-col md:items-center gap-4">
                        <div className="flex flex-col md:w-72">
                            <h4 className="text-lg font-semibold">Pilih Service</h4>
                            <p className="text-gray-500">Pilih service sesuai yang diinginkan pelanggan</p>
                        </div>
                        <div className="w-full">
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
                    </div>

                    <div className="mb-6">
                        {selectedServices.map((service) => (
                            <div key={service.id} className="flex flex-col w-full bg-gray-200 rounded-xl p-3 items-center justify-between mb-2">
                                <div className="flex md:flex-row flex-col invisible md:visible justify-between w-full font-bold items-center">
                                    <h1>Nama Produk</h1>
                                    <h1>Kuantitas/Kilo</h1>
                                    <h1>Harga Total</h1>
                                </div>
                                <div className="flex md:flex-row flex-col gap-4 justify-between w-full items-center">
                                    <p>{service.nama_produk}</p>
                                    <input
                                        type="number"
                                        className="border px-2 py-1 rounded w-44"
                                        min={0}
                                        step={0.01}
                                        value={quantity[service.id]?.toFixed(2) || "0.00"}
                                        onChange={(e) => handleQuantityChange(service.id, e.target.value)}
                                    />
                                    <p>Rp.{formatNumber(service.harga * (quantity[service.id] || 0))}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Total Harga: Rp.{formatNumber(totalPrice)}</h4>
                    <div className="mb-6 flex md:flex-row flex-col md:items-center gap-4">
                        <div className="flex flex-col w-72">
                            <h4 className="text-lg font-semibold">Metode Pembayaran</h4>
                            <ul className="text-gray-500 list-disc ml-4">
                                <li>E-wallet (QRIS)</li>
                                <li>Transfer (BCA)</li>
                                <li>Cash (mengunjungi Laundry)</li>
                            </ul>
                        </div>
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
                    <div className="mb-6 flex md:flex-row flex-col md:items-center gap-4">
                        <div className="flex flex-col w-72">
                            <h4 className="text-lg font-semibold">Status Pembayaran</h4>
                            <ul className="text-gray-500 list-disc ml-4">
                                <li>Unpaid</li>
                                <li>Partial (DP)</li>
                                <li>Paid</li>
                            </ul>
                        </div>
                        <select
                            value={statusPayment}
                            onChange={(e) => setStatusPayment(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded-md"
                        >
                            <option value="unpaid">Unpaid</option>
                            <option value="paid">Paid</option>
                            <option value="partial">Partial</option>
                        </select>
                    </div>
                    {statusPayment === "partial" && (
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold">Down Payment (DP)</h4>
                            <input
                                type="number"
                                className="w-full border border-gray-300 px-4 py-2 rounded-md"
                                value={dp}
                                onChange={(e) => setDp(Number(e.target.value))}
                            />
                            <p><strong>Remaining Payment:</strong> Rp.{formatNumber(remaining)}</p>
                        </div>
                    )}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold">Catatan</h4>
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
                        Simpan Transaksi
                    </button>
                </div>
                {showModal && selectedPaymentComponent && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white  p-6 rounded-md shadow-md mx-7">
                            <button
                                className="lg:text-[30px] text-sm hover:font-bold text-black"
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                            {React.createElement(selectedPaymentComponent)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EntryTransaction;