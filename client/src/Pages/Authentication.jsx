import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useSelector, useDispatch } from 'react-redux'
import { Login } from '../features/userSlice';
import { useNavigate } from "react-router-dom"
import MyToastContainer from '../middleware/MyTostContainer';
import { showToast } from '../middleware/handleTostify';

const Authentication = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, setLogin] = useState(true);
  const initialCredentials = login ? { email: '', password: '' } : { username: '', email: '', password: '' };
  const [credentials, setCredentials] = useState(initialCredentials);

  useEffect(() => {
    setCredentials(initialCredentials);
  }, [login]);


  const handleInputChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const endpoint = login ? '/user/login' : '/user/signup';
      const response = await api.post(endpoint, credentials);
      const { _id, username, email, isRecruiter, accesstoken, appliedJob, refreshtoken } = response.data;
      setCredentials(initialCredentials);
      if (login) {
        showToast('✅Login Success', 'success');
        dispatch(Login({ id: _id, username, email, recruiter: isRecruiter, appliedJob, accesstoken, refreshtoken }));
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 900);
      }
    } catch (err) {
      console.log(err);
      showToast('❌Something went wrong', 'error');
    }
  }
  return (
    <div className='flex flex-col justify-center items-center'>
      <MyToastContainer />
      <h2 className='text-lg uppercase font-semibold mb-5 mt-[8rem] underline'>{!login ? 'Sign Up' : 'Login'}</h2>
      {!login && (
        <input
          value={credentials.username || ''}
          onChange={handleInputChange}
          type="text"
          className='border my-2 w-[17rem] py-1 pl-1 rounded-md border-black'
          placeholder='Enter UserName'
          name="username"
        />
      )}
      <input
        value={credentials.email}
        onChange={handleInputChange}
        type="text"
        className='border my-2 w-[17rem] py-1 pl-1 rounded-md border-black'
        placeholder='Enter your Email'
        name="email"
      />
      <input
        value={credentials.password}
        onChange={handleInputChange}
        type="password"
        className='border my-2 w-[17rem] py-1 pl-1 rounded-md border-black'
        placeholder='Enter your Password'
        name="password"
      />
      <button onClick={handleSubmit} className='text-lg w-[17rem] bg-indigo-500 mt-2 text-white rounded-md py-1 hover:bg-indigo-600'>Submit</button>
      <button onClick={() => setLogin((prev) => !prev)} className='text-sm outline-none text-blue-600 hover:text-blue-700 hover:font-semibold'>
        {login ? 'Sign Up' : 'Login'}
      </button>
    </div>
  );
};

export default Authentication;