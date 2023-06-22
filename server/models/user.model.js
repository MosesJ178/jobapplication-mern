import mongoose from "mongoose";

const usermodel = new mongoose.Schema({
    username:String,
    email:String,
    phoneNumber:Number,
    password:String,
    company:String,
    recruiter:{
        type:Boolean,
        default:false
    },
    employmentType:{
        type:String,
        enum:['full','intern']
    },
    roleType:{
        type:String,
        enum:['fresher','senior']
    },
    keySkills:[String],
    location:String,
    appliedJob:[{
        type:mongoose.Types.ObjectId
    }],
    postedJob:[{
        type:mongoose.Types.ObjectId
    }],
    accessToken:String,
    refreshToken:String
})

const User = mongoose.model("User",usermodel);

export default User;