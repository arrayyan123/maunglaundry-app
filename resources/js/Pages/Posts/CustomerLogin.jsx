import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function CustomerLogin() {
  const [formData, setFormData] = useState({
    phone: '',  // Ganti 'email' dengan 'phone'
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
        <div class="w-1/2 h-screen hidden lg:block">
          <img src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826" alt="Placeholder Image" class="object-cover w-full h-full" />
        </div>
        <div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
          {message && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {message}
            </div>
          )}
          <h1 class="text-2xl font-semibold mb-4">Login</h1>
          <form action="#" method="POST" onSubmit={handleSubmit}>
            <div class="mb-4 bg-blue-100">
              <label for="phone" class="block text-gray-600">Phone Number</label>  {/* Ganti email menjadi phone */}
              <input
                type="text"
                id="phone"
                name="phone"
                class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
                autocomplete="on"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div class="mb-4">
              <label for="password" class="block text-gray-800">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
                autocomplete="on"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div class="mb-4 flex items-center">
              <input type="checkbox" id="remember" name="remember" class="text-red-500" />
              <label for="remember" class="text-green-900 ml-2">Remember Me</label>
            </div>
            <div class="mb-6 text-blue-500">
              <a href="#" class="hover:underline">Forgot Password?</a>
            </div>
            <button type="submit" class="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
          </form>
          <div class="mt-6 text-green-500 text-center">
            <a href="/customer/register" class="hover:underline">Sign up Here</a>
          </div>
          <div>
            <a href="/">
              <button className='px-4 py-2 bg-blue-500 text-white rounded-lg'>
                Back to home
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
