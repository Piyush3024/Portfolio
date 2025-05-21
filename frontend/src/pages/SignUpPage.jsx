import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import useAuthStore from "../stores/useAuthStore.js";
import { UserPlus, Loader, Eye, EyeOff } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";
import { FaGoogle, FaGithub } from "react-icons/fa";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const { theme } = useTheme();

  const pageRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emptyFields = Object.entries(formData).filter(
      ([_, value]) => value === ""
    );
    if (emptyFields.length > 0) {
      setError("All fields are required");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    try {
      await register(formData);
      toast.success("Signup Successful");
      setFormData({
        username: "",
        email: "",
        full_name: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/");
    } catch (error) {
      toast.error("Signup failed. Please try again.");
    }
  };

  const handleOAuthSignUp = (provider) => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/auth/${provider}?type=signup`;
  };

  return (
    <div
      ref={pageRef}
      className={`md:mt-0 -mt-4 w-screen max-w-full relative flex items-center justify-center px-4 md:px-8 lg:px-16 py-8 sm:py-16 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <Toaster />
      <div className="w-full max-w-md my-8">
        <div
          className={`p-4 sm:p-6 md:p-8 rounded-lg backdrop-blur-sm relative flex flex-col animate-fadeIn ${
            theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'
          }`}
          style={{
            background: theme === 'dark'
              ? `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.2) 0%, rgba(17, 24, 39, 0.95) 70%)`
              : `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, rgba(255, 255, 255, 0.95) 70%)`,
            boxShadow: theme === 'dark'
              ? "0 4px 30px rgba(0, 0, 0, 0.2)"
              : "0 4px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 className={`text-2xl sm:text-3xl font-bold mb-6 text-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Create an <span className="text-cyan-400">Account</span>
          </h2>
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-md mb-6 text-sm sm:text-base">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className={`block mb-1 text-sm sm:text-base ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full p-2 sm:p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border text-sm sm:text-base ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-200 border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className={`block mb-1 text-sm sm:text-base ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 sm:p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border text-sm sm:text-base ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-200 border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                placeholder="Your email address"
              />
            </div>
            <div>
              <label
                htmlFor="full_name"
                className={`block mb-1 text-sm sm:text-base ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={`w-full p-2 sm:p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border text-sm sm:text-base ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-200 border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className={`block mb-1 text-sm sm:text-base ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-2 sm:p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border text-sm sm:text-base ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-200 border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                placeholder="Your phone number"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className={`block mb-1 text-sm sm:text-base ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-2 sm:p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border text-sm sm:text-base ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-200 border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                    theme === 'dark' ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-500 hover:text-cyan-600'
                  }`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className={`block mb-1 text-sm sm:text-base ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-2 sm:p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border text-sm sm:text-base ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-200 border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                    theme === 'dark' ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-500 hover:text-cyan-600'
                  }`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full p-2 sm:p-3 bg-cyan-500 text-white font-bold rounded-md hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" aria-hidden="true" />
                  Loading...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <UserPlus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  SignUp
                </div>
              )}
            </button>
            <div className="mt-4 flex gap-3 justify-center">
              <button
                onClick={() => handleOAuthSignUp("google")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                  transition-all duration-300 transform hover:scale-105 hover:shadow-md
                  ${theme === 'dark' 
                    ? 'bg-gray-700 text-white border border-gray-600 hover:bg-gray-600' 
                    : 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50'}
                  focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                aria-label="Sign up with Google"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                  />
                  <path
                    fill="#34A853"
                    d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                  />
                  <path
                    fill="#4285F4"
                    d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                  />
                </svg>
                <span>Google</span>
              </button>
              
              <button
                onClick={() => handleOAuthSignUp("github")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                  transition-all duration-300 transform hover:scale-105 hover:shadow-md
                  ${theme === 'dark'
                    ? 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700'
                    : 'bg-gray-900 text-white border border-gray-800 hover:bg-gray-800'}
                  focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                aria-label="Sign up with GitHub"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"
                  />
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </form>
          <div className={`mt-6 text-center text-xs sm:text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
