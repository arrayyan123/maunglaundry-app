import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import CSS for Quill editor

function EditContent({ contentId, onClose }) {
  //const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    currentImage: "",
  });

  // Fetch content data when the component mounts
  useEffect(() => {
    axios
      .get(`/api/contents/${contentId}`)
      .then((response) => {
        const { title, description, image } = response.data;
        setFormData({
          title,
          description,
          image: null,
          currentImage: image,
        });
      })
      .catch((error) => alert("Failed to load content."));
  }, [contentId]);

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes in the Quill editor for description
  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  // Handle file input for image
  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Submit data to the server
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.image) {
      data.append("image", formData.image);
    }

    axios
      .post(`/api/contents/${contentId}?_method=PUT`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          //'X-CSRF-TOKEN': csrfToken
        },
      })
      .then(() => {
        alert("Content updated successfully!");
        onClose(); // Close the edit form
      })
      .catch((error) => {
        console.error("Update failed:", error.response.data);
        alert("Failed to update content.");
      });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Edit Content
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter the title"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={handleDescriptionChange}
            className="mt-1"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image
          </label>
          {formData.currentImage && (
            <div className="mt-2">
              <img
                src={`/storage/public/${formData.currentImage}`}
                alt="Current"
                className="w-32 h-32 object-cover rounded-md shadow-sm"
              />
            </div>
          )}
          <input
            type="file"
            onChange={handleImageChange}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditContent;