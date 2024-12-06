import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditContent from './EditContent';
import { Head } from '@inertiajs/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS untuk Quill editor

function ContentManage({ auth }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '', // Start with an empty description
        image: null,
        preview: null,
    });
    const [contents, setContents] = useState([]);
    const [editingContentId, setEditingContentId] = useState(null);

    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = () => {
        axios.get('/api/contents')
            .then((response) => {
                setContents(response.data);
            })
            .catch((error) => {
                console.error('Error fetching contents:', error);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this content?')) {
            axios.delete(`/api/contents/${id}`)
                .then(() => {
                    alert('Content deleted successfully!');
                    fetchContents();
                })
                .catch((error) => {
                    console.error('Error deleting content:', error);
                });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDescriptionChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            description: value, // Update description state with Quill editor content
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setFormData((prev) => ({
                ...prev,
                image: file,
                preview: preview,
            }));
        }
    };

    const handleEditClick = (id) => {
        setEditingContentId(id);
    };

    const handleCloseEdit = () => {
        setEditingContentId(null);
        fetchContents();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('image', formData.image);

        axios.post('/api/contents', data)
            .then(() => {
                alert('Content uploaded successfully!');
                fetchContents();
                setFormData({ title: '', description: '', image: null }); // Reset the form
            })
            .catch((err) => console.error(err));
    };

    return (
        <div>
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div className='start-instruksi'>
                        <h2 className="text-xl font-semibold leading-tight text-white">
                            Content Management
                        </h2>
                    </div>
                }
            >
                <Head title='Content Management' />
                {/* form untuk submit content baru */}
                {!editingContentId && (
                    <form onSubmit={handleSubmit} className="p-4">
                        <div>
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="border border-gray-300 p-2 w-full"
                            />
                        </div>
                        <div className="mt-4">
                            <label>Description</label>
                            {/* Replace textarea with React-Quill */}
                            <ReactQuill
                                theme="snow"
                                value={formData.description}
                                onChange={handleDescriptionChange}
                                className="mt-2"
                            />
                        </div>
                        <div className="mt-4">
                            <label>Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="border border-gray-300 p-2 w-full"
                            />
                            {/* Display image preview if available */}
                            {formData.preview && (
                                <div className="mt-2">
                                    <img
                                        src={formData.preview}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Upload
                        </button>
                    </form>
                )}
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Content Dashboard</h1>
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">No</th>
                                <th className="border border-gray-300 px-4 py-2">Title</th>
                                <th className="border border-gray-300 px-4 py-2">Description</th>
                                <th className="border border-gray-300 px-4 py-2">Image</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contents.map((content, index) => (
                                <tr key={content.id}>
                                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">{content.title}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <div
                                            dangerouslySetInnerHTML={{ __html: content.description }}
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <img
                                            src={`/storage/public/${content.image}`}
                                            alt={content.title}
                                            className="w-20 h-20 object-cover"
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                            onClick={() => handleDelete(content.id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                            onClick={() => handleEditClick(content.id)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {editingContentId && (
                        <EditContent contentId={editingContentId} onClose={handleCloseEdit} />
                    )}
                </div>
            </AuthenticatedLayout>
        </div>
    );
}

export default ContentManage;