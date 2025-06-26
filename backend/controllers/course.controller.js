import { Course } from "../models/course.model.js";
import cloudinary from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";

export const createCourse = async (req, res) => { //the input we take form req and output we give from res  
  const adminId = req.adminId
  const { title, description, price } = req.body; // req.body is used to access the data sent in the request body from route that u send fom postman 
  console.log(title, description, price);

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ error: "All fields are required" })
    }
    const { image } = req.files;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const allowedFormat = ["image/png", "image/jpeg"] //this means only png and jpg format are allowed 
    if (!allowedFormat.includes(image.mimetype)) {
      return res.status(400).json({ error: "Invalid file format. Only PNG and JPG are allowed " });
    }

    //claudinay code
    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
    if (!cloud_response || cloud_response.error) {
      return res.status(400).json({ error: "Error uploading file to cloudinary" });
    }

    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.secure_url,
      },
      creatorId: adminId
    };

    const course = await Course.create(courseData);
    res.json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating course" });
  }
};

export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price } = req.body;
  
  try {
    // Check if course exists
    const courseSearch = await Course.findById(courseId);
    if (!courseSearch) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if the admin is the creator of the course
    if (courseSearch.creatorId.toString() !== adminId.toString()) {
      return res.status(403).json({ error: "You are not authorized to update this course" });
    }

    // Prepare update data
    const updateData = {
      title,
      description,
      price,
    };

    // Handle image upload if provided
    if (req.files && req.files.image) {
      const { image } = req.files;
      
      // Validate image format
      const allowedFormat = ["image/png", "image/jpeg"];
      if (!allowedFormat.includes(image.mimetype)) {
        return res.status(400).json({ error: "Invalid file format. Only PNG and JPG are allowed" });
      }

      // Upload to cloudinary
      const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
      if (!cloud_response || cloud_response.error) {
        return res.status(400).json({ error: "Error uploading file to cloudinary" });
      }

      // Update image data
      updateData.image = {
        public_id: cloud_response.public_id,
        url: cloud_response.secure_url,
      };

      // Optional: Delete old image from cloudinary
      if (courseSearch.image && courseSearch.image.public_id) {
        try {
          await cloudinary.uploader.destroy(courseSearch.image.public_id);
        } catch (deleteError) {
          console.log("Error deleting old image:", deleteError);
          // Don't fail the update if old image deletion fails
        }
      }
    }

    // Update the course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validators
      }
    );

    res.status(200).json({ 
      message: "Course updated successfully", 
      course: updatedCourse 
    });
    
  } catch (error) {
    console.log("Error in course updating:", error);
    res.status(500).json({ error: "Error in course updating" });
  }
};


export const deleteCourse = async (req, res) => {
  const adminId = req.adminId
  const { courseId } = req.params; // req.params is used to access the parameters in the URL of the request
  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });
    if (!course) {
      return res.status(404).json({ error: "can't delete, created by other admin" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in course deleting" });
    console.log("Error in course deleting", error);
  }
}

export const getCourse = async (req, res) => {
  try {
    const courses = await Course.find({})
    res.status(201).json({ courses })
  } catch (error) {
    res.status(500).json({ errors: "Error in getting courses" })
    console.log("error to get courses", error);
  }
}

export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ course })
  } catch (error) {
    res.status(500).json({ errors: "Error in getting course details" });
    console.log("Error is course details", error);
  }
}

import Stripe from "stripe";
import config from "../config.js";
const stripe = new Stripe(config.STRIPE_SECRET_KEY);
console.log(config.STRIPE_SECRET_KEY);

export const buyCourses = async (req, res) => {

  const { userId } = req;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }
    const existingPurchase = await Purchase.findOne({ userId, courseId })
    if (existingPurchase) {
      return res.status(400).json({ errors: "User has already purchased this course" });
    }
    
    //Payment Gateway Code 
    // Stripe payment code goes here!!
    const amount=course.price;
    const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types:["card"]
  });



    res.status(201).json({ 
      message: "Course purchased successfully", 
      course,
       clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ errors: "Error in course buying" });
    console.log("error in course buying ", error)
  }
};

