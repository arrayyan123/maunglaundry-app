import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function EditContent({ contentId, onClose }) {
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    currentImages: [],
    newImages: [],
    previewNewImages: [],
    deleteImages: [],
  });

  useEffect(() => {
    axios
      .get(`/api/contents/${contentId}`)
      .then((response) => {
        const { title, description, images } = response.data;
        setFormData({
          title: title || "",
          description: description || "",
          currentImages: images,
          newImages: [],
          previewNewImages: [],
          deleteImages: [],
        });
      })
      .catch((error) => alert("Failed to load content."));
  }, [contentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...files],
      previewNewImages: [...prev.previewNewImages, ...filePreviews],
    }));
  };

  const handleRemoveCurrentImage = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      deleteImages: [...prev.deleteImages, imageId],
      currentImages: prev.currentImages.filter((image) => image.id !== imageId),
    }));
  };

  const handleRemoveNewImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
      previewNewImages: prev.previewNewImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);

    formData.newImages.forEach((image, index) => {
      data.append(`images[]`, image);
    });

    formData.deleteImages.forEach((id) => {
      data.append("delete_images[]", id);
    });

    axios
      .post(`/api/contents/${contentId}?_method=PUT`, data, {
        headers: {
          Accept: "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
      })
      .then(() => {
        alert("Content updated successfully!");
        onClose();
      })
      .catch((error) => {
        console.error("Update failed:", error.response?.data);
        alert("Failed to update content.");
      });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Content</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter the title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={handleDescriptionChange}
            className="mt-1"
          />
        </div>

        {/* Current Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Images</label>
          <div className="flex flex-wrap mt-2">
            {formData.currentImages.map((image) => (
              <div key={image.id} className="relative mr-4 mb-4">
                <img
                  src={`/storage/${image.path}`}
                  alt={image.file_name}
                  className="w-32 h-32 object-cover rounded-md shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCurrentImage(image.id)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Add New Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleNewImageChange}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <div className="flex flex-wrap mt-4">
            {formData.previewNewImages.map((src, index) => (
              <div key={index} className="relative mr-4 mb-4">
                <img
                  src={src}
                  alt={`New Preview ${index}`}
                  className="w-32 h-32 object-cover rounded-md shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
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