import express from 'express';
import { createCourse, deleteCourse, getCourse, updateCourse, courseDetails, buyCourses } from '../controllers/course.controller.js';
import userMiddleware from '../middlewares/user.mid.js';
import adminMiddleware from '../middlewares/admin.mid.js';
const router = express.Router() //Using a router enables smooth navigation and URL-based page means we can declare multiple routes in one file  rendering in single-page applications 

router.post("/create", adminMiddleware, createCourse);
router.put("/update/:courseId", adminMiddleware, updateCourse);
router.delete("/delete/:courseId", adminMiddleware, deleteCourse);
router.get("/courses", getCourse);
router.get("/:courseId", courseDetails);

// When the user buy the course it will go the user.mid.js becuz of middleware 
router.post("/buy/:courseId", userMiddleware, buyCourses)
export default router;
