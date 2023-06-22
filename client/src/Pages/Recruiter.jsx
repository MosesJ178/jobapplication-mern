import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import '../index.css';

const Recruiter = () => {
  return (
    <div>
      <nav className='bg-indigo-100 sm:px-10 px-2 flex justify-center'>
        <NavLink to='/recruiter/postjob' className='mr-2'>PostJob</NavLink>
        <NavLink to='/recruiter/viewpostedjob'>Posted Job</NavLink>
      </nav>
      <Outlet />
    </div>
  )
}

export default Recruiter
