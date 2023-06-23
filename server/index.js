import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";
import { userroute } from "./routes/user.route.js"
import { jobroute } from "./routes/job.route.js"

dotenv.config();

const app = express();

app.use(cors({
    origin: ['https://64952fd4efda0b3e4b922058--heartfelt-squirrel-04c1f1.netlify.app/','https://jobapplication-fullstack.vercel.app', 'https://6494afb3b9b2570997a168fe--inspiring-pavlova-48c111.netlify.app'],
    credentials: true
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://64952fd4efda0b3e4b922058--heartfelt-squirrel-04c1f1.netlify.app/');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: false }));

app.use('/user', userroute);
app.use('/job', jobroute);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("db connection is sucessfull");
    }
    catch (err) {
        console.log("err while connectin to db", err);
    }
}

connectDB()
    .then(() => {
        app.listen(process.env.PORT_NO, () => {
            console.log(`server is running on port ${process.env.PORT_NO}`);
        })
    })
    .catch((err) => {
        console.log(err.message);
    })