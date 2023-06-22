import React, { useEffect, useState } from 'react'
import { Login } from '../features/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import api from '../api/api';

const PastAppliedJob = () => {
  const [appliedJob, setAppliedJob] = useState([]);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      console.log("2");
      const headers = {
        'Content-Type': 'application/json',
        accesstoken: user.accesstoken,
        refreshtoken: user.refreshtoken,
      };
      const data = {
        appliedJob: user.appliedJob
      };
      console.log(data);
      if (data.appliedJob.length > 0) {
        const response = await api.post('/job/fetchappliedjobs', data, { headers });
        setAppliedJob(response.data.appliedJobData);
        console.log(response);
        if (response.data.accesstoken) {
          dispatch(Login({ accesstoken: response.data.accesstoken }));
        }
      }else{
        console.log("no data")
      }
    }
    fetchAppliedJobs();
  }, [])
  console.log("exe");
  return (
    <ul>
      {appliedJob.length > 0 ? (
        appliedJob.map((job, i) => (
          <li
            key={i}
            onClick={() => storeJobDescription(i)}
            className="flex cursor-pointer mx-auto sm:w-[20rem] w-[95%] border-black border rounded-md my-2"
          >
            <p className="w-10 ml-1 mt-1 h-10 bg-black text-white border text-center pt-1">
              {job.companyLogo.toUpperCase()}
            </p>
            <div className="ml-1">
              <p>{job.jobRole}</p>
              <p>{job.companyName}</p>
              <p>{job.location}</p>
            </div>
          </li>
        ))
      ) : (
        <p>0 Applied Jobs</p>
      )}
    </ul>
  )
}

export default PastAppliedJob
