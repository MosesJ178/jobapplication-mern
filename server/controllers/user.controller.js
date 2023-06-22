import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { signAccessToken, signRefreshToken } from '../middleware/jwt.helpers.js';

const signup = async (req, res) => {
    const { username, password, email, company } = req.body;
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ "message": "userAlreadyExists" })
    if (!username || !password || !email) return res.status(400).json({ "message": "fillAllInputs" })
    try {
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ username, password: hashedPassword, email, company });
        return res.status(200).json({ user: user });// code red --> send selected user attributes
    }
    catch (err) {
        return res.status(400).json({ err: "errCreatingEmployee", details: err.message });
    }
}

const updateUserDetails = async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(req.user._id, { ...req.body }, { new: true });
        return res.status(200).json(
            (req.brandNewToken) ?
                { accesstoken: req.brandNewToken, updated } :
                { updated });
    } catch (err) {
        return res.status(400).json({ err: err });
    }
}

const details = async (req, res) => {
    const userDetails = await User.findById(req.user.id);
    return res.status(200).json(
        (req.brandNewToken) ?
            { accesstoken: req.brandNewToken, userDetails } :
            { userDetails });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ "message": "fillAllInputs" })
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ "message": "notLegitUser" })
        const legitUser = await bcrypt.compare(password, user.password);
        if (!legitUser) return res.status(400).json({ "message": "notLegitUser" });
        const accesstoken = await signAccessToken(user._id);
        const refreshtoken = await signRefreshToken(user._id);
        await User.findByIdAndUpdate(user._id, { accessToken: accesstoken, refreshToken: refreshtoken });
        return res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isRecruiter: user.recruiter,
            company: user.company,
            appliedJob:user.appliedJob,
            accesstoken: accesstoken,
            refreshtoken: refreshtoken,
        });
    }
    catch (err) {
        return res.status(400).json({ "message": "errDuringlogin" })
    }
}

const logout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.body.id, { accessToken: "", refreshToken: "" });
        return res.status(200).json({ success: 1 });
    }
    catch (err) {
        return res.status(400).json({ err: "errLogout" });
    }
}

export { login, logout, signup, updateUserDetails, details }