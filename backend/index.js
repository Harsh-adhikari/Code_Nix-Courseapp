import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js"
import orderParser from "./routes/order.route.js";

import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

//middleware
app.use(express.json()); //we use express.json becuz we are using data in json format like we sending data in routes or data come from routes in json fromat so we need to parse the data in json format so that we can extract the data from it
app.use(cookieParser()); //parse cookies from the HTTP request headers. and when you logout the cookie parser will remove the cookie so logout
app.use(
  fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp/",
})
);

// we using cors for frontend and backend because in frontend has different port and backend has different port so we using cors (to resolve port error) and Axios (to fetch the data from backend)
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, // it is true to handle cookies , the token we send for authorization it will allow token 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))
const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI


try {
  await mongoose.connect(DB_URI)
    console.log("Connected to MongoDB")
}catch (error){
    console.log(error)
}

//define basic route
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderParser);

// Configuration
cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret,
});


app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
});