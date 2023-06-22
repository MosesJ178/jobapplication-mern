import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const user = useSelector((state) => state.user.value)
  const navigate = useNavigate();
  return (
    <div>
      <div className='bg-indigo-600 py-2 sm:px-10 px-2 flex justify-between'>
        <button onClick={() => navigate('/dashboard')} className='text-lg font-semibold text-white'>Easy<span className='text-black font-bold'>Apply</span></button>
        <div>
          {(user.recruiter) && <button onClick={() => navigate('/recruiter')} className='text-white mr-3 text-sm font-semibold'>PostJob</button>}
          {(user.username) && <button onClick={() => navigate('/updateprofile')} className='bg-white w-7 h-7 rounded-full pb-2'>{user.username.slice(0, 1)}</button>}
        </div>
      </div>
    </div>
  )
}

export default Navbar
