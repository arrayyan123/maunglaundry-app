import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import EditContent from './EditContent';
import { Head } from '@inertiajs/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import IonIcon from '@reacticons/ionicons';

function ContentManage({ auth }) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        images: [],
        delete_images: [],
        preview: [],
    });
    const [contents, setContents] = useState([]);
    const [editingContentId, setEditingContentId] = useState(null);
    const editContentRef = useRef(null);
    const [currentPageContents, setCurrentPageContents] = useState(1);

    const itemsPerPageContents = 3;

    const fetchContents = () => {
        axios.get('/api/contents')
            .then((response) => {
                setContents(response.data);
            })
            .catch((error) => {
                console.error('Error fetching contents:', error);
            });
    };

    useEffect(() => {
        fetchContents();
    }, []);

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
            description: value,
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const filePreviews = files.map((file) => URL.createObjectURL(file));

        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...files],
            preview: [...prev.preview, ...filePreviews],
        }));
    };

    const handleEditClick = (id) => {
        setEditingContentId(id);
        setTimeout(() => {
            if (editContentRef.current) {
                editContentRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 100);
    };

    const handleCloseEdit = () => {
        setEditingContentId(null);
        fetchContents();
    };

    const handleRemoveImage = (index) => {
        setFormData((prev) => {
            const updatedImages = prev.images.filter((_, i) => i !== index);
            const updatedPreview = prev.preview.filter((_, i) => i !== index);
            return {
                ...prev,
                images: updatedImages,
                preview: updatedPreview,
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.title.length < 15) {
            alert('Judul harus memiliki minimal 15 karakter.');
            return;
        }

        const descriptionWordCount = formData.description.trim().split(/\s+/).length;
        if (descriptionWordCount < 30) {
            alert('Deskripsi harus memiliki minimal 30 kata.');
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);

        formData.images.forEach((image, index) => {
            data.append(`images[${index}]`, image);
        });

        if (formData.delete_images.length > 0) {
            formData.delete_images.forEach((id) => {
                data.append('delete_images[]', id);
            });
        }

        axios.post('/api/contents', data, {
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
        })
            .then(() => {
                alert('Content uploaded successfully!');
                fetchContents();
                setFormData({ title: '', description: '', images: [], preview: [] });
            })
            .catch((err) => console.error(err));
    };

    const indexOfLastContent = currentPageContents * itemsPerPageContents;
    const indexOfFirstContent = indexOfLastContent - itemsPerPageContents;
    const currentContents = contents.slice(indexOfFirstContent, indexOfLastContent);
    const totalContentPages = Math.ceil(contents.length / itemsPerPageContents);

    const handlePageChangeContents = (pageNumber) => {
        setCurrentPageContents(pageNumber);
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
                <h1 className='ml-3 md:text-[30px] text-black text-[20px] font-bold'>Berita Terkini</h1>
                {/* form untuk submit content baru */}
                {!editingContentId && (
                    <form onSubmit={handleSubmit} className="p-4">
                        <div>
                            <label className='text-black'>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="border border-gray-300 p-2 w-full"
                            />
                        </div>
                        <div className="mt-4">
                            <label className='text-black'>Description</label>
                            <ReactQuill
                                theme="snow"
                                value={formData.description}
                                onChange={handleDescriptionChange}
                                className="mt-2"
                            />
                        </div>
                        <div className="mt-4">
                            <label className='text-black'>Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="border border-gray-300 p-2 w-full"
                            />
                            <div className="flex flex-wrap mt-4">
                                {formData.preview.map((src, index) => (
                                    <div key={index} className="relative mr-4 mb-4">
                                        <img
                                            src={src}
                                            alt={`Preview ${index}`}
                                            className="w-32 h-32 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            <span className='flex flex-row items-center space-x-3'>
                                <p>Upload</p>
                                <IonIcon name='save' />
                            </span>
                        </button>
                    </form>
                )}
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4 text-black">Berita Terkini</h1>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-300 text-black">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">No</th>
                                    <th className="border border-gray-300 px-4 py-2">Judul</th>
                                    <th className="border border-gray-300 px-4 py-2">Deskripsi</th>
                                    <th className="border border-gray-300 px-4 py-2">Gambar</th>
                                    <th className="border border-gray-300 px-4 py-2">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentContents.map((content, index) => (
                                    <tr key={content.id}>
                                        <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                        <td className="border border-gray-300 px-4 py-2">{content.title}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div
                                                className="prose prose-sm max-w-none text-black"
                                                dangerouslySetInnerHTML={{ __html: content.description }}
                                            />
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {content.images.map((image) => (
                                                <img
                                                    key={image.id}
                                                    src={`/storage/${image.path}`}
                                                    alt={`Image ${image.path}`}
                                                    width="50"
                                                    className="border rounded"
                                                />
                                            ))}
                                        </td>
                                        <td className="border space-y-1 border-gray-300 px-4 py-2">
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                                onClick={() => handleDelete(content.id)}
                                            >
                                                <span className='flex flex-row space-x-3 items-center'>
                                                    <IonIcon name='trash' />
                                                </span>
                                            </button>
                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                                onClick={() => handleEditClick(content.id)}
                                            >
                                                <span className='flex flex-row space-x-3 items-center'>
                                                    <IonIcon name='create' />
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalContentPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChangeContents(index + 1)}
                                className={`mx-1 px-3 py-1 rounded ${currentPageContents === index + 1
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-700 text-gray-300'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    {editingContentId && (
                        <div ref={editContentRef}>
                            <EditContent contentId={editingContentId} onClose={handleCloseEdit} />
                        </div>
                    )}
                </div>
            </AuthenticatedLayout>
        </div>
    );
}

export default ContentManage;