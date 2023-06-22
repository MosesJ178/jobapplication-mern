import mongoose from "mongoose";

const jobmodel = new mongoose.Schema({
    companyLogo:String,
    jobRole:String,
    companyName:String,
    location:String,
    Experience:{
        min:Number,
        max:Number
    },
    salaryRange:{
        min:Number,
        max:Number
    },
    postedDate:{
        type: Date,
        default: Date.now
    },
    applicants:[{
        type:mongoose.Types.ObjectId
    }],
    jobDescription:String,
    keySkills:[String],
    closed:{
        type:Boolean,
        default:false
    },
    postedBy:{
        type:mongoose.Types.ObjectId
    }
},{timestamps:true})

const Job = mongoose.model("Job",jobmodel);

export default Job;