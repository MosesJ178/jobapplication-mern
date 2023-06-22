import React,{ useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import api from '../api/api';
import { Login } from '../features/userSlice';

const JobPostForm = () => {
  const [skills, setSkills] = useState([]);
  const { register, handleSubmit, reset  } = useForm();
  const [newSkill, setNewSkill] = useState('');
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
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
  const resetForm = () => {
    setSkills([]);
    setNewSkill('');
    // Reset the values of all other form fields using the `reset` function from react-hook-form
    reset();
  };
  const onSubmit  = async (data) => {
    const jobData = {
      companyLogo:data.companyName.charAt(0),
      jobRole: data.jobRole,
      companyName: data.companyName,
      location: data.Location,
      Experience: {
        min: parseInt(data.salmin),
        max: parseInt(data.salmax),
      },
      salaryRange: {
        min: parseInt(data.expmin),
        max: parseInt(data.expmax),
      },
      jobDescription: data.jobDescription,
      keySkills: skills,
    };
    const headers = {
      'Content-Type': 'application/json',
      accesstoken: user.accesstoken,
      refreshtoken: user.refreshtoken,
    };
    const response = await api.post('/job',jobData,{ headers });
    if (response.data.accesstoken) {
      dispatch(Login({ accesstoken: response.data.accesstoken }));
    }
    resetForm();
    console.log(response.data);
  }
  return (
    <div>
      <form className='flex flex-col sm:px-10 px-2' onSubmit={handleSubmit(onSubmit)}>
        <label className='font-semibold'>Job Role</label>
        <input {...register("jobRole",{ required: true })} type="text" name="jobRole" className='border border-black pl-2 rounded-md' placeholder='jobRole' id="" />
        <label className='font-semibold'>Company Name</label>
        <input {...register("companyName",{ required: true })} type="text" name="companyName" className='border border-black pl-2 rounded-md' placeholder='CompanyName' id="" />
        <label className='font-semibold'>Location</label>
        <input {...register("Location",{ required: true })} type="text" name="Location" className='border border-black pl-2 rounded-md' placeholder='Enter Location' id="" />
        <div className=''>
          <p className='font-semibold'>Experience</p>
          <label>min</label>
          <input {...register("expmin",{required:true})} type="number" className='border rounded-md border-black text-center w-20' name="expmin" placeholder='' id="" />
          <label>max</label>
          <input {...register("expmax",{required:true})} type="number" className='border rounded-md border-black text-center w-20' name="expmax" placeholder='' id="" />
        </div>
        <div className=''>
          <p className='font-semibold'>Salary Range</p>
          <label>min</label>
          <input {...register("salmin",{ required: true })} type="number" className='border rounded-md border-black text-center w-20' name="salmin" placeholder='' id="" />
          <label>max</label>
          <input {...register("salmax",{ required: true })} type="number" className='border rounded-md border-black text-center w-20' name="salmax" placeholder='' id="" />
        </div>
        <div>
            <h2 className='font-semibold'>Skill List</h2>
            <ul>
              {skills.map((skill, index) => (
                <li key={index}>
                  {skill}
                  <button type='button' onClick={() => handleRemoveSkill(index)}>Remove</button>
                </li>
              ))}
            </ul>
            <input
              type='text'
              value={newSkill}
              onChange={handleInputChange}
              placeholder='Enter a skill'
              className='border border-black rounded-md mb-2'
            />
            <button type='button' onClick={handleAddSkill}>Add</button>
          </div>
        <textarea {...register("jobDescription",{ required: true })} name="jobDescription" placeholder='describe job' className='border border-black rounded-md' cols="30" rows="10"></textarea>
        <input type="submit" value="Post Job" className='bg-indigo-500 hover:bg-indigo-400 cursor-pointer py-1 rounded-md mt-2' />
      </form>
    </div>
  )
}

export default JobPostForm