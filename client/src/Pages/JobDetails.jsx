import React, { useEffect, useState } from 'react'
import { Login } from '../features/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import MyToastContainer from '../middleware/MyTostContainer';
import { showToast } from '../middleware/handleTostify';

const JobDetails = () => {
  const [disabled, setDisabled] = useState(false);
  const jobdetails = useSelector((state) => state.job.value);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkApplied = () => {
      if (user.appliedJob) {
        const check = user.appliedJob.find((id, i) => id === jobdetails._id);
        if (check) {
          setDisabled(true);
        }
      }
    }
    checkApplied();
  }, [])

  const applyJob = async () => {
    try{
      const headers = {
        'Content-Type': 'application/json',
        accesstoken: user.accesstoken,
        refreshtoken: user.refreshtoken,
      };
      const data = {
        jobId: jobdetails._id,
        postedBy: jobdetails.postedBy
      }
      const response = await axios.patch('http://localhost:5000/job/apply', data, { headers });
      if (response.data.accesstoken) {
        dispatch(Login({ accesstoken: response.data.accesstoken }));
      }
      console.log(response,response.data.err);
    }catch(err){
      if(err.response.data.err === "cantApply"){
        showToast('❌Cant apply', 'error');
      }
    }
  }
  return (
    <div className='sm:px-10 px-2'>
    <MyToastContainer />
      <p className='text-xl font-semibold'>{jobdetails.jobRole.slice(0, 1).toUpperCase() + jobdetails.jobRole.slice(1, jobdetails.jobRole.length)}</p>
      <p className='text-lg font-bold'>{jobdetails.companyName}</p>
      <div className='flex items-center'>
        <p className='font-semibold'>{jobdetails.location.toUpperCase()}</p>
        <button onClick={applyJob} disabled={disabled} className='bg-blue-600 text-white px-2 py-1 rounded-md'>{disabled ? 'Applied' : 'Apply'}</button>
      </div>
      <div>
        <p className='uppercase underline font-semibold'>Skills</p>
        <ul className='flex flex-wrap'>
          {
            jobdetails.keySkills.map((skill, i) => <p key={i} className='mr-1'>{skill}</p>)
          }
        </ul>
        <div>
          <p className='font-semibold'>Salary</p>
          <p>{jobdetails.salaryRange.min}-{jobdetails.salaryRange.max}LPA</p>
        </div>
        <div>
          <p className='font-semibold'>Experience</p>
          <p>{jobdetails.Experience.min}-{jobdetails.Experience.max}yrs</p>
        </div>
      </div>
      <p className='font-semibold'>Description-</p>
      <p>{jobdetails.jobDescription}</p>
      <p className='font-semibold'>{formatDistanceToNow(new Date(jobdetails.createdAt), { addSuffix: true })}</p>
    </div>
  )
}

export default JobDetails
