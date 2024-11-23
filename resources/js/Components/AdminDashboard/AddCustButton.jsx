import React from 'react'

function AddCustButton({ onClick }) {
  return (
    <div>
        <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
            <button 
                className='bg-blue-500 p-3 rounded-xl'
                onClick={ onClick }
            >
                <span className='text-white'>Add Customer</span>
            </button>
        </div>
    </div>
  )
}

export default AddCustButton