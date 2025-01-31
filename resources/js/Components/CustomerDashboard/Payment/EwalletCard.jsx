import { Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { Fade } from 'react-awesome-reveal';

const images = import.meta.glob('/public/assets/images/*.webp', { eager: true });

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}.webp`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const qris = getImageByName('qrisPayment');

function EwalletCard() {
    const [modalImage, setModalImage] = useState(null);

    const openModal = (image) => {
        setModalImage(image);
    };

    const closeModal = () => {
        setModalImage(null);
    };
    const linkNo = 'https://wa.link/kn9lsq';

    return (
        <div className="flex flex-col items-center px-0 sm:px-4 md:px-6 lg:px-8">
            <Fade>
                <div className="w-full max-w-2xl overflow-y-auto max-h-[75vh] px-4 sm:px-6 md:px-8 p-4 border border-gray-300 rounded-lg shadow-md flex flex-col">
                    <h1 className="font-bold text-[16px] sm:text-[25px] md:text-[30px] lg:text-[36px] mb-3 text-center">
                        E-wallet (QRIS)
                    </h1>
                    <ul className="list-decimal text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed space-y-3 sm:space-y-4 text-left">
                        <h1 className="font-semibold mb-2 text-center">
                            Berikut langkah-langkah untuk melakukan pembayaran:
                        </h1>
                        <div className="ml-3 sm:ml-4 text-black">
                            <li className='text-black'>
                                Scan terlebih dahulu untuk QRIS-nya.
                            </li>
                            <li className='text-black'>
                                Klik{' '}
                                <a
                                    className="text-blue-500 hover:underline"
                                    href={linkNo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    link ini
                                </a>{' '}
                                untuk menuju WhatsApp untuk pengiriman bukti pembayaran.
                            </li>
                            <li className='text-black'>
                                Jika sudah membayar, hubungi admin dan tunggu konfirmasi dari pihak laundry. Perhatikan selalu halaman
                                transaksi Anda untuk update mengenai pembayaran.
                            </li>
                            <li className='text-black'>
                                Perlu diperhatikan bahwa nama penerima adalah{' '}
                                <strong>RAYYANA LAUNDRY</strong>.
                            </li>
                        </div>
                    </ul>
                    <button className="px-2 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300 transition my-3 sm:my-4">
                        <a href={linkNo} target="_blank" rel="noopener noreferrer" className="mt-4">
                            <p className='md:text-[15px] text-[12px]'>Hubungi Admin</p>
                        </a>
                    </button>
                    <p className='text-[12px]'><strong>Klik Gambar untuk memperbesarnya</strong></p>
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            openModal(qris);
                        }}
                        href="#"
                    >
                        <img
                            src={qris}
                            className="w-[200px] sm:w-[250px] mx-auto md:w-[300px] lg:w-[500px] max-w-full mt-4"
                            alt="QRIS Payment"
                        />
                    </a>
                </div>
            </Fade>
            {modalImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
                    onClick={closeModal}
                >
                    <div className="relative">
                        <img
                            src={modalImage}
                            alt="Preview"
                            className="max-w-[90vw] motion-preset-blur-up mx-auto max-h-[90vh] object-contain bg-white"
                        />
                        <button
                            className="absolute top-0 md:block hidden right-0 p-4 text-white text-3xl"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EwalletCard;
