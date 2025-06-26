import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from "../../public/logo1.png";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import Slider from "react-slick";
import { BACKEND_URL } from "../utils/utils";

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle Logout - FIXED VERSION
  const handleLogout = async () => {
    try {
      // First, clear localStorage and update state immediately
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      
      // Then make the API call
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      
      toast.success(response.data.message || "Logged out successfully");
      
    } catch (error) {
      console.log("Error in logging out ", error);
      // Even if API fails, we've already logged out on frontend
      toast.success("Logged out successfully");
      
      // Ensure we're logged out on frontend even if backend call fails
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    }
  };

  //Fetching courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/course/courses`,
          {
            withCredentials: true
          }
        )
        console.log(response.data.courses);
        setCourses(response.data.courses);
      } catch (error) {
        console.log("error is fetchCourses ", error)
      }
    };
    fetchCourses();
  }, []);

  // Check login status - IMPROVED VERSION
  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem("user");
      console.log("Checking login status, user in localStorage:", user); // Debug log
      
      if (user && user !== "undefined" && user !== "null") {
        try {
          // Try to parse the user data to ensure it's valid
          const parsedUser = JSON.parse(user);
          if (parsedUser && parsedUser.token) { // Adjust based on your user object structure
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            localStorage.removeItem("user"); // Clean up invalid data
          }
        } catch (error) {
          console.log("Error parsing user data:", error);
          setIsLoggedIn(false);
          localStorage.removeItem("user"); // Clean up invalid data
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    // Listen for storage changes
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // Debug effect to monitor state changes
  useEffect(() => {
    console.log("isLoggedIn state changed to:", isLoggedIn);
  }, [isLoggedIn]);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="h-[1250px] md:h-[1050px] text-white container mx-auto">

        {/* Header */}
        <header className="flex item-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="" className="w-16 h-14 rounded-full" />
            <h1 className="text-2xl font-bold">
              <span className="text-violet-400">Code</span>
              <span className="text-white">Nix</span>
            </h1>
          </div>
          <div className="space-x-4">
            {/* Debug: Show current login status */}
            {console.log("Rendering header, isLoggedIn:", isLoggedIn)}
            
            {isLoggedIn ? (
              <>
                <button onClick={handleLogout}
                  className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-red-600 transition duration-300"
                >
                  Logout
                </button>
                <Link
                  to={"/courses"}
                  className="bg-violet-600 text-white py-3 px-4 rounded hover:bg-black transition duration-300"
                >
                  Join now
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-violet-600 transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-violet-600 transition duration-300"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Main section */}
        <section className="text-center py-20">
          <h1 className="text-2xl font-bold">
            <span className="text-violet-400">Code</span>
            <span className="text-white">Nix</span>
          </h1>
          <br />
          <p className="text-gray-500 hover:text-black transition-colors duration-100">From skilled to exceptional—guided by the best in the field.</p>
          <div className="space-x-4 mt-8">
            <Link to={"/courses"} className="bg-violet-500 text-white py-3 px-6 rounded font-semibold hover:bg-black duration-300 hover:text-white">
              Explore courses
            </Link>
            <Link to={"https://www.edx.org/courses?q=free+online+courses"} className="bg-white text-black py-3 px-6 rounded font-semibold hover:bg-black duration-300 hover:text-white">
              Courses videos
            </Link>
          </div>
          <div></div>
        </section>
        
        <section>
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="p-4">
                <div className="relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-110">
                  <div className="bg-purple-800 rounded-lg overflow-hidden shadow-xl border border-purple-500">
                    <img
                      className="h-32 w-full object-contain"
                      src={course.image.url}
                      alt=""
                    />
                    <div className='p-6 text-center'>
                      <h2 className="text-xl font-bold text-white mb-6">
                        {course.title}
                      </h2>
                      <Link
                        to={"/courses"}
                        className="mt-4 text-white py-2 px-4 rounded-full duration-300 transition-colors"
                        style={{ backgroundColor: '#8B5CF6' }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#000000';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#8B5CF6';
                          e.target.style.color = 'white';
                        }}
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <hr />
        {/* Modern Footer */}
        <footer >
          <div className="container mx-auto px-6 py-12">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

              {/* Brand Section */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-3 mb-6">
                  <img src={logo} alt="CodeNix Logo" className="w-12 h-12 rounded-full ring-2 ring-violet-400/30" />
                  <h1 className="text-2xl font-bold">
                    <span className="text-violet-400">Code</span>
                    <span className="text-white">Nix</span>
                  </h1>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 hover:text-black transition-colors duration-300">
                  Empowering developers with cutting-edge courses and hands-on learning experiences. From beginner to expert level.
                </p>

                {/* Social Links */}
                <div className="flex space-x-4">
                  <a href="#" className="group">
                    <div className="bg-gray-800 p-3 rounded-full group-hover:bg-blue-600 transition-all duration-300 transform group-hover:scale-110">
                      <FaFacebook className="text-lg text-gray-300 group-hover:text-white" />
                    </div>
                  </a>
                  <a href="#" className="group">
                    <div className="bg-gray-800 p-3 rounded-full group-hover:bg-pink-600 transition-all duration-300 transform group-hover:scale-110">
                      <FaInstagram className="text-lg text-gray-300 group-hover:text-white" />
                    </div>
                  </a>
                  <a href="#" className="group">
                    <div className="bg-gray-800 p-3 rounded-full group-hover:bg-blue-400 transition-all duration-300 transform group-hover:scale-110">
                      <FaTwitter className="text-lg text-gray-300 group-hover:text-white" />
                    </div>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6 relative">
                  Quick Links
                  <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-violet-400 to-cyan-400 rounded-full"></div>
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/courses" className="text-gray-400 hover:text-violet-400 transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      All Courses
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-gray-400 hover:text-black transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/instructors" className="text-gray-400 hover:text-black transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Instructors
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="text-gray-400 hover:text-black transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Learning Paths */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6 relative">
                  Learning Paths
                  <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-black transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Web Development
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-black transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Mobile Development
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-black transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Data Science
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-black transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      DevOps
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support & Legal */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6 relative">
                  Support & Legal
                  <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-black transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-black transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-black transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-black transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      Refund Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700/50 mt-8 pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-gray-400 text-sm text-center md:text-left">
                  © 2025 <span className="text-violet-400 font-semibold">CodeNix</span>. All rights reserved. Built with ❤️ for developers.
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <a href="#" className="text-gray-400 hover:text-black transition-colors">Support</a>
                  <a href="#" className="text-gray-400 hover:text-black transition-colors">Contact</a>
                  <a href="#" className="text-gray-400 hover:text-black transition-colors">Careers</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;



