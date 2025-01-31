import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function EditTransactionModal({ transactionId, onClose, onUpdate }) {
    const [transaction, setTransaction] = useState(null);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [servicePricesMap, setServicePricesMap] = useState({});
    const [downPayment, setDownPayment] = useState({ dp: 0, remaining: 0 });
    const [customerName, setCustomerName] = useState("");
    const [editedData, setEditedData] = useState({
        payment_method_id: "",
        status_payment: "",
        status_job: "",
        dp: 0,
        remaining: 0,
        services: [],
    });

    const laundryTypes = [
        { id: 1, name: "Wet Laundry" },
        { id: 2, name: "Dry Cleaning" },
        { id: 3, name: "Tanpa Kategori" },
    ];

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            try {
                const response = await axios.get(`/api/admin/transaction-details/${transactionId}`);
                setTransaction(response.data);

                const customerResponse = await axios.get(`/api/customer/${response.data.customer_id}`);
                const customerName = customerResponse.data.name || "";
                setCustomerName(customerResponse.data.name || ""); 

                const pricesMap = {};

                const servicesWithPrices = await Promise.all(response.data.details.map(async (detail) => {
                    const serviceTypeId = detail.service_type?.id || "";
                    if (!pricesMap[serviceTypeId]) {
                        const servicePriceResponse = await axios.get(`/api/admin/service-prices/${serviceTypeId}`);
                        pricesMap[serviceTypeId] = servicePriceResponse.data;
                    }

                    const servicePrice = pricesMap[serviceTypeId].find(sp => sp.id === detail.service_price?.id);
                    const quantity = parseFloat(detail.quantity) || 1;
                    const pricePerUnit = servicePrice ? servicePrice.harga : 0;
                    const totalPrice = pricePerUnit * quantity;
                    return {
                        ...detail,
                        service_type_id: serviceTypeId,
                        service_price_id: detail.service_price?.id || "",
                        quantity: quantity,
                        price: totalPrice,
                        nama_produk: servicePrice ? servicePrice.nama_produk : "",
                    };
                }));

                setServicePricesMap(pricesMap);
                setEditedData({
                    payment_method_id: response.data.payment_method?.id || "",
                    status_payment: response.data.status_payment || "",
                    status_job: response.data.status_job || "",
                    laundry_type: response.data.laundry_type || "",
                    services: servicesWithPrices,
                });

                fetchDownPayment(transactionId);

            } catch (error) {
                console.error("Failed to fetch transaction details:", error);
            }
        };

        const fetchServiceTypes = async () => {
            try {
                const response = await axios.get("/api/admin/service-types");
                setServiceTypes(response.data);
                console.log('fetch service type', setServiceTypes)
            } catch (error) {
                console.error("Failed to fetch service types:", error);
            }
        };

        const fetchPaymentMethods = async () => {
            try {
                const response = await axios.get("/api/admin/payment-methods");
                setPaymentMethods(response.data);
            } catch (error) {
                console.error("Failed to fetch payment methods:", error);
            }
        };

        fetchTransactionDetails();
        fetchServiceTypes();
        fetchPaymentMethods();
    }, [transactionId]);

    const fetchDownPayment = async (transactionId) => {

        if (!transactionId) return;
        try {
            const downPaymentResponse = await axios.get(`/api/admin/transactions/${transactionId}/down-payment`);
            const downPaymentData = downPaymentResponse.data.down_payment;

            setDownPayment(downPaymentData);
            setEditedData((prev) => ({
                ...prev,
                dp: downPaymentData.dp || 0,
                remaining: downPaymentData.remaining || 0,
            }));
        } catch (error) {
            console.error("Failed to fetch down payment:", error);
        }
    };

    useEffect(() => {
        fetchDownPayment()
    }, []);

    const handleServiceChange = (index, field, value) => {
        const updatedServices = [...editedData.services];
        updatedServices[index][field] = field === "quantity" ? parseFloat(value) || 0 : value;

        if (field === "service_price_id" || field === "quantity") {
            const servicePrice = (servicePricesMap[updatedServices[index].service_type_id] || []).find(
                (sp) => sp.id === parseInt(updatedServices[index].service_price_id, 10)
            );
            const pricePerUnit = servicePrice?.harga || 0;
            const quantity = updatedServices[index].quantity || 1;
            updatedServices[index].price = pricePerUnit * quantity;
        }

        setEditedData((prev) => ({ ...prev, services: updatedServices }));
    };

    const handleServiceTypeChange = async (index, serviceTypeId) => {
        const updatedServices = [...editedData.services];
        updatedServices[index].service_type_id = serviceTypeId;
        updatedServices[index].service_price_id = "";
        updatedServices[index].quantity = 1;
        updatedServices[index].price = 0;

        try {
            const response = await axios.get(`/api/admin/service-prices/${serviceTypeId}`);
            setServicePricesMap((prev) => ({ ...prev, [serviceTypeId]: response.data }));

            if (response.data.length > 0) {
                updatedServices[index].service_price_id = response.data[0].id;
                updatedServices[index].price = response.data[0].harga;
                updatedServices[index].nama_produk = response.data[0].nama_produk;
            }
        } catch (error) {
            console.error("Failed to fetch service prices:", error);
        }

        setEditedData((prev) => ({ ...prev, services: updatedServices }));
    };
    const formatNumber = (value) => {
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      };
    const handleSave = async () => {
        try {
            await axios.put(`/api/admin/transactions/${transactionId}/update`, editedData);
            alert("Transaction updated successfully!");
            onUpdate && onUpdate();
            onClose();
        } catch (error) {
            console.error("Failed to update transaction:", error);
            alert("Failed to update transaction");
        }
    };

    if (!transaction) return <p>Loading...</p>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black w-full max-w-2xl lg:max-w-3xl mx-auto rounded-md shadow-md overflow-y-auto max-h-[calc(100vh-4rem)] p-6 sm:p-8 md:p-8">
                <button onClick={onClose} className="text-right my-3 text-xl font-bold">✕</button>
                <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Customer Name</label>
                    <p className="border border-gray-300 rounded px-2 py-1 bg-gray-100">{customerName}</p>
                </div>
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Payment Method</label>
                    <select
                        value={editedData.payment_method_id}
                        onChange={(e) => setEditedData({ ...editedData, payment_method_id: e.target.value })}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                    >
                        <option value="">Select Payment Method</option>
                        {paymentMethods.map((pm) => (
                            <option key={pm.id} value={pm.id}>
                                {pm.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Status Payment</label>
                    <select
                        value={editedData.status_payment}
                        onChange={(e) => setEditedData({ ...editedData, status_payment: e.target.value })}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                    >
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="partial">Partial</option>
                    </select>
                </div>

                {editedData.status_payment === "partial" && (
                    <>
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">Down Payment (DP)</label>
                            <input
                                type="number"
                                value={editedData.dp}
                                onChange={(e) => {
                                    const dpValue = parseFloat(e.target.value) || 0;
                                    const totalPrice = transaction.details.reduce(
                                        (sum, detail) => sum + detail.price,
                                        0
                                    );
                                    setEditedData({
                                        ...editedData,
                                        dp: dpValue,
                                        remaining: totalPrice - dpValue,
                                    });
                                }}
                                className="w-full border border-gray-300 rounded px-2 py-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">Remaining Payment</label>
                            <input
                                type="number"
                                value={editedData.remaining}
                                disabled
                                className="w-full border border-gray-300 rounded px-2 py-1 bg-gray-100"
                            />
                        </div>
                    </>
                )}

                {transaction.status_payment === 'partial' && downPayment[transaction.id] && (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold text-gray-800">Current Down Payment Info</h3>
                        <p className='text-black'>DP: Rp.{formatNumber(downPayment[transaction.id].dp)}</p>
                        <p className='text-black'>Remaining: Rp.{formatNumber(downPayment[transaction.id].remaining)}</p>
                        <p className='text-black'>
                            Date: {new Date(downPayment[transaction.id].created_at).toLocaleString()}
                        </p>
                    </div>
                )}

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Status Job</label>
                    <select
                        value={editedData.status_job}
                        onChange={(e) => setEditedData({ ...editedData, status_job: e.target.value })}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                    >
                        <option value="ongoing">Ongoing</option>
                        <option value="done">Done</option>
                        <option value="pending">Pending</option>
                        <option value="cancel">Cancel</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Laundry Type</label>
                    <select
                        value={editedData.laundry_type}
                        onChange={(e) => setEditedData({ ...editedData, laundry_type: e.target.value })}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                    >
                        <option value="">Select Laundry Type</option>
                        {laundryTypes.map((lt) => (
                            <option key={lt.id} value={lt.name}>
                                {lt.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Services</h4>
                    {editedData.services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between mb-2">
                            <select
                                value={service.service_type_id}
                                onChange={(e) => handleServiceTypeChange(index, e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 w-1/3"
                            >
                                <option value="">Select Service Type</option>
                                {serviceTypes.map((st) => (
                                    <option key={st.id} value={st.id}>
                                        {st.jenis_pelayanan}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={service.service_price_id}
                                onChange={(e) => handleServiceChange(index, "service_price_id", e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 w-1/3"
                            >
                                <option value="">Select Service Price</option>
                                {(servicePricesMap[service.service_type_id] || []).map((sp) => (
                                    <option key={sp.id} value={sp.id}>
                                        {sp.nama_produk} - Rp.{sp.harga}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                min={0}
                                step={0.01}
                                value={service.quantity?.toFixed(2) || "0.00"}
                                onChange={(e) => handleServiceChange(index, "quantity", parseFloat(e.target.value))}
                                className="border border-gray-300 rounded px-2 py-1 w-1/3"
                            />
                        </div>
                    ))}
                    {transaction.status_payment === 'partial' && downPayment[transaction.id] && (
                        <div className="mt-4">
                            <h3 className="text-lg font-bold text-gray-800">Current Down Payment Info</h3>
                            <p className='text-black'>DP: Rp.{downPayment[transaction.id].dp}</p>
                            <p className='text-black'>Remaining: Rp.{downPayment[transaction.id].remaining}</p>
                            <p className='text-black'>
                                Date: {new Date(downPayment[transaction.id].created_at).toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Services</h4>
                    {editedData.services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between mb-2">
                            <p>{service.nama_produk}</p>
                            <p>Qty: {service.quantity}</p>
                            <p>Price: Rp.{formatNumber(service.price)}</p>
                        </div>
                    ))}
                </div>

                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default EditTransactionModal;