import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { Route, Routes, useLocation } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactUsPage";
import BlogPage from "./pages/BlogsPage";
import useAuthStore from "./stores/useAuthStore";
import AdminNavbar from "./components/AdminNavbar";
import { Navigate } from 'react-router-dom'
import AdminPage from "./pages/AdminPage"
import AdminUserManagement from "./pages/admin/UserPage";
import ProjectsManage from "./pages/admin/ProjectsManage";
import PostsManage from "./pages/admin/PostsManage";
import CommentsManage from "./pages/admin/CommentsManage";
import { useState, useEffect } from 'react';

function App() {
  const location = useLocation();
  const { user } = useAuthStore();
 
  const isAdmin = () => {
    return user?.role?.name === "ADMIN";
  };

  // console.log("User :", user?.role?.name);

  // Add a test component to verify connection
  function ConnectionTest() {
    const [status, setStatus] = useState({ loading: true, data: null, error: null });

    useEffect(() => {
      const testConnection = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/test-db`);
          const data = await response.json();
          setStatus({ loading: false, data, error: null });
        } catch (error) {
          setStatus({ loading: false, data: null, error: error.message });
        }
      };

      testConnection();
    }, []);

    if (status.loading) return <div>Testing connection...</div>;
    if (status.error) return <div className="text-red-500">Error: {status.error}</div>;
    
    return (
      <div className="p-4 bg-green-100 rounded mb-4">
        <h3 className="font-bold">Connection Test</h3>
        <p>Status: {status.data?.success ? 'Connected' : 'Failed'}</p>
        <p>Message: {status.data?.message}</p>
        <p>Environment: {status.data?.env?.nodeEnv}</p>
        <p>API URL: {import.meta.env.VITE_API_URL}</p>
      </div>
    );
  }

  // if (checkingAuth) {
  //   return <LoadingSpinner />;
  // }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Background gradient - lighter for light mode, darker for dark mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.2)_0%,rgba(10,80,60,0.1)_45%,rgba(0,0,0,0.05)_100%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1)_0%,rgba(10,80,60,0.05)_45%,rgba(0,0,0,0.05)_100%)]" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-20">
        {isAdmin() ? <AdminNavbar/> : <Navbar />}
        <Routes>
          <Route path="/" element={
            <>
              {/* Add this for testing, remove after confirming connection */}
              <ConnectionTest />
              <HomePage />
            </>
          } />

          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={
              !user ? (
                <LoginPage />
              ) : isAdmin() ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin"
            element={isAdmin() ? <AdminPage /> : <Navigate to="/" />}
          />
          <Route
            path="/adminUser"
            element={isAdmin() ? <AdminUserManagement /> : <Navigate to="/" />}
          />
          <Route
            path="/adminProject"
            element={isAdmin() ? <ProjectsManage /> : <Navigate to="/" />}
          />
          <Route
            path="/adminPost"
            element={isAdmin() ? <PostsManage /> : <Navigate to="/" />}
          />
          <Route
            path="/adminComment"
            element={isAdmin() ? <CommentsManage /> : <Navigate to="/" />}
          />
   
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
        {location.pathname !== "/projects" && location.pathname !== "/blog" && (
          <Footer />
         )}
      </div>
    </div>
  );
}

export default App;
