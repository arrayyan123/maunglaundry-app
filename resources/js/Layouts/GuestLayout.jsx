import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

const images = import.meta.glob('/public/assets/Images/*.png', { eager: true });

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}.png`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const logo = getImageByName('Logo_maung');

export default function GuestLayout({ children }) {
    return (
        <div className="bg-blue-100 flex justify-center items-center h-screen">
            <div className="w-1/2 h-screen hidden lg:block">
                <img src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826" alt="Placeholder Image" className="object-cover w-full h-full" />
            </div>
            <div className="lg:p-36 md:p-52 sm:20 overflow-hidden p-8 w-full lg:w-1/2">
                <div className='relative left-[34%]'>
                    <Link href="/">
                        <img src={logo} className="block h-20 w-auto fill-current text-gray-800" alt="" />
                    </Link>
                </div>
                {children}
            </div>
        </div>
    );
}
