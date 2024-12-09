// resources/js/Pages/CustomerRegister.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Head, Link } from '@inertiajs/react';
import IonIcon from '@reacticons/ionicons';
import { Fade, Slide } from 'react-awesome-reveal';

const pngImages = import.meta.glob("/public/assets/Images/*.png", { eager: true });
const webpImages = import.meta.glob("/public/assets/Images/*.webp", { eager: true });
const laundryImages = import.meta.glob("/public/assets/Images/laundry_pics/*.jpg", { eager: true });
const images = { ...pngImages, ...webpImages, ...laundryImages };

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const bigPics = getImageByName('laundry_05');
const logoMaung = getImageByName('Logo_maung');


const CustomerRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage('');

        try {
            const response = await axios.post('/api/customer/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.data.status === 'success') {
                setMessage('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '/customer/login';
                }, 2000);
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setMessage('An error occurred during registration.');
                console.error(error);
            }
        }
    };

    return (
        <>
            <Head title='Customer Register' />
            <div className="bg-blue-100 flex justify-center items-center h-screen">
                <div className="w-1/2 h-screen hidden lg:block">
                    <img src={bigPics} alt="Placeholder Image" className="object-cover w-full h-full" />
                </div>
                <div className="lg:p-30 lg:-mt-40 mt-0 md:p-32 sm:26 p-10 w-full lg:w-1/2 h-screen">
                    {message && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {message}
                        </div>
                    )}
                    <div className='flex flex-col items-center text-center'>
                        <img src={logoMaung} alt="logo laundry" className='w-[30%]' />
                        <h1 className="text-2xl font-semibold mb-4">Registrasi</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <Fade cascade>
                            <div className="mb-4 bg-blue-100">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''
                                        }`}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''
                                        }`}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''
                                        }`}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Nomor Telepon
                                </label>
                                <input
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Alamat
                                </label>
                                <textarea
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </Fade>
                        <div className='flex flex-row  items-center justify-between'>
                        <div className=" text-green-500 text-center">
                            <Link href="/customer/login" className="hover:underline">Sudah punya akun? kembali ke login</Link>
                        </div>
                        <button
                            type="submit"
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-[40%]"
                        >
                            Registrasi
                        </button>
                        </div>
                    </form>
                    <div className='my-5'>
                        <Link href="/">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full flex justify-center items-center">
                                <span className="flex flex-row space-x-3 items-center scale-100 hover:scale-110 transition-all ease-in-out">
                                    <p>Kembali ke home</p>
                                    <IonIcon name="home-outline"></IonIcon>
                                </span>
                            </button>

                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomerRegister;