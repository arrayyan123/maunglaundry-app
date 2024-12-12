import { Link } from '@inertiajs/react';
import React from 'react';
import { Fade } from 'react-awesome-reveal';

const images = import.meta.glob('/public/assets/images/*.webp', { eager: true });

const getImageByName = (name) => {
  const matchingImage = Object.keys(images).find((path) => path.includes(`${name}.webp`));
  return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const qris = getImageByName('qrisPayment');

function EwalletCard() {
  const linkNo = 'https://wa.link/kn9lsq';
  return (
    <div className="flex flex-col items-center px-3 sm:px-4 md:px-6 lg:px-8">
      <Fade>
        <h1 className="font-bold text-[20px] sm:text-[25px] md:text-[30px] lg:text-[36px] mb-3 text-center">
          E-wallet (QRIS)
        </h1>
        <ul className="list-decimal text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed space-y-3 sm:space-y-4 text-left">
          <h1 className="font-semibold mb-2 text-center">
            Berikut langkah-langkah untuk melakukan pembayaran:
          </h1>
          <div className="ml-3 sm:ml-4">
            <li>
              Scan terlebih dahulu untuk QRIS-nya.
            </li>
            <li>
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
            <li>
              Jika sudah, tunggu konfirmasi dari pihak laundry. Perhatikan selalu halaman
              transaksi Anda untuk update mengenai pembayaran.
            </li>
            <li>
              Perlu diperhatikan bahwa nama penerima adalah{' '}
              <strong>MAUNG LAUNDRY</strong>.
            </li>
          </div>
        </ul>
        <a href={linkNo} target="_blank" rel="noopener noreferrer" className="mt-4">
          <button className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300 transition my-3 sm:my-4">
            Hubungi Admin
          </button>
        </a>
        <img
          src={qris}
          className="w-[200px] sm:w-[250px] md:w-[300px] lg:w-[500px] max-w-full mt-4"
          alt="QRIS Payment"
        />
      </Fade>
    </div>
  );
}

export default EwalletCard;
