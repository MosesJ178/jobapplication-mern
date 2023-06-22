import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../api/api';
import { Login, updateField } from '../features/userSlice';
import { Updateprofile } from '../features/profileSlice';
import PastAppliedJob from '../components/PastAppliedJob';

const UpdateProfile = () => {
  const user = useSelector((state) => state.user.value);
  const profile = useSelector((state) => state.profile.value);
  const [skills, setSkills] = useState([...profile.keySkills]);
  const [appliedJobs,setAppliedJobs] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [data, setData] = useState(profile);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const headers = {
        'Content-Type': 'application/json',
        accesstoken: user.accesstoken,
        refreshtoken: user.refreshtoken,
      };
      const data = user.id;
      const response = await api.get('/user/details', { headers, data });
      if (response.data.accesstoken) {
        dispatch(Login({ accesstoken: response.data.accesstoken }));
        dispatch(Updateprofile({ ...response.data.userDetails }));
      } else {
        dispatch(Updateprofile({ ...response.data.userDetails }));
      }
      setData({...response.data.userDetails});
    };
    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    setNewSkill(e.target.value);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== '') {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const handleUpdateProfile = async () => {
    const updatedProfile = { ...data, keySkills: skills };
    if(user.recruiter!==data.recruiter){
      dispatch(updateField({recruiter:data.recruiter}));
    }
    const headers = {
      'Content-Type': 'application/json',
      accesstoken: user.accesstoken,
      refreshtoken: user.refreshtoken,
    };
    const response = await api.patch('/user/updatedetails',updatedProfile,{ headers });
    if (response.data.accesstoken) {
      dispatch(Login({ accesstoken: response.data.accesstoken }));
      dispatch(Updateprofile({ ...response.data.updated }));
    } else {
      dispatch(Updateprofile({ ...response.data.updated }));
    }
  };

  const handleProfileChange = (e) => {
    if (e.target.type === 'radio' && e.target.name === 'recruiter') {
      const parsedValue = e.target.value === 'true' ? true : false;
      setData((prev) => ({ ...prev, [e.target.name]: parsedValue }));
    }else{
      setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };


  return (
    <div>
      <h2 className='text-center text-xl font-semibold'>Profile</h2>
      <div className='flex items-center justify-center'>
        <div className='w-full flex flex-col justify-center'>
          <input
            placeholder='username'
            value={data?.username}
            name='username'
            type='text'
            className='border mb-2 sm:w-[20rem] sm:mx-auto w-full border-black rounded-md pl-1'
            onChange={handleProfileChange}
          />
          <input
            placeholder='Email'
            value={data?.email}
            name='email'
            type='text'
            className='border mb-2 sm:w-[20rem] sm:mx-auto w-full border-black rounded-md pl-1'
            onChange={handleProfileChange}
          />
          <input
            placeholder='PhoneNumber'
            value={data?.phoneNumber === 0 ? '' : data.phoneNumber}
            name='phoneNumber'
            type='text'
            className='border mb-2 sm:w-[20rem] sm:mx-auto w-full border-black rounded-md pl-1'
            onChange={handleProfileChange}
          />
          <input
            placeholder='Company'
            value={data?.company}
            name='company'
            type='text'
            className='border mb-2 sm:w-[20rem] sm:mx-auto w-full border-black rounded-md pl-1'
            onChange={handleProfileChange}
          />
          <input onChange={handleProfileChange} placeholder='Location' value={data?.location} name="location" type="text" className='border mb-2 sm:w-[20rem] sm:mx-auto w-full border-black rounded-md pl-1' />
          <div className='mx-auto sm:w-[20rem] w-full'>
            <h2>Skill List</h2>
            <input
              type='text'
              value={newSkill}
              className='border border-black rounded-md pl-1'
              onChange={handleInputChange}
              placeholder='Enter a skill'
            />
            <button className='bg-green-500 px-2 rounded-md' onClick={handleAddSkill}>Add</button>
            <ul>
              {skills.map((skill, index) => (
                <li key={index}>
                  {skill}
                  <button onClick={() => handleRemoveSkill(index)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
          <div className='mx-auto'>
            <input onChange={handleProfileChange} type="radio" checked={data?.employmentType === 'full'} name="employmentType" value="full" />
            <label>Full Time</label>
            <input onChange={handleProfileChange} type="radio" checked={data?.employmentType === 'intern'} name="employmentType" value="intern" />
            <label>Intern</label>
          </div>
          <div className='mx-auto'>
            <input onChange={handleProfileChange} type="radio" checked={data?.roleType === 'fresher'} name="roleType" value="fresher" />
            <label>fresher</label>
            <input onChange={handleProfileChange} type="radio" checked={data?.roleType === 'senior'} name="roleType" value="senior" />
            <label>Senior</label>
          </div>
          <div className='mx-auto'>
            <input onChange={handleProfileChange} type="radio" name="recruiter" checked={data?.recruiter === false} value="false" />
            <label>Candidate</label>
            <input onChange={handleProfileChange} type="radio" name="recruiter" checked={data?.recruiter === true} value="true" />
            <label>Recruiter</label>
          </div>
          <button
            className='bg-indigo-600 text-white py-2 rounded-md'
            onClick={handleUpdateProfile}
          >
            Update Profile
          </button>
        </div>
      </div>
      <div className='flex justify-center items-center flex-col mt-3'>
        <button onClick={() => setAppliedJobs((prev) => !prev)} className='bg-green-400 px-3 py-1 rounded-lg'>View Applied Jobs </button>
        {appliedJobs && <PastAppliedJob/>}
      </div>
    </div>
  );
};

export default UpdateProfile;
