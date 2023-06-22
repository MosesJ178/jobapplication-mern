import React from 'react'
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import Authentication from './Pages/Authentication';
import UpdateProfile from './Pages/UpdateProfile';
import Recruiter from './Pages/Recruiter';
import JobPostForm from './components/JobPostForm';
import PastPostedJob from './components/PastPostedJob';
import Navbar from './components/Navbar';
import Dashboard from './Pages/Dashboard';
import JobDetails from './Pages/JobDetails';

const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <div>
          <Routes>
            <Route path='/' element={<Authentication />} />
            <Route path='/updateprofile' element={<UpdateProfile />} />
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/dashboard/jobdetails' element={<JobDetails/>}/>
            <Route path='recruiter' element={<Recruiter />}>
              <Route index element={<JobPostForm />} />
              <Route path='postjob' element={<JobPostForm />} />
              <Route path='viewpostedjob' element={<PastPostedJob />} />
            </Route>
            <Route path='*' element={<p>Page Not Found</p>} />
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default App
