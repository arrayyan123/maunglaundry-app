import { Link } from '@inertiajs/react'
import React from 'react'

function Hero({ homeRef }) {
  return (
    <>
      <div ref={homeRef} class="relative bg-gradient-to-r from-purple-600 to-blue-600 h-screen text-white overflow-hidden">
        <div class="absolute inset-0">
          <img src="https://static.wixstatic.com/media/bcdb22_9090bec77e4c4415b7e110c4931b6ab9~mv2.png/v1/fill/w_1000,h_661,al_c,q_90,usm_0.66_1.00_0.01/bcdb22_9090bec77e4c4415b7e110c4931b6ab9~mv2.png" alt="Background Image" class="object-cover object-center w-full h-full" />
          <div class="absolute inset-0 bg-black opacity-50"></div>
        </div>
  
        {/*Teks Rata Kiri Kanan Tengah*/}
        <div class="relative z-10 md:p-60 p-10 flex flex-col justify-center items-center h-full text-center">
          <h1 class="md:text-5xl text-4xl font-bold leading-tight mb-4 motion-preset-shrink">Maung Laundry</h1>
          <p className='text-lg text-gray-300 mb-3 motion-preset-shrink'>Pilih Maung Laundry dan rasakan perbedaan dalam kualitas dan kecepatan layanan laundry yang bisa Anda andalkan setiap waktu.</p>
          <p class="text-lg text-gray-300 mb-8 md:block hidden motion-preset-shrink">Maung Laundry hadir sebagai layanan laundry unggulan yang berbeda dari yang lain. Kami mengutamakan kebersihan, ketepatan waktu, dan kenyamanan pelanggan. Dengan peralatan modern dan teknologi terkini, setiap pakaian Anda akan diproses dengan cermat dan aman. Tim profesional kami siap melayani kebutuhan Anda dengan ramah dan cekatan, memastikan setiap detail tertangani dengan sempurna.</p>
          <Link href={'/customer/login'}>
            <span class="bg-red-500 mt-4 text-white hover:bg-red-300 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">Mulai Sekarang</span>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Hero