import React from 'react'
import { Fade } from 'react-awesome-reveal'

const pngImages = import.meta.glob("/public/assets/Images/*.png", { eager: true });
const webpImages = import.meta.glob("/public/assets/Images/*.webp", { eager: true });
const images = { ...pngImages, ...webpImages };

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const qrcode = getImageByName('QRcode-twilio');

function NotificationTwilio({ handleToggleNotificationTwilio }) {
    return (
        <div>
            <Fade>
                <div className="bg-gray-100 text-black p-6 mb-5 rounded-lg shadow-lg">
                    <div className="flex flex-col justify-between mb-4">
                        <div className='flex flex-row items-center space-x-6 mb-3'>
                            <h3 className="text-xl text-center font-semibold">Twilio Notifikasi untuk transaksi anda</h3>
                            <button
                                className="text-white px-5 py-2 bg-red-500 rounded-lg font-bold"
                                onClick={handleToggleNotificationTwilio}
                            >
                                Close
                            </button>
                        </div>
                        <div className='flex flex-col space-y-3'>
                            <h1>Ikuti Langkah Berikut untuk mengaktifkan notifikasi transaksi anda menggunakan Twilio.</h1>
                            <ul className='list-decimal'>
                                <li>
                                    <p>Silahkan Scan QR code ini</p>
                                    <img src={qrcode} className='md:w-56 md:h-auto my-4' alt="" />
                                </li>
                                <li>
                                    <p>Ketika sudah di scan, akan langsung masuk ke WhatsApp dan terdapat kode 'join avoid-bit' dan langsung send saja</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Fade>
        </div>
    )
}

export default NotificationTwilio