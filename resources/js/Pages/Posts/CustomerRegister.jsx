// resources/js/Pages/CustomerRegister.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Head, Link } from '@inertiajs/react';
import IonIcon from '@reacticons/ionicons';
import { Fade, Slide } from 'react-awesome-reveal';

const pngImages = import.meta.glob("/public/assets/images/*.png", { eager: true });
const webpImages = import.meta.glob("/public/assets/images/*.webp", { eager: true });
const laundryImages = import.meta.glob("/public/assets/images/laundry_pics/*.jpg", { eager: true });
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
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = "Nama tidak boleh kosong.";
        }

        if (!formData.email.trim()) {
            errors.email = "Email tidak boleh kosong.";
        } else if (!formData.email.endsWith("@gmail.com")) {
            errors.email = "Email harus menggunakan domain @gmail.com.";
        }

        if (!formData.password) {
            errors.password = "Password tidak boleh kosong.";
        } else if (formData.password.length < 8) {
            errors.password = "Password harus minimal 8 karakter.";
        } else if (!/[a-zA-Z]/.test(formData.password)) {
            errors.password = "Password harus mengandung huruf.";
        } else if (!/[@_.]/.test(formData.password)) {
            errors.password = "Password harus mengandung setidaknya satu simbol (@, _, .).";
        }

        if (!formData.phone.trim()) {
            errors.phone = "Nomor telepon tidak boleh kosong.";
        } else if (formData.phone.length > 12) {
            errors.phone = "Nomor telepon tidak boleh lebih dari 12 karakter.";
        }

        if (!formData.address.trim()) {
            errors.address = "Alamat tidak boleh kosong.";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage("");

        const phoneWithCountryCode = formData.phone.startsWith('+62')
            ? formData.phone
            : `+62${formData.phone.replace(/\D/g, '')}`;

        const updatedFormData = {
            ...formData,
            phone: phoneWithCountryCode,
        };

        const validationErrors = validateForm(updatedFormData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axios.post("/api/customer/register", updatedFormData, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector("meta[name='csrf-token']")
                        .getAttribute("content"),
                },
            });

            if (response.data.status === "success") {
                setMessage("Registrasi berhasil! Mengarahkan ke login...");
                setTimeout(() => {
                    window.location.href = "/customer/login";
                }, 2000);
            }
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const errors = error.response.data.errors;
    
                const updatedErrors = {};
    
                if (errors.email) {
                    updatedErrors.email = 'Email sudah terdaftar';
                }
                if (errors.phone) {
                    updatedErrors.phone = 'Nomor telepon sudah terdaftar';
                }
                if (!errors.email && !errors.phone) {
                    updatedErrors.general = 'Terjadi kesalahan validasi.';
                }
    
                setErrors(updatedErrors);
            } else {
                setErrors({ general: 'Terjadi kesalahan pada server.' });
            }
        }
    };


    return (
        <>
            <Head title='Customer Register' />
            <div className="bg-blue-100 flex justify-center items-center h-full">
                <div className="w-1/2 h-screen hidden lg:block">
                    <img src={bigPics} alt="Placeholder Image" className="object-cover w-full h-full" />
                </div>
                <div className="lg:p-10 md:p-20 sm:26 p-10 w-full lg:w-1/2 lg:h-screen h-auto">
                    {message && (
                        <div
                            className={`px-4 py-3 mb-4 rounded ${message.includes("berhasil")
                                    ? "bg-green-100 border border-green-400 text-green-700"
                                    : "bg-red-100 border border-red-400 text-red-700"
                                }`}
                        >
                            {message}
                        </div>
                    )}

                    <div className='flex flex-col items-center text-center'>
                        <img src={logoMaung} alt="logo laundry" className='w-[30%]' />
                        <h1 className="text-2xl font-semibold mb-4">Registrasi</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <Fade cascade>
                            <div className="mb-2 bg-blue-100">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Nama <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''
                                        }`}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''
                                        }`}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div className="mb-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className='relative'>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''
                                            }`}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? <IonIcon name='eye' className='text-[22px]' /> : <IonIcon name='eye-off' className='text-[22px]' />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div className="mb-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Nomor Telepon <span className="text-red-500">*</span>
                                </label>
                                <div className='flex items-center'>
                                    <span className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-md border border-r-0 border-gray-300">
                                        +62
                                    </span>
                                    <input
                                        type="text"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/\D/g, ''); 
                                            if (value.startsWith('0')) {
                                                value = value.substring(1);
                                            }
                                            setFormData({ ...formData, phone: value });
                                        }}
                                        placeholder="81234567890"
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                )}
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Alamat <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                                )}
                            </div>
                        </Fade>
                        <div className='flex md:flex-row flex-col gap-4 items-center justify-between'>
                            <div className=" text-green-500 text-center w-full">
                                <Link href="/customer/login" className="hover:underline">Sudah punya akun? kembali ke login</Link>
                            </div>
                            <button
                                type="submit"
                                className="bg-gray-500 hover:bg-gray-700 w-full text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline "
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