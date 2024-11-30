import IonIcon from '@reacticons/ionicons'
import React from 'react'

function AddCustButton({ onClick }) {
  return (
    <div>
        <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
            <button 
                className='bg-blue-500 hover:bg-blue-600 p-3 rounded-xl'
                onClick={ onClick }
            >
                <span className='text-white flex flex-row space-x-3 items-center'>
                  <IonIcon className='text-[20px]' name="person-add"></IonIcon>
                  <p>Add Customer</p>
                </span>
            </button>
        </div>
    </div>
  )
}

export default AddCustButton