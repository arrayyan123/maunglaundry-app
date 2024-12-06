import React from 'react'
import { Fade } from 'react-reveal';

const images = import.meta.glob('/public/assets/images/*.webp', { eager: true });

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}.webp`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const qris = getImageByName('qrisPayment');

function EwalletCard() {
    const linkNo = 'https://wa.link/kn9lsq';
    return (
        <div className='flex flex-col items-center'>
            <Fade>
                <h1 className='font-bold text-[30px]'>E-wallet (QRIS)</h1>
                <ul className='list-decimal'>
                    <h1>Berikut Langkah-langkah untuk melakukan pembayaran:</h1>
                    <div className='ml-4'>
                        <li>
                            Scan Terlebih dahulu untuk QRIS nya
                        </li>
                        <li>
                            klik <a className='text-blue-500 hover:underline no-underline' href={linkNo}>link ini</a> untuk melakukan redirect menuju WhatsApp untuk pengiriman bukti pembayaran.
                        </li>
                        <li>
                            jika sudah, tunggu konfirmasi dari pihak laundry, perhatikan selalu halaman transaksi anda untuk update mengenai Payment anda.
                        </li>
                        <li>
                            Perlu diperhatikan bahwa nama penerima atas nama <strong>MAUNG LAUNDRY</strong>
                        </li>
                    </div>
                </ul>
                <a href={linkNo} target="_blank" rel="noopener noreferrer"><button className='text-blue-500 my-5'>Harap hubungi pihak admin untuk mengirim bukti pembayaran dengan klik teks ini.</button></a>
                <img src={qris} className='lg:w-auto lg:h-[400px]' alt="" />
            </Fade>
        </div>
    )
}

export default EwalletCard