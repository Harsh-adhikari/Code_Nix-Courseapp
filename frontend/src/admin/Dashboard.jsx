// import React from "react";
// import { Link } from "react-router-dom";
// import logo from "../../public/logo.webp";
// import toast from "react-hot-toast";
// import axios from "axios";

// function Dashboard() {
//   const handleLogout = async () => {
//     try {
//       const response = await axios.get(`http://localhost:4001/api/v1/admin/logout`, {
//         withCredentials: true,
//       });
//       toast.success(response.data.message);
//       localStorage.removeItem("admin");
//     } catch (error) {
//       console.log("Error in logging out ", error);
//       toast.error(error.response.data.errors || "Error in logging out");
//     }
//   };
//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-100 p-5">
//         <div className="flex items-center flex-col mb-10">
//           <img src={logo} alt="Profile" className="rounded-full h-20 w-20" />
//           <h2 className="text-lg font-semibold mt-4">I'm Admin</h2>
//         </div>
//         <nav className="flex flex-col space-y-4">
//           <Link to="/admin/our-courses">
//             <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded">
//               Our Courses
//             </button>
//           </Link>
//           <Link to="/admin/create-course">
//             <button className="w-full bg-orange-500 hover:bg-blue-600 text-white py-2 rounded">
//               Create Course
//             </button>
//           </Link>

//           <Link to="/">
//             <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
//               Home
//             </button>
//           </Link>
//           <Link to="/admin/login">
//             <button
//               onClick={handleLogout}
//               className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
//             >
//               Logout
//             </button>
//           </Link>
//         </nav>
//       </div>
//       <div className="flex h-screen items-center text-2xl justify-center ml-[32%]">
//         Welcome!!!
//       </div>
//     </div>
//   );
// }

// export default Dashboard;


import React, { useState, useEffect } from "react"; 
import { Link } from "react-router-dom"; 
import logo from "../../public/logo1.png";
import toast from "react-hot-toast"; 
import axios from "axios"; 
import { BACKEND_URL } from "../utils/utils";
 
function Dashboard() { 
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference from localStorage on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
  }, []);

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const handleLogout = async () => { 
    try { 
      const response = await axios.get(`${BACKEND_URL}/admin/logout`, { 
        withCredentials: true, 
      }); 
      toast.success(response.data.message); 
      localStorage.removeItem("admin"); 
    } catch (error) { 
      console.log("Error in logging out ", error); 
      toast.error(error.response.data.errors || "Error in logging out"); 
    } 
  }; 

  return ( 
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}> 
      {/* Sidebar */} 
      <div className={`w-64 p-5 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}> 
        <div className="flex items-center flex-col mb-10"> 
          <img src={logo} alt="Profile" className="rounded-full h-16 w-16" /> 
          <h2 className={`text-lg font-semibold mt-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            I'm Admin
          </h2> 
        </div> 
        
        {/* Dark Mode Toggle Button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode 
                ? 'bg-white hover:bg-yellow-500 text-gray-900' 
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
          >
            {isDarkMode ? '💡Light' : '🌙 Dark Mode'}
          </button>
        </div>

        <nav className="flex flex-col space-y-4"> 
          <Link to="/admin/our-courses"> 
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded"> 
              Our Courses 
            </button> 
          </Link> 
          <Link to="/admin/create-course"> 
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"> 
              Create Course 
            </button> 
          </Link> 
 
          <Link to="/"> 
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"> 
              Home 
            </button> 
          </Link> 
          <Link to="/admin/login"> 
            <button 
              onClick={handleLogout} 
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded" 
            > 
              Logout 
            </button> 
          </Link> 
        </nav> 
      </div> 
      <div className={`flex h-screen items-center text-2xl justify-center ml-[32%] ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}> 
        Welcome!!! 
      </div> 
    </div> 
  ); 
} 
 
export default Dashboard;



