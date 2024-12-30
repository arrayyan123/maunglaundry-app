import { Link } from '@inertiajs/react';
import IonIcon from '@reacticons/ionicons';
import React from 'react'

const images = import.meta.glob('/public/Assets/Images/*.png', { eager: true });

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}.png`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const logo = getImageByName('Logo_maung');

function Footer({ homeRef, aboutRef, servicesRef, scrollToSection }) {
    return (
        <div>
            <footer class="bg-gray-100 dark:bg-gray-900">
                <div className='flex flex-row items-center justify-between'>
                    <div class=" max-w-5xl mt-5 flex md:flex-row flex-col space-x-5 px-4 py-2 sm:px-6 lg:px-9">
                        <div class="flex text-teal-600 dark:text-teal-300">
                            <img className='w-[150px]' src={logo} alt="logo maung" />
                        </div>
                        <p class=" mt-6 max-w-md leading-relaxed text-gray-500 dark:text-gray-400">
                            Maung Laundry<br />
                            Partnership of Maung Perkasa Abadi
                        </p>
                    </div>
                    <div className='flex md:flex-row flex-col gap-6 items-center px-4 py-10 sm:px-6 lg:px-9'>
                        <h1>Find More About Us</h1>
                        <ul class=" flex justify-center gap-6 md:gap-8">
                            <li>
                                <a
                                    href="https://www.instagram.com/rayyanalaundry/"
                                    rel="noreferrer"
                                    target="_blank"
                                    class="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                                >
                                    <span class="sr-only">Instagram</span>
                                    <IonIcon className='text-[30px]' name='logo-instagram' />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://wa.link/0efse0"
                                    rel="noreferrer"
                                    target="_blank"
                                    class="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                                >
                                    <span class="sr-only">WhatsApp</span>
                                    <IonIcon className='text-[30px]' name='logo-whatsapp' />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='flex p-4 gap-2 flex-col my-2'>
                    <div className='border-b-2 border-gray-400'></div>
                    <h2>© copyright 2024. all rights reserved</h2>
                </div>
            </footer>
        </div>
    )
}

export default Footer