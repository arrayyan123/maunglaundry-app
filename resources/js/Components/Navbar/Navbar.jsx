import { Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

const images = import.meta.glob('/public/assets/Images/*.png', { eager: true });

const getImageByName = (name) => {
  const matchingImage = Object.keys(images).find((path) => path.includes(`${name}.png`));
  return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const logo = getImageByName('Logo_maung');

const Navbar = ({ homeRef, aboutRef, servicesRef, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navbarBackground, setNavbarBackground] = useState('bg-transparent');
  const [navbarText, setNavbarText] = useState('text-white')

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavbarBackground('bg-white');
        setNavbarText('text-black');
      } else {
        setNavbarBackground('bg-transparent');
        setNavbarText('text-white');
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed lg:flex-row flex-col px-6 py-6 z-30 w-screen flex justify-between items-start lg:items-center ${navbarBackground} transition-colors duration-300`}>
      <div className="flex flex-row items-center lg:justify-normal justify-between lg:w-40 w-full">
        <a className="" href="#">
          <img src={logo} className="md:w-40 md:h-30 w-30 h-20" alt="Logo" />
        </a>
        <div className="lg:hidden">
          <button onClick={toggleMenu} className={`navbar-burger flex items-center ${navbarText} p-3`}>
            <svg className="block h-6 w-6 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col lg:justify-between space-x-10">
        <ul className={`${isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } lg:opacity-100 lg:max-h-full lg:flex lg:mx-auto lg:flex-row flex-col lg:items-center lg:w-auto lg:space-x-6 overflow-hidden transition-all duration-300 ease-in-out`}>
          <li><a className={`text-sm ${navbarText} hover:text-gray-500`} onClick={(e) => scrollToSection(homeRef, e)} href="#">Home</a></li>
          <li className="text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-4 h-4 current-fill" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </li>
          <li><a className={`text-sm ${navbarText} hover:text-gray-500`} onClick={(e) => scrollToSection(aboutRef, e)} href="#">About Us</a></li>
          <li className="text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-4 h-4 current-fill" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </li>
          <li><a className={`text-sm ${navbarText} hover:text-gray-500`} onClick={(e) => scrollToSection(servicesRef, e)} href="#">News</a></li>
          <li className="text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-4 h-4 current-fill" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </li>
          <Link href={'/customer/login'}>
            <button className="bg-gray-200 text-black hover:bg-gray-white py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg lg:mt-0 mt-6">
              Daftar Sekarang
            </button>
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
