import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { jobDetails } from '../features/jobSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [listOfJobs, setListOfJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const headers = {
        'Content-Type': 'application/json'
      };
      const response = await axios.get('http://localhost:5000/job/fetchjobs', { headers });
      setListOfJobs(response.data);
    };
    fetchJobs();
  }, []);

  const getDesiredJobs = async () => {
    setLoading((prev) => !prev);
    const response = await axios.post('http://localhost:5000/job/getdesiredjob', { query: query });
    console.log(response.data);
    setListOfJobs(response.data);
    setLoading((prev) => !prev);
  }

  const storeJobDescription = async (key) => {
    const filteredJob = listOfJobs.filter((_,i) => {
      console.log(i);
      if(i===key){
        return _;
      }
    });
    const { companyLogo,_id,postedBy,companyName,createdAt,jobRole,keySkills,location,jobDescription,Experience, salaryRange} = filteredJob[0];
    dispatch(jobDetails({companyLogo,_id,postedBy,companyName,createdAt,jobRole,keySkills,location,Experience, jobDescription, salaryRange}));
    navigate('/dashboard/jobdetails');
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='mx-1 flex items-center mt-5 justify-center w-[95%]'>
        <input type="text" onChange={(e) => setQuery(e.target.value)} className='border border-black w-full sm:w-[17rem] pl-2 py-1 rounded-md' placeholder='Search By Title, Skill, company' name="" id="" />
        <button className=' bg-emerald-400 py-1 px-1 rounded-md' onClick={getDesiredJobs}>Search</button>
      </div>
      <ul className='w-full'>
        {
          (loading) ? 'loading' : (listOfJobs.length>0) ? (listOfJobs?.map((job, i) => {
            return (
              <li key={i} onClick={() => storeJobDescription(i)} className='flex cursor-pointer mx-auto sm:w-[20rem] w-[95%] border-black border rounded-md my-2'>
                <p className='w-10 ml-1 mt-1 h-10 bg-black text-white border text-center pt-1'>{job.companyLogo.toUpperCase()}</p>
                <div className='ml-1'>
                  <p>{job.jobRole}</p>
                  <p>{job.companyName}</p>
                  <div><span>{job.location.slice(0, 1).toUpperCase() + job.location.slice(1, job.location.length)}</span><span className='text-sm font-semibold ml-2'>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span></div>
                </div>
              </li>
            )
          })) : <p className='text-center'>No jobs available</p>
        }
      </ul>
    </div>
  )
}

export default Dashboard
