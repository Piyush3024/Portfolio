
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
  MoonFilledIcon,
  SunFilledIcon,
  JhuniIcon,
} from "./icons";
import { useTheme } from "../providers/ThemeProvider";
import { siteConfig } from "../config/site";
import useAuthStore from "../stores/useAuthStore";

const Navbar = () => {
  // Add state to control whether the menu is open
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Use the theme context
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Function to close the menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className=" w-full bg-gray-100 dark:bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-gray-200 dark:border-emerald-800">
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
              {siteConfig.navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300 ease-in-out data-[active=true]:text-emerald-600 dark:data-[active=true]:text-emerald-400 data-[active=true]:font-medium"
                    to={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Theme Toggle Button */}
            <button
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={toggleTheme}
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

            {/* Auth Buttons */}
            <div className="hidden md:flex gap-2">
              {isAuthenticated ? (
                <button
                  className="text-sm font-normal p-2 rounded-lg text-red-400 border border-red-400 bg-gray-800 hover:bg-red-500 hover:text-white transition duration-300"
                  onClick={() => {
                    logout();
                    toast.success("Logout Successfully");
                  }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    className="text-sm font-normal p-2 rounded-lg text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition duration-300"
                    to={siteConfig.links.signup}
                  >
                    SignUp
                  </Link>
                  <Link
                    className="text-sm font-normal p-2 rounded-lg text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition duration-300"
                    to={siteConfig.links.login}
                  >
                    Login
                  </Link>
                </>
              )}
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

            {/* Mobile Theme Toggle Button */}
            <button
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300 ease-in-out py-2"
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
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>

            {/* Mobile Auth Buttons */}
            <div className="flex gap-2 mt-2">
              {isAuthenticated ? (
                <button
                  className="text-sm font-normal p-2 rounded-lg text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 bg-white dark:bg-gray-800 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition duration-300"
                  onClick={() => {
                    logout();
                    closeMenu();
                    toast.success("Logout Successfully");
                  }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    className="text-sm font-normal p-2 rounded-lg text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition duration-300"
                    to={siteConfig.links.signup}
                    onClick={closeMenu}
                  >
                    SignUp
                  </Link>
                  <Link
                    className="text-sm font-normal p-2 rounded-lg text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition duration-300"
                    to={siteConfig.links.login}
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;