
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
  JhuniIcon,
  MoonFilledIcon,
  SunFilledIcon,
} from "./icons";
import { useTheme } from "../providers/ThemeProvider";
import { siteConfig } from "../config/site";
import useAuthStore from "../stores/useauthstore";

const AdminNavbar = () => {
  const navigate = useNavigate();
  // Add state to control whether the menu is open
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Use the theme context
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isTokenValid, isAuthenticated } = useAuthStore();


  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate("/");
      toast.error("Please login to access admin panel");
    }
  }, [isAuthenticated, logout, navigate])

  // Function to close the menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle token expiration

    // Only proceed with logout if user is actually authenticated
   ;
  
 

  // Check token validity on component mount and periodically// Modified useEffect for token validation in AdminNavbar.jsx
// useEffect(() => {
//   // Skip token validation if user is not authenticated
//   if (!isAuthenticated) return;
  
//   // Log to help with debugging
//   console.log("Setting up token validation checks for authenticated user");
  
//   // Disable the initial check completely - let the periodic check handle it
//   // This gives more time for login to complete properly
  
//   // Set up periodic token check every 2 minutes
//   const tokenCheckInterval = setInterval(() => {
//     // Log before check (for debugging)
//     console.log("Running periodic token validation check");
    
//     if (!isTokenValid()) {
//       console.log("Token validation failed - logging user out");
//       handleTokenExpiration();
//     } else {
//       console.log("Token is still valid");
//     }
//   }, 100000); // Check every 2 minutes (increased from 1 minute)
  
//   // Clean up interval on component unmount
//   return () => {
//     clearInterval(tokenCheckInterval);
//     console.log("Token validation checks cleared");
//   };
// }, [isAuthenticated]); // Only re-run when authentication status changes

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-100 dark:bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-gray-200 dark:border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <Toaster />
        <div className="flex justify-between items-center">
          {/* Brand Logo and Name */}
          <Link
            to="/"
            className="flex justify-start items-center gap-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400"
          >
            <JhuniIcon />
            <span>Jhuni</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {/* Nav Items */}
            <ul className="hidden lg:flex gap-6 justify-start ml-2">
              <li>
                <Link
                  className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300 ease-in-out data-[active=true]:text-emerald-600 dark:data-[active=true]:text-emerald-400 data-[active=true]:font-medium"
                  to="/admin"
                >
                  Contacts
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300 ease-in-out data-[active=true]:text-emerald-600 dark:data-[active=true]:text-emerald-400 data-[active=true]:font-medium"
                  to="/adminUser"
                >
                  Users
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300 ease-in-out data-[active=true]:text-emerald-600 dark:data-[active=true]:text-emerald-400 data-[active=true]:font-medium"
                  to="/adminProject"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300 ease-in-out data-[active=true]:text-emerald-600 dark:data-[active=true]:text-emerald-400 data-[active=true]:font-medium"
                  to="/adminPost"
                >
                  Posts
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300 ease-in-out data-[active=true]:text-emerald-600 dark:data-[active=true]:text-emerald-400 data-[active=true]:font-medium"
                  to="/adminComment"
                >
                  Comments
                </Link>
              </li>
            </ul>

            {/* Auth Buttons */}
            <div className="hidden md:flex gap-2">
              <button
                className="text-sm font-normal p-2 rounded-lg text-red-400 border border-red-400 bg-gray-800 hover:bg-red-500 hover:text-white transition duration-300"
                onClick={() => {
                  logout();
                  navigate("/")
                  toast.success("Logout Successfully");
                }}
              >
                Logout
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 flex flex-col gap-4 border-t border-gray-300 dark:border-gray-700 mt-3 animate-fadeIn">
            {/* Mobile Nav Items */}
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300 ease-in-out py-2"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
            <div>
              {/* Mobile Theme Toggle Button */}
              <button
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={() => {
                  toggleTheme();
                  // Don't close the menu when toggling theme
                }}
                aria-label={
                  theme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
              >
                {theme === "dark" ? (
                  <SunFilledIcon className="text-yellow-300" size={20} />
                ) : (
                  <MoonFilledIcon className="text-gray-500" size={20} />
                )}
              </button>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex gap-2 mt-2">
            <button
                  className="text-sm font-normal p-2 rounded-lg text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 bg-white dark:bg-gray-800 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition duration-300"
                  onClick={() => {
                    logout();
                    closeMenu()
                    toast.success("Logout Successfully");
                  }}
                >
                  Logout
                </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;