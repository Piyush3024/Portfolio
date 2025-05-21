import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
  JhuniIcon,
  MoonFilledIcon,
  SunFilledIcon,
} from "./icons";
import { useTheme } from "../providers/ThemeProvider";
import { siteConfig } from "../config/site";
import useAuthStore from "../stores/useAuthStore";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { logout, isAuthenticated, isTokenValid } = useAuthStore();

  useEffect(() => {
    // Check if user is not authenticated or token is invalid
    if (!isAuthenticated || !isTokenValid) {
      logout();
      navigate("/");
      toast.error("Session expired. Please login again.");
    }
  }, [isAuthenticated, isTokenValid, logout, navigate]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900/95 border-gray-800' 
        : 'bg-white/95 border-gray-200'
    } backdrop-blur-md shadow-lg border-b`}>
      <div className="container mx-auto px-4 py-3">
        <Toaster />
        <div className="flex justify-between items-center">
          {/* Brand Logo and Name */}
          <Link
            to="/"
            className="flex justify-start items-center gap-1 text-2xl font-bold text-cyan-500 hover:text-cyan-400 transition-colors duration-300"
          >
            <JhuniIcon />
            <span>Jhuni</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              theme === 'dark'
                ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
                : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-100'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
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
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/admin')
                      ? theme === 'dark'
                        ? 'text-cyan-400 bg-gray-800'
                        : 'text-cyan-600 bg-gray-100'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
                        : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-100'
                  }`}
                  to="/admin"
                >
                  Contacts
                </Link>
              </li>
              <li>
                <Link
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/adminUser')
                      ? theme === 'dark'
                        ? 'text-cyan-400 bg-gray-800'
                        : 'text-cyan-600 bg-gray-100'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
                        : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-100'
                  }`}
                  to="/adminUser"
                >
                  Users
                </Link>
              </li>
              <li>
                <Link
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/adminProject')
                      ? theme === 'dark'
                        ? 'text-cyan-400 bg-gray-800'
                        : 'text-cyan-600 bg-gray-100'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
                        : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-100'
                  }`}
                  to="/adminProject"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/adminPost')
                      ? theme === 'dark'
                        ? 'text-cyan-400 bg-gray-800'
                        : 'text-cyan-600 bg-gray-100'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
                        : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-100'
                  }`}
                  to="/adminPost"
                >
                  Posts
                </Link>
              </li>
              <li>
                <Link
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/adminComment')
                      ? theme === 'dark'
                        ? 'text-cyan-400 bg-gray-800'
                        : 'text-cyan-600 bg-gray-100'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
                        : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-100'
                  }`}
                  to="/adminComment"
                >
                  Comments
                </Link>
              </li>
            </ul>

            {/* Theme Toggle Button */}
            <button
              className={`p-2 rounded-lg transition-colors duration-300 ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
                  : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-100'
              }`}
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? (
                <SunFilledIcon className="text-yellow-300" size={20} />
              ) : (
                <MoonFilledIcon className="text-gray-500" size={20} />
              )}
            </button>

            {/* Auth Buttons */}
            <div className="hidden md:flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  theme === 'dark'
                    ? 'text-red-400 border border-red-400 hover:bg-red-500 hover:text-white'
                    : 'text-red-600 border border-red-600 hover:bg-red-500 hover:text-white'
                }`}
                onClick={() => {
                  logout();
                  navigate("/");
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
          <nav className={`md:hidden pt-4 pb-2 flex flex-col gap-4 border-t ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          } mt-3 animate-fadeIn`}>
            {/* Mobile Nav Items */}
            {siteConfig.adminItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive(item.href)
                    ? theme === 'dark'
                      ? 'text-cyan-400 bg-gray-800'
                      : 'text-cyan-600 bg-gray-100'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
                      : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-100'
                }`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Theme Toggle Button */}
            <button
              className={`p-2 rounded-lg transition-colors duration-300 ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
                  : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-100'
              }`}
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? (
                <SunFilledIcon className="text-yellow-300" size={20} />
              ) : (
                <MoonFilledIcon className="text-gray-500" size={20} />
              )}
            </button>

            {/* Mobile Auth Buttons */}
            <div className="flex gap-2 mt-2">
              <button
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  theme === 'dark'
                    ? 'text-red-400 border border-red-400 hover:bg-red-500 hover:text-white'
                    : 'text-red-600 border border-red-600 hover:bg-red-500 hover:text-white'
                }`}
                onClick={() => {
                  logout();
                  closeMenu();
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