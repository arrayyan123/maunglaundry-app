import { Link } from '@inertiajs/react';
import React from 'react'
import { Fade } from 'react-awesome-reveal'
import { Clipboard } from "flowbite-react"

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
        <div className="w-full max-w-xl overflow-y-auto max-h-[75vh] p-4 border border-gray-300 rounded-lg shadow-md">
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
                Perlu diperhatikan bahwa nama penerima atas nama <strong>MAUNG LAUNDRY / Djoko Darminto</strong>
              </li>
            </div>
          </ul>
          <a href={linkNo} target="_blank" rel="noopener noreferrer"><button className='text-blue-500 my-5'>Harap hubungi pihak admin untuk mengirim bukti pembayaran dengan klik teks ini.</button></a>
          <div className='flex flex-col items-center'>
            <img src={bca} className='w-40 h-auto ' alt="" />
            <span>
              No. Rek:
              <div className="grid w-full max-w-[23rem] grid-cols-8 gap-2">
                <label htmlFor="no-rek" className="sr-only">
                  Label
                </label>
                <input id="no-rek" type="text"
                  className="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  value="7340105006"
                  disabled
                  readOnly
                />
                <Clipboard valueToCopy="7340105006" label="Copy" />
              </div>
            </span>
          </div>
        </div>
      </Fade>
    </div>
  )
}

export default TransferCard