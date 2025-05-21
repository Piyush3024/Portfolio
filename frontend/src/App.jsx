// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/LoginPage";
// import SignUpPage from "./pages/SignUpPage";
// import { Route, Routes, useLocation } from "react-router-dom";
// import AboutPage from "./pages/AboutPage";
// import ProjectsPage from "./pages/ProjectsPage";
// import ContactPage from "./pages/ContactUsPage";
// import BlogPage from "./pages/BlogsPage";
// import useAuthStore from "./stores/useAuthStore";
// import AdminNavbar from "./components/AdminNavbar";
// import { Navigate } from 'react-router-dom'
// import AdminPage from "./pages/AdminPage"
// import AdminUserManagement from "./pages/admin/UserPage";
// import ProjectsManage from "./pages/admin/ProjectsManage";
// import PostsManage from "./pages/admin/PostsManage";
// import CommentsManage from "./pages/admin/CommentsManage";
// import PrivacyPolicy from "./components/PrivacyPolicy";
// import SingleBlogPost from "./components/SingleBlogPost";
// import { Analytics } from "@vercel/analytics/react"


// function App() {
//   const location = useLocation();
//   const { user } = useAuthStore();
 
//   const isAdmin = () => {
//     return user?.role?.name === "ADMIN";
//   };

 

//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 flex flex-col overflow-auto">
//       {/* Background gradient - lighter for light mode, darker for dark mode */}
//       <div className="absolute inset-0  pointer-events-none">
//         <div className="absolute inset-0">
//           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.2)_0%,rgba(10,80,60,0.1)_45%,rgba(0,0,0,0.05)_100%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1)_0%,rgba(10,80,60,0.05)_45%,rgba(0,0,0,0.05)_100%)]" />
//         </div>
//       </div>

//       {/* Content */}
//       <div className="flex-grow flex flex-col z-10">
//         <Analytics />
//         {isAdmin() ? <AdminNavbar/> : <Navbar />}
//         <main className="flex-grow">
//           <Routes>
//             <Route path="/" element={
//               <>
//                 {/* Add this for testing, remove after confirming connection */}
               
//                 <HomePage />
//               </>
//             } />

//             <Route
//               path="/signup"
//               element={!user ? <SignUpPage /> : <Navigate to="/" />}
//             />
//             <Route
//               path="/login"
//               element={
//                 !user ? (
//                   <LoginPage />
//                 ) : isAdmin() ? (
//                   <Navigate to="/admin" />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route
//               path="/admin"
//               element={isAdmin() ? <AdminPage /> : <Navigate to="/" />}
//             />
//             <Route
//               path="/adminUser"
//               element={isAdmin() ? <AdminUserManagement /> : <Navigate to="/" />}
//             />
//             <Route
//               path="/adminProject"
//               element={isAdmin() ? <ProjectsManage /> : <Navigate to="/" />}
//             />
//             <Route
//               path="/adminPost"
//               element={isAdmin() ? <PostsManage /> : <Navigate to="/" />}
//             />
//             <Route
//               path="/adminComment"
//               element={isAdmin() ? <CommentsManage /> : <Navigate to="/" />}
//             />
     
//             <Route path="/about" element={<AboutPage />} />
//             <Route path="/projects" element={<ProjectsPage />} />
//             <Route path="/contact" element={<ContactPage />} />
//             <Route path="/blog" element={<BlogPage />} />
//             <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//             <Route path="/blog/:id" element={<SingleBlogPost />} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </div>
//   );
// }

// export default App;


import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AuthCallback from "./pages/AuthCallback";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { Route, Routes, useLocation } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactUsPage";
import BlogPage from "./pages/BlogsPage";
import useAuthStore from "./stores/useAuthStore";
import AdminNavbar from "./components/AdminNavbar";
import { Navigate } from 'react-router-dom';
import AdminPage from "./pages/AdminPage";
import AdminUserManagement from "./pages/admin/UserPage";
import ProjectsManage from "./pages/admin/ProjectsManage";
import PostsManage from "./pages/admin/PostsManage";
import CommentsManage from "./pages/admin/CommentsManage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import SingleBlogPost from "./components/SingleBlogPost";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const location = useLocation();
  const { user } = useAuthStore();

  const isAdmin = () => {
    return user?.role?.name === "ADMIN";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 flex flex-col overflow-auto">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.2)_0%,rgba(10,80,60,0.1)_45%,rgba(0,0,0,0.05)_100%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1)_0%,rgba(10,80,60,0.05)_45%,rgba(0,0,0,0.05)_100%)]" />
        </div>
      </div>
      <div className="flex-grow flex flex-col z-10">
        <Analytics />
        {isAdmin() ? <AdminNavbar /> : <Navbar />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
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
              path="/auth/callback"
              element={<AuthCallback />}
            />
            <Route
              path="/reset-password"
              element={<ResetPasswordPage />}
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
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/blog/:id" element={<SingleBlogPost />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;