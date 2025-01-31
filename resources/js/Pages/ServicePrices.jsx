import React, { useState, useEffect } from "react";
import axios from "axios";
import { Head, usePage, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Breadcrumbs } from "@material-tailwind/react";

export default function ServicePrices({ auth }) {
    const { serviceTypes, csrf_token } = usePage().props;
    const [selectedServiceType, setSelectedServiceType] = useState("");
    const [selectedLaundryType, setSelectedLaundryType] = useState("");
    const [servicePrices, setServicePrices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredPrices, setFilteredPrices] = useState([]);
    const [newService, setNewService] = useState({
        nama_produk: "",
        harga: "",
    });

    const [showAlertModal, setShowAlertModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrf_token;

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setShowAlertModal(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleClickOutsideModal = (event) => {
        if (event.target.classList.contains("alert-modal-overlay")) {
            setShowAlertModal(false);
        }
    };

    const fetchServicePrices = async () => {
        if (!selectedServiceType || !selectedLaundryType) {
            setShowAlertModal(true);
            return;
        }
        try {
            const response = await axios.get("/api/service-prices/list", {
                params: {
                    service_type_id: selectedServiceType,
                    laundry_type: selectedLaundryType,
                },
            });
            setServicePrices(response.data);
            setFilteredPrices(response.data);
        } catch (error) {
            console.error("Error fetching service prices:", error);
        }
    };

    const handleSaveService = async (e) => {
        e.preventDefault();
        if (editingService) {
            try {
                await axios.put(`/api/service-prices/${editingService.id}`, {
                    service_types_id: selectedServiceType,
                    laundry_types: selectedLaundryType,
                    ...newService,
                });
                fetchServicePrices();
                setIsModalOpen(false);
                setNewService({ nama_produk: "", harga: "" });
                setEditingService(null);
            } catch (error) {
                console.error("Error updating service:", error);
            }
        } else {
            try {
                await axios.post("/api/service-prices", {
                    service_types_id: selectedServiceType,
                    laundry_types: selectedLaundryType,
                    ...newService,
                });
                fetchServicePrices();
                setIsModalOpen(false);
                setNewService({ nama_produk: "", harga: "" });
            } catch (error) {
                console.error("Error adding service:", error);
            }
        }
    };

    const handleEditService = (service) => {
        setEditingService(service);
        setNewService({ nama_produk: service.nama_produk, harga: service.harga });
        setIsModalOpen(true);
    };

    const handleSearch = (e) => {
        if (!selectedServiceType || !selectedLaundryType) {
            setShowAlertModal(true);
            return;
        }
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = servicePrices.filter((price) =>
            price.nama_produk.toLowerCase().includes(query)
        );
        setFilteredPrices(filtered);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this service?")) {
            try {
                await axios.delete(`/api/service-prices/${id}`);
                fetchServicePrices();
            } catch (error) {
                console.error("Error deleting service:", error);
            }
        }
    };

    const handleAddService = () => {
        if (!selectedServiceType || !selectedLaundryType) {
            setShowAlertModal(true);
        } else {
            setIsModalOpen(true);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='start-instruksi'>
                    <h2 className="text-xl font-semibold leading-tight text-white">
                        Service Prices Manage
                    </h2>
                </div>
            }
        >
            <Head title="Service Manage" />
            <Breadcrumbs>
                <Link href={route('dashboard')} className="opacity-60">
                    Dashboard
                </Link>
                <Link href={route('service-prices.index')} className="opacity-60">
                    Services Management
                </Link>
            </Breadcrumbs>
            <div className="container mx-auto px-4 py-6 text-black">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
                    Manage Service Prices
                </h1>
                {/* Filter Section */}
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                    <div>
                        <label className="block text-lg font-medium mb-2">
                            Select Service Type:
                        </label>
                        <select
                            className="w-full p-3 rounded bg-gray-800 text-gray-100"
                            value={selectedServiceType}
                            onChange={(e) => setSelectedServiceType(e.target.value)}
                        >
                            <option value="">-- Select Service Type --</option>
                            {serviceTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.jenis_pelayanan}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-lg font-medium mb-2">
                            Select Laundry Type:
                        </label>
                        <select
                            className="w-full p-3 rounded bg-gray-800 text-gray-100"
                            value={selectedLaundryType}
                            onChange={(e) => setSelectedLaundryType(e.target.value)}
                        >
                            <option value="">-- Select Laundry Type --</option>
                            <option value="Wet Laundry">Wet Laundry</option>
                            <option value="Dry Cleaning">Dry Cleaning</option>
                            <option value="Tanpa Kategori">Tanpa Kategori</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        onClick={fetchServicePrices}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded w-full md:w-auto"
                    >
                        Load Prices
                    </button>
                    <button
                        onClick={handleAddService}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-full md:w-auto"
                    >
                        Add Service
                    </button>
                </div>

                <div className="mt-6">
                    <label className="block text-lg font-medium mb-2">
                        Search Nama Produk:
                    </label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search..."
                        className="w-full p-3 rounded bg-gray-800 text-gray-100"
                    />
                </div>

                {/* Service Prices Table */}
                <div className="mt-6 overflow-x-auto">
                    <table className="w-full table-auto bg-gray-800 text-white rounded overflow-hidden">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="p-3 text-left">Nama Product</th>
                                <th className="p-3 text-left">Tipe Laundry</th>
                                <th className="p-3 text-left">Harga</th>
                                <th className="p-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredPrices.map((price) => (
                                <tr key={price.id}>
                                    <td className="p-3">{price.nama_produk}</td>
                                    <td className="p-3">{price.laundry_types}</td>
                                    <td className="p-3">Rp {price.harga}</td>
                                    <td className="p-3 gap-3 flex flex-wrap">
                                        <button
                                            onClick={() => handleEditService(price)}
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(price.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add Service Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-900 text-white bg-opacity-80 flex items-center justify-center px-4">
                        <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
                            <h2 className="text-xl font-semibold mb-4">
                                {editingService ? "Edit Service" : "Add New Service"}
                            </h2>
                            <form onSubmit={handleSaveService}>
                                <div className="mb-4">
                                    <label className="block mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        value={newService.nama_produk}
                                        onChange={(e) =>
                                            setNewService({
                                                ...newService,
                                                nama_produk: e.target.value,
                                            })
                                        }
                                        className="w-full p-3 rounded bg-gray-700 text-gray-100"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Price</label>
                                    <input
                                        type="number"
                                        value={newService.harga}
                                        onChange={(e) =>
                                            setNewService({
                                                ...newService,
                                                harga: e.target.value,
                                            })
                                        }
                                        className="w-full p-3 rounded bg-gray-700 text-gray-100"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
                                    >
                                        {editingService ? "Update" : "Save"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showAlertModal && (
                    <div
                        onClick={handleClickOutsideModal} 
                        className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center px-4 alert-modal-overlay">
                        <div className="bg-gray-800 motion motion-preset-shrink p-6 rounded shadow-lg text-center w-full max-w-sm">
                            <h2 className="text-xl font-semibold text-red-500 mb-4">
                                Missing Selection
                            </h2>
                            <p className="text-gray-300 mb-6">
                                Silakan pilih <strong>Jenis Layanan</strong> dan <strong>Jenis Laundry</strong> sebelum melanjutkan.
                            </p>

                            <button
                                onClick={() => setShowAlertModal(false)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}