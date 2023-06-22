import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Login } from '../features/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

const PastPostedJob = () => {
  const [listOfPostedData, setListOfPostedData] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [view, setView] = useState({});
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const headers = {
        'Content-Type': 'application/json',
        accesstoken: user.accesstoken,
        refreshtoken: user.refreshtoken,
      };
      const data = { id: user.id };
      const response = await axios.post('https://jobapplication-app.onrender.com/job/fetchjobposted', data, { headers });
      // const response = await api.get('/job/fetchjobposted', data, { headers} );
      setListOfPostedData(response.data.listOfJobsPosted2);
      if (response.data.accesstoken) {
        dispatch(Login({ accesstoken: response.data.accesstoken }));
      }
    };
    fetchUserDetails();
  }, []);

  const toggleView = (jobId) => {
    setView((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  return (
    <ul>
      {listOfPostedData?.map((job, i) => {
        return (
          <li key={i} className='border border-black my-2 mx-2 rounded-md'>
            <p>{job.jobRole}</p>
            <p>{job.location}</p>
            <div className='flex'>
              <p>applicants-{job.applicants.length}</p>
              <button className='bg-indigo-500 px-1 py-[0.1rem] text-white rounded-md' onClick={() => toggleView(job._id)}>view</button>
            </div>
            {view[job._id] && (
              <ul>
                {job.applicantdetails.length > 0 ? (
                  job.applicantdetails.map((applicant, i) => {
                    return <li key={i} onClick={() => { setShowProfile((prev) => !prev); setUserDetail(applicant) }} className='hover:cursor-pointer'>{applicant.username}</li>;
                  })
                ) : (
                  <li>no more applicants</li>
                )}
              </ul>
            )}
          </li>
        );
      })}
      {(showProfile) && (
        <div className='absolute top-0 left-0 min-h-screen w-full bg-black/40 text-white'>
          {
            <div className='flex justify-center mt-[10rem] items-center'>
              <div className='bg-indigo-500 text-sm py-5 px-5'>
                <p><span className='underline'>Candidate Name</span> - {userDetail.username}</p>
                <p><span className='underline'>Email Id</span> - {userDetail.email}</p>
                <div className='flex'><span className='underline'>Skills</span>-{(userDetail.keySkills.length > 0) ? (userDetail.keySkills.map((skill, i) => <p key={i}>{skill}</p>)) : <p>Not Mentioned</p>}</div>
              </div>
            </div>
          }
          <button onClick={() => setShowProfile((prev) => !prev)} className='absolute top-5 right-5 text-2xl text-red-500 font-bold'>X</button>
        </div>
      )}
    </ul>
  );
};

export default PastPostedJob;