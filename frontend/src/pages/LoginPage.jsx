import { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { LogIn, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import  useAuthStore  from "../stores/useAuthStore.js";

// Mock store function to simulate the Zustand store in React

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const pageRef = useRef(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    try {
     const userDetails = await login(formData);
    //  console.log("user role: ", userDetails)
      

      if (userDetails.role.name === "ADMIN") {
        navigate("/admin");
        toast.success("Welcome Admin!");
      } else {
        toast.success(`Welcome, ${userDetails.username}`);
        navigate("/"); // Redirect to home page
      }

      // Reset form data
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      console.log("Login failed :", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  // Track mouse position for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (pageRef.current) {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-8rem)] md:mt-0 -mt-4 w-screen  md:h-[100vh] md:w-[100vw] md:absolute left-0 md:top-0 relative flex items-center justify-center px-4 md:px-8 lg:px-16 py-8 sm:py-16"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.3) 0%, rgba(17, 24, 39, 0.95) 45%)`,
      }}
    >
      <Toaster />
      <div className="w-full max-w-md">
        <div
          className="p-6 sm:p-8 rounded-lg bg-opacity-30 backdrop-blur-sm"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.4) 0%, rgba(17, 24, 39, 0.8) 70%)`,
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Welcome <span className="text-cyan-400">Back</span>
          </h2>

          {/* {error && (
            <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-md mb-6">
              {error}
            </div>
          )} */}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-200 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                placeholder="Your email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-200 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                placeholder="Your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-400 focus:ring-cyan-400 border-gray-600 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-300"
                >
                  Remember me
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-cyan-500 text-gray-900 font-bold rounded-md hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 transform hover:scale-[1.02]"
              disabled={isLoading}
            >
             {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader
                    className="mr-2 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Loading...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                  Login
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-300">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-cyan-400 hover:text-cyan-300">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
