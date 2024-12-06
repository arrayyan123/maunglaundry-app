import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS for Quill editor

function EditContent({ contentId, onClose }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null,
        currentImage: '',
    });

    // Fetch content data when the component mounts
    useEffect(() => {
        axios.get(`/api/contents/${contentId}`)
            .then((response) => {
                const { title, description, image } = response.data;
                setFormData({
                    title,
                    description,
                    image: null,
                    currentImage: image,
                });
            })
            .catch((error) => alert('Failed to load content.'));
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
        data.append('title', formData.title);
        data.append('description', formData.description);
        if (formData.image) {
            data.append('image', formData.image);
        }

        axios
            .post(`/api/contents/${contentId}?_method=PUT`, data)
            .then(() => {
                alert('Content updated successfully!');
                onClose(); // Close the edit form
            })
            .catch((error) => {
                console.error('Update failed:', error.response.data);
                alert('Failed to update content.');
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Description:</label>
                <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                />
            </div>
            <div>
                <label>Image:</label>
                {formData.currentImage && (
                    <img
                        src={`/storage/public/${formData.currentImage}`}
                        alt="Current"
                        style={{ width: 100, height: 100 }}
                    />
                )}
                <input type="file" onChange={handleImageChange} />
            </div>
            <button type="submit">Update</button>
            <button type="button" onClick={onClose}>
                Cancel
            </button>
        </form>
    );
}

export default EditContent;