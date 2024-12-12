import { Link } from '@inertiajs/react';
import React from 'react'
import { Fade } from 'react-awesome-reveal'

const images = import.meta.glob('/public/assets/images/*.png', { eager: true });

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}.png`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const bca = getImageByName('bcaLogo');

function TransferCard() {
  const linkNo = 'https://wa.link/kn9lsq';
  return (
    <div className='flex flex-col items-center'>
      <Fade>
        <h1 className='font-bold text-[30px]'>Transfer Bank</h1>
        <ul className='list-decimal'>
          <h1>Berikut Langkah-langkah untuk melakukan pembayaran:</h1>
          <div className='ml-4'>
            <li>
              Silahkan Gunakan M-BANKING / ATM untuk melakukan transfer
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
        <div className='flex flex-col items-center'>
          <img src={bca} className='w-40 h-auto ' alt="" />
          <h1>No. Rek</h1>
        </div>
      </Fade>
    </div>
  )
}

export default TransferCard