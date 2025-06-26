import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function CourseCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    
    // Frontend validation
    if (!title || !description || !price || !image) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;
    if (!token) {
      toast.error("Please login as admin");
      navigate("/admin/login");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/course/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Explicitly set content type
          },
          withCredentials: true,
        }
      );
      
      console.log(response.data);
      toast.success(response.data.message || "Course created successfully");
      navigate("/admin/our-courses");
      
      // Clear form
      setTitle("");
      setPrice("");
      setImage("");
      setDescription("");
      setImagePreview("");
      
    } catch (error) {
      console.error("Error creating course:", error);
      
      // Fixed error handling - check for different error response structures
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.errors || 
        error.response?.data?.message ||
        error.message ||
        "Failed to create course";
        
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="min-h-screen py-10">
        <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-2xl bg-gray-50">
          <h3 className="text-2xl font-semibold mb-8"><span className="text-violet-400">Create Course</span>  </h3>

          <form onSubmit={handleCreateCourse} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg">Title</label>
              <input
                type="text"
                placeholder="Enter your course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Description</label>
              <textarea
                placeholder="Enter your course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
                rows="4"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Price</label>
              <input
                type="number"
                placeholder="Enter your course price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-violet-400 text-lg">Create Course</label>


              <div className="flex items-center justify-center">
                <img
                  src={imagePreview || "/imgPL.webp"}
                  alt="Course preview"
                  className="w-full max-w-sm h-auto rounded-md object-cover"
                />
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={changePhotoHandler}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-violet-600 hover:bg-black text-white rounded-md transition-colors duration-200"
            >
              Create Course
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CourseCreate;