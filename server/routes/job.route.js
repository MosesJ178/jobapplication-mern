import express from "express";
import { verifyAccessToken } from "../middleware/jwt.helpers.js";
import { postjob, applyJob, searchJob, getIndividualPostedJob, fetchJobs, getdesiredjobs, fetchAppliedJobs } from "../controllers/job.controller.js"

const jobroute = express.Router();

jobroute.post('/',verifyAccessToken,postjob);
jobroute.patch('/apply',verifyAccessToken,applyJob);
jobroute.get('/search',searchJob);
jobroute.post('/fetchjobposted',verifyAccessToken,getIndividualPostedJob);
jobroute.get('/fetchjobs',fetchJobs);
jobroute.post('/getdesiredjob',getdesiredjobs);
jobroute.post('/fetchappliedjobs',verifyAccessToken,fetchAppliedJobs);

export { jobroute }