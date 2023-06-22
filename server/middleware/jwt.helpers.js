import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


const signAccessToken = async (id) => {
    try {
        const token = await jwt.sign({ id: id }, process.env.ACCESS_SECRET_KEY, { expiresIn: '20s' });
        return token;
    }
    catch (err) {
        return err.message;
    }
}

const signRefreshToken = async (id) => {
    try {
        const token = await jwt.sign({ id: id }, process.env.REFRESH_SECRET_KEY, { expiresIn: '1y' });
        return token;
    }
    catch (err) {
        return err.message;
    }
}

const verifyAccessToken = async (req, res, next) => {
    const {accesstoken,refreshtoken} = req.headers;
    if (!accesstoken) return res.status(400).json({ err: "no token" });
    try {
        const accessTokenVerify = await jwt.verify(accesstoken, process.env.ACCESS_SECRET_KEY);
        const legitUser = await User.findById(accessTokenVerify.id);//user info
        if (!legitUser) return res.status(400).json({ err: "unauthotized user" });//not valid user id in token
        req.user = legitUser;
        next();
    }
    catch (err) {
        if (err.name == "TokenExpiredError") {//TokenExpiredError
            if (!refreshtoken) return res.status(400).json({ err: "no refresh token" });//no refresh token throw err
            const refreshTokenVerify = await jwt.verify(refreshtoken, process.env.REFRESH_SECRET_KEY);
            const legitUser = await User.findById(refreshTokenVerify.id);//user info
            if(!legitUser){
                return res.status(400).json({err:"notLegitUser"});
            }
            req.user = legitUser;
            if (legitUser.accessToken === accesstoken) {
                const brandNewToken = await signAccessToken(legitUser._id);
                await User.findByIdAndUpdate({ _id: legitUser._id }, { accessToken: brandNewToken },{new:true});
                req.brandNewToken = brandNewToken;
                next();
            }
        }
        else {//JsonWebTokenError
            return res.status(400).json({ err: "unauthotized user" });
        }
    }
}


export { signAccessToken, signRefreshToken, verifyAccessToken }