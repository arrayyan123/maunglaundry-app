import React, { useState } from "react";
import axios from "axios";

const AddCustomer = () => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("/api/admin/register_customer", {
        ...formData,
        password: formData.phone,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
      });

      if (response.data.status === "success") {
        setSuccess("Customer added successfully!");
        setFormData({
          name: "",
          phone: "",
          address: "",
        });
      }
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      if (err.response && err.response.data.errors) {
        setError(err.response.data.errors);
      } else {
        setError("An error occurred while adding the customer.");
      }
    }
  };


  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md my-4">
      <h2 className="text-2xl font-semibold mb-4">Add Customer</h2>
      {/* {error && (
        <div className="text-red-500 mb-3">
          {Object.keys(error).map((key) => (
            <p key={key}>{error[key].join(", ")}</p>
          ))}
        </div>
      )} */}
      {success && <p className="text-green-500 mb-3">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="phone">
            Phone Number
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="address">
            Address (Gunakan Format jalan, kelurahan, kecamatan, kota)<br />
            contoh: jalan cemara i, pondok bahar, karang tengah, tangerang
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          ></textarea>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Customer
        </button>
      </form>
    </div>
  );
};

export default AddCustomer;
