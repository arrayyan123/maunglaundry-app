import React from 'react'
import { Fade } from 'react-reveal';

const images = import.meta.glob('/public/assets/images/*.webp', { eager: true });

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}.webp`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const logo = getImageByName('qrisPayment');

function EwalletCard() {
    return (
        <div>
            <Fade>
                <h1 className='font-bold text-[30px]'>E-wallet (QRIS)</h1>
                <a href=""><button className='text-blue-500 my-5'>Harap hubungi pihak admin untuk mengirim bukti pembayaran</button></a>
                <img src={logo} className='lg:w-auto lg:h-[600px]' alt="" />
            </Fade>
        </div>
    )
}

export default EwalletCard