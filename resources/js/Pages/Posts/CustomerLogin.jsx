import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Fade, Slide } from 'react-awesome-reveal';
import IonIcon from '@reacticons/ionicons';

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

export default function CustomerLogin() {
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [warning, setWarning] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const suspiciousPatterns = /[-';"]/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    setWarning('');

    if (suspiciousPatterns.test(formData.phone) || suspiciousPatterns.test(formData.password)) {
      setWarning('Input mencurigakan terdeteksi. Harap periksa kembali data Anda.');
      return;
    }

    const formattedPhone = formData.phone.startsWith('+62')
      ? formData.phone
      : `+62${formData.phone.replace(/^0+/, '')}`;

    try {
      const response = await axios.post('/api/customer/login', {
        ...formData,
        phone: formattedPhone,
      });

      if (response.data.status === 'success') {
        localStorage.setItem('customer-token', response.data.token);
        localStorage.setItem('customer-data', JSON.stringify(response.data.customer));
        window.location.href = '/customer/dashboard';
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setErrors(error.response.data.errors);
        } else {
          setMessage(error.response.data.message || 'An error occurred');
        }
      }
    }
  };

  return (
    <>
      <Head title="Customer Login" />
      <div className='bg-blue-100 flex justify-center items-center overflow-y-hidden h-screen'>
        <div className="w-1/2 h-screen hidden lg:block">
          <img src={bigPics} alt="Placeholder Image" className="object-cover w-full h-full" />
        </div>
        <div className="lg:p-16 md:p-52 object-contain sm:20 p-8 w-full lg:w-1/2">
          {message && (
            <div className="bg-red-100 border mb-4 border-red-400 text-red-700 px-4 py-3 rounded">
              {message}
            </div>
          )}
          {warning && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              {warning}
            </div>
          )}
          <div className='flex flex-col items-center text-center'>
            <img src={logoMaung} alt="logo laundry" className='w-[30%]' />
            <h1 className="text-4xl font-semibold mb-4">Login</h1>
          </div>
          <form action="#" method="POST" onSubmit={handleSubmit}>
            <Fade direction='right' cascade>
              <div className="mb-4 bg-blue-100">
                <label for="phone" class="block text-gray-600">Nomor Telepon <span className="text-red-500">*</span></label>
                <div className='flex items-center'>
                  <span className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-md border border-r-0 border-gray-300">
                    +62
                  </span>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    required
                    autocomplete="on"
                    placeholder="81234567890 (tanpa +62 / awali dengan 0)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label for="password" className="block text-gray-800">Password <span className="text-red-500">*</span></label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    required
                    autocomplete="on"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <IonIcon className='text-[22px]' name='eye' /> : <IonIcon className='text-[22px]' name='eye-off' />}
                  </button>
                </div>
              </div>
              <div className="mb-4 flex items-center">
                <input type="checkbox" id="remember" name="remember" className="text-red-500" />
                <label for="remember" className="text-green-900 ml-2">Remember Me</label>
              </div>
              <div className="mb-6 text-blue-500">
                <Link href="/customer/forgot-password" className="hover:underline">Forgot Password?</Link>
              </div>
              <button type="submit" className="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
            </Fade>
          </form>
          <div className="mt-6 mb-6 text-green-500 text-center">
            <Link href="/customer/register" className="hover:underline">Daftarkan disini</Link>
          </div>
          <div>
            <Link href="/">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full flex justify-center items-center">
                <span className="flex flex-row space-x-3 items-center scale-100 hover:scale-110 transition-all ease-in-out">
                  <p>Back to home</p>
                  <IonIcon name="home-outline"></IonIcon>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
