import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Fade, Slide } from 'react-awesome-reveal';
import IonIcon from '@reacticons/ionicons';

export default function CustomerLogin() {
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    try {
      const response = await axios.post('/api/customer/login', formData);

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
      <div className='bg-blue-100 flex justify-center items-center h-screen'>
        <div className="w-1/2 h-screen hidden lg:block">
          <img src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826" alt="Placeholder Image" className="object-cover w-full h-full" />
        </div>
        <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
          {message && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {message}
            </div>
          )}
          <h1 className="text-4xl font-semibold mb-4">Login</h1>
          <form action="#" method="POST" onSubmit={handleSubmit}>
            <Fade direction='right' cascade>
              <div className="mb-4 bg-blue-100">
                <label for="phone" class="block text-gray-600">Nomor Telepon</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  required
                  autocomplete="on"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label for="password" className="block text-gray-800">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  required
                  autocomplete="on"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="mb-4 flex items-center">
                <input type="checkbox" id="remember" name="remember" className="text-red-500" />
                <label for="remember" className="text-green-900 ml-2">Remember Me</label>
              </div>
              <div className="mb-6 text-blue-500">
                <a href="#" className="hover:underline">Forgot Password?</a>
              </div>
              <button type="submit" className="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
            </Fade>
          </form>
          <div className="mt-6 mb-6 text-green-500 text-center">
            <a href="/customer/register" className="hover:underline">Daftarkan disini</a>
          </div>
          <div>
            <a href="/">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full flex justify-center items-center">
                <span className="flex flex-row space-x-3 items-center scale-100 hover:scale-110 transition-all ease-in-out">
                  <p>Back to home</p>
                  <IonIcon name="home-outline"></IonIcon>
                </span>
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
