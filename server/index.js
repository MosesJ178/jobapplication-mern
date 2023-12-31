import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";
import { userroute } from "./routes/user.route.js"
import { jobroute } from "./routes/job.route.js"

dotenv.config();

const app = express();

app.use(cors({
    origin: 'https://jobapplication-mern.netlify.app',
    credentials: true
}));

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