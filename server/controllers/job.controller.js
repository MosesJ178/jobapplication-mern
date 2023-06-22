import mongoose from "mongoose";
import Job from "../models/job.description.model.js"
import Keyword from "../models/keyword.model.js"
import User from "../models/user.model.js";

const postjob = async (req, res) => {
    try {
        const { _id } = await Job.create({ postedBy: req.user._id, ...req.body });
        const updatedJobList = await User.findByIdAndUpdate(req.user._id, { $push: { postedJob: _id } }, { new: true });
        const checkDocExists = await Keyword.find({});
        if(checkDocExists.length==0){
            await Keyword.create({keywords:[req.body.jobRole.toLowerCase()]});
        }else{
            await Keyword.findByIdAndUpdate(checkDocExists[0]._id,{$push:{keywords:req.body.jobRole.toLowerCase()}});
        }
        if (!updatedJobList) {
            return res.status(400).json({ err: "errAddingJobIdUser" });
        }
        return res.status(200).json(
            (req.brandNewToken) ?
                { accesstoken: req.brandNewToken, _id } : { _id })
    } catch (err) {
        return res.status(400).json({ err: err });
    }
}


const applyJob = async (req, res) => {
    const id1 = new mongoose.Types.ObjectId(req.user._id);
    const id2 = new mongoose.Types.ObjectId(req.body.postedBy);
    const id1String = id1.toString();
    const id2String = id2.toString();
    try {
        if (id1String  === id2String) {
            return res.status(400).json((req.brandNewToken) ? { accesstoken: req.brandNewToken, err: "cantApply" } : { err: "cantApply" });
        } else {
            await User.findByIdAndUpdate(req.user._id, { $push: { appliedJob: req.body.jobId } }, { new: true });
            const { _id } = await Job.findByIdAndUpdate(req.body.jobId, { $push: { applicants: req.user._id } });
            return res.status(200).json((req.brandNewToken) ?
                { accesstoken: req.brandNewToken, success: _id } : { success: _id });
        }
    } catch (err) {
        return res.status(400).json({ err: errWhileApplyingJob })
    }
}

const searchJob = async (req, res) => {
    const searchValue = req.query.q;
    const keywords = await Keyword.find({});
    // console.log(keywords[0].keywords.filter((keyword) => keyword.toLowerCase().includes(searchValue)).sort());
}

const getIndividualPostedJob = async (req, res) => {
    try{
        const id = new mongoose.Types.ObjectId(req.user.id);
        // const listOfJobsPosted = await Job.find({postedBy:id}).sort({ _id: -1 });
        const listOfJobsPosted2 = await Job.aggregate([
            { $match: { postedBy: id } },
            {
              $lookup: {
                from: 'users',
                localField: 'applicants',
                foreignField: '_id',
                as: 'applicantdetails'
              }
            },
            { $sort: { _id: -1 } }
          ]);
        return res.status(200).json((req.brandNewToken) ?
        { accesstoken: req.brandNewToken, listOfJobsPosted2 } : { listOfJobsPosted2 });
    }catch(err){
        console.log(err);
        return res.status(400).json({err:err});
    }
}

const fetchJobs = async (req, res) => {
    try{
        const listOfJobs = await Job.find({});
        return res.status(200).json(listOfJobs);
    }catch(err){
        return res.status(400).json({err:err});
    }
}

const getdesiredjobs = async (req, res) => {
    try{
        const keyword = req.body.query;
        const regex = new RegExp(keyword, 'i');
        const searchedJobs = await Job.find(
            {
                $or: [
                  { jobRole: { $regex: regex } },
                  { jobDescription: { $regex: regex } },
                  { keySkills: { $regex: regex } }
                ]
            }
        );
        return res.status(200).json(searchedJobs);
    }catch(err){
        console.log(err);
        return res.status(400).json({err:err});
    }
}

const fetchAppliedJobs = async (req,res) => {
    try{
        const appliedJobData = await Job.find({ _id: { $in: req.body.appliedJob } });
        return res.status(200).json((req.brandNewToken) ?
        { accesstoken: req.brandNewToken, appliedJobData } : { appliedJobData });
    }catch(err){
        return res.status(400).json({err:err}); 
    }
}

export { postjob, applyJob, searchJob, getIndividualPostedJob, fetchJobs, getdesiredjobs, fetchAppliedJobs }