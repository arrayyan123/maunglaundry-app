import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

const pngImages = import.meta.glob("/public/assets/Images/*.png", { eager: true });
const webpImages = import.meta.glob("/public/assets/Images/*.webp", { eager: true });
const laundryImages = import.meta.glob("/public/assets/Images/laundry_pics/*.jpg", { eager: true });
const images = { ...pngImages, ...webpImages, ...laundryImages };

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const bigPics = getImageByName('laundry_05');
const logoMaung = getImageByName('Logo_maung');

export default function GuestLayout({ header, children }) {
    return (
        <div className="bg-blue-100 flex justify-center items-center h-screen overflow-hidden">
            <div className="w-1/2 h-screen hidden lg:block">
                <img src={bigPics} alt="Placeholder Image" className="object-cover w-full h-full" />
            </div>
            <div className="lg:p-36 md:p-52 sm:20 overflow-hidden p-8 w-full lg:w-1/2">
                <div className='flex flex-col items-center text-center'>
                    <Link href="/">
                        <img src={logoMaung} className="block h-20 w-auto fill-current text-gray-800" alt="" />
                    </Link>
                    {header && (
                        <div className="text-lg font-semibold flex items-center text-gray-900 truncate">{header}</div>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
}
