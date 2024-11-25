import React, { useState, useEffect } from "react";
import axios from "axios";
import TransferCard from "./Payment/TransferCard";
import EwalletCard from "./Payment/EwalletCard";
import CashCard from "./Payment/CashCard";

function EntryTransaction({ customerId, onSave, onNavigateToPayment }) {
    const [formData, setFormData] = useState({
        payment_method_id: "",
    });
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

    const formatNumber = (value) => {
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      };

    useEffect(() => {
        axios.get(`/api/customer/${customerId}`).then((res) => setCustomerDetails(res.data));
        axios.get("/api/admin/service-types").then((res) => setServiceTypes(res.data));
    }, [customerId]);

    const handleServiceTypeChange = (e) => {
        const serviceTypeId = e.target.value;
        setSelectedServiceType(serviceTypeId);
        axios
            .get(`/api/admin/service-prices/${serviceTypeId}`)
            .then((res) => setServicePrices(res.data));
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

        if (!customerId || !formData.payment_method_id || selectedServices.length === 0) {
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
            const response = await axios.post("/api/admin/transactions", dataToSend);
            if (response.status === 201) {
                alert("Transaction saved successfully");
                onSave && onSave();
            } else {
                alert("Failed to save transaction");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("There was an error while saving the transaction");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 my-8 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Entry Transaction</h2>

            <div className="mb-6">
                <h3 className="text-lg font-semibold">Customer Details</h3>
                <p className="text-gray-700">Name: {customerDetails.name}</p>
                <p className="text-gray-700">Email: {customerDetails.email}</p>
                <p className="text-gray-700">Nomor Telepon: {customerDetails.phone}</p>
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
                        <p>Rp {formatNumber(service.harga * (quantity[service.id] || 0))}</p>
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

            <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                disabled={!formData.payment_method_id || selectedServices.length === 0}
            >
                Save Transaction
            </button>

            {showModal && selectedPaymentComponent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-md mx-7">
                        <button
                            className="absolute top-12 right-12 text-[30px] hover:font-bold text-white"
                            onClick={() => setShowModal(false)}
                        >
                            ✕
                        </button>
                        {React.createElement(selectedPaymentComponent)}
                    </div>
                </div>
            )}

        </div>
    );
}

export default EntryTransaction;