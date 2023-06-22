import express from "express";
import { login, logout, signup, updateUserDetails, details } from "../controllers/user.controller.js";
import { verifyAccessToken } from "../middleware/jwt.helpers.js";

const userroute = express.Router();

userroute.post('/signup',signup);
userroute.patch('/updatedetails',verifyAccessToken,updateUserDetails);
userroute.post('/login',login);
userroute.post('/logout',logout);
userroute.get('/details',verifyAccessToken,details);

export {userroute}