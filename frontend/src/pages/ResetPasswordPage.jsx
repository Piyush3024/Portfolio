import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Loader, Eye, EyeOff } from "lucide-react";
import useAuthStore from "../stores/useAuthStore.js";
import { useTheme } from "../providers/ThemeProvider";
import { Link } from "react-router-dom";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, isLoading } = useAuthStore();
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "white";

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
    const token = searchParams.get("token");
    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }
    if (!formData.newPassword || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    try {
      await resetPassword({ token, newPassword: formData.newPassword });
      toast.success("Password reset successfully. Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div
      ref={pageRef}
      className="min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-8rem)] md:mt-0 -mt-4 max-w-full md:h-[100vh] md:w-[100vw] relative flex items-center justify-center px-4 md:px-8 lg:px-16 py-8 sm:py-16"
    >
      <Toaster />
      <div className="w-full max-w-md">
        <div
          className="p-4 sm:p-6 md:p-8 rounded-lg bg-opacity-30 backdrop-blur-sm relative animate-fadeIn"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.4) 0%, rgba(17, 24, 39, 0.8) 70%)`,
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            className="absolute inset-0 rounded-lg pointer-events-none hidden dark:block"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.12) 0%, rgba(17, 24, 39, 0.5) 60%)",
            }}
          />
          <div
            className="absolute inset-0 rounded-lg pointer-events-none block dark:hidden"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, rgba(241, 245, 249, 0.6) 60%)",
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
            }}
          />
          <h2
            className="text-2xl sm:text-3xl font-bold mb-6 text-center"
            style={{ color: textColor }}
          >
            Reset Your <span className="text-cyan-400">Password</span>
          </h2>
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-md mb-6 text-sm sm:text-base">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block mb-1 text-sm sm:text-base"
                style={{ color: textColor }}
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700 text-sm sm:text-base"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-cyan-400"
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
                className="block mb-1 text-sm sm:text-base"
                style={{ color: textColor }}
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
                  className="w-full p-2 sm:p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700 text-sm sm:text-base"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-cyan-400"
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
              className="w-full p-2 sm:p-3 bg-cyan-500 text-gray-900 font-bold rounded-md hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader
                    className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Resetting...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Reset Password
                </div>
              )}
            </button>
          </form>
          <div
            className="mt-6 text-center text-xs sm:text-sm"
            style={{ color: textColor }}
          >
            Back to{" "}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;