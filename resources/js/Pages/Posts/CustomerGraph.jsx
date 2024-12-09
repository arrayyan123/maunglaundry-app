import CustomerDashboardLayout from '@/Layouts/CustomerDashboardLayout'
import React, { useState, useEffect, useRef } from "react";
const pngImages = import.meta.glob("/public/assets/Images/*.png", { eager: true });
const jpgImages = import.meta.glob("/public/assets/Images/*.jpg", { eager: true });
const webpImages = import.meta.glob("/public/assets/Images/*.webp", { eager: true });
const laundryImages = import.meta.glob("/public/assets/Images/laundry_pics/*.jpg", { eager: true });
const images = { ...pngImages, ...webpImages, ...laundryImages, ...jpgImages };

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const Maintenance = getImageByName('maintenance');

function CustomerGraph() {

    const handleClickStart = () => {
        setRun(true);
    };
    const steps = [
        {
            target: '.start-instruksi',
            content: 'Selamat Datang di website dashboard customer maung laundry',
        },
        {
            target: '.instruksi-pertama',
            content: 'Disini anda bisa melihat informasi mengenai akun anda',
        },
        {
            target: '.instruksi-kedua',
            content: 'email anda (jika belum, anda bisa menambahkannya sendiri melalui halaman profil), alamat anda serta jarak dari alamat anda menuju laundry',
        },
        {
            target: '.instruksi-ketiga',
            content: 'Informasi transaksi anda pada laundry',
        },
        {
            target: '.instruksi-keempat',
            content: 'Disini adalah area input transaksi mandiri, informasi transaksi serta menyalakan notifikasi untuk transaksi anda yang masuk. Mohon gunakan dengan bijaksana. Terimakasih telah menggunakan layanan kami.',
        },
    ];
    return (
        <div>
            <CustomerDashboardLayout
                handleClickStart={handleClickStart}
                header={
                    <div>
                        <h2 className="text-xl start-instruksi font-semibold leading-tight text-white">
                            Customer Dashboard
                        </h2>
                    </div>
                }
            >
                <div className='flex md:flex-row flex-col bg-white overflow-hidden h-[82vh] p-8 space-x-0 md:space-x-3 md:justify-between items-center m-auto'>
                    <img src={Maintenance} className='w-[40%]  h-auto' alt="website maintenance" />
                    <h1 className='text-[50px] md:text-left text-center'>Fitur ini akan hadir</h1>
                </div>
            </CustomerDashboardLayout>
        </div>
    )
}

export default CustomerGraph