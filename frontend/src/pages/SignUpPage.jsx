import  { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast';
import useAuthStore from "../stores/useAuthStore.js"
import { UserPlus, Loader } from "lucide-react";



const SignupPage =() => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // const { register, loading } = useUserStore();
  const [error, setError] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore()

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

    // Check if any field is empty
    const emptyFields = Object.entries(formData).filter(
      ([_, value]) => value === ""
    );
    if (emptyFields.length > 0) {
      setError("All fields are required");
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Clear error if validation passes
    setError("");
    await register(formData);

    // await register(formData);
    toast.success("Signup Successfully");

    setFormData({
      username: "",
      email: "",
      full_name: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    
    navigate("/");
  };

  // Track mouse position for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (pageRef.current) {
        const rect = pageRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] -mt-4  relative overflow-hidden w-full">
      <Toaster />
      <div
        ref={pageRef}
        className="h-full w-full overflow-y-auto md:pt-64 pt-56 md:py-0 py-8 px-4 md:px-8 flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.3) 0%, rgba(17, 24, 39, 0.95) 45%)`,
        }}
      >
        <div className="w-full max-w-md my-8">
          <div
            className="p-6 sm:p-8 rounded-lg bg-opacity-30 backdrop-blur-sm flex flex-col"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.4) 0%, rgba(17, 24, 39, 0.8) 70%)`,
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Create an <span className="text-cyan-400">Account</span>
            </h2>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-md mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-gray-200 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                  placeholder="Choose a username"
                />
              </div>

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
                <label htmlFor="full_name" className="block text-gray-200 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-200 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                  placeholder="Your phone number"
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
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-200 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                  placeholder="Confirm your password"
                />
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
                  <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                  SignUp
                </div>
              )}
              </button>
            </form>

            <div className="mt-6 text-center text-gray-300">
              Already have an account?{" "}
              <a href="/login" className="text-cyan-400 hover:text-cyan-300">
                Log In
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;