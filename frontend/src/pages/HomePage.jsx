import  { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import useProjectStore from "../stores/useProjectStore";


export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typingText, setTypingText] = useState("Frontend Developer!");
  const pageRef = useRef(null);
  const typingTexts = [
    "MERN Stack Developer!",
    "Full Stack Developer!",
    "Next.js Developer!",
    "Python Developer!",
    "Cyber Security Enthusiast!",
  ];

  const { isAuthenticated } = useAuthStore();
  const { fetchProjects, projects } = useProjectStore();

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

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects])
  


  // Typing animation effect
  useEffect(() => {
    let currentIndex = 0;

    const changeText = () => {
      currentIndex = (currentIndex + 1) % typingTexts.length;
      setTypingText(typingTexts[currentIndex]);
    };

    const intervalId = setInterval(changeText, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      ref={pageRef}
      className="md:min-h-[calc(100vh-4rem)] md:mt-0 -mt-5 h-[calc(100vh-8rem)] w-full md:h-[100vh] md:w-[100vw] md:absolute left-0 md:top-0 relative flex items-center justify-center px-4 md:px-8 lg:px-16 py-8 sm:py-16"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.3) 0%, rgba(17, 24, 39, 0.95) 45%)`,
      }}
    >
      <div className="w-full h-full md:overflow-hidden overflow-y-auto max-w-6xl flex flex-col md:flex-row items-center gap-8 lg:gap-16">
        {/* Left side - Introduction */}
        <div className="w-full md:w-1/2 order-2 md:order-1">
          <div
            className="p-6 sm:p-8 rounded-lg mt-4 bg-opacity-30 backdrop-blur-sm"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.4) 0%, rgba(17, 24, 39, 0.8) 70%)`,
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Hello, It&apos;s Me
            </h2>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-2">
              Piyush <span className="text-cyan-400">Bhul</span>
            </h1>

            <div className="h-10 mt-4">
              <h3 className="typing-text text-xl md:text-2xl font-semibold overflow-hidden border-r-2 border-cyan-400 whitespace-nowrap inline-block pr-1 animate-pulse">
                {typingText}
              </h3>
            </div>

            <p className="mt-5 text-gray-200 leading-relaxed">
              I am a passionate full-stack developer with expertise in frontend
              (React, Next.js), backend (Node.js, Express), and databases. I
              combine technical expertise with problem-solving creativity to
              develop efficient, user-friendly, and future-ready solutions.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              {isAuthenticated ? (
                <Link
                  to="/about"
                  className="px-6 py-3 bg-cyan-400 text-gray-900 font-semibold rounded-md hover:bg-cyan-500 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </Link>
               ) : ( 
                <Link
                  to="/login"
                  className="px-6 py-3 bg-cyan-400 text-gray-900 font-semibold rounded-md hover:bg-cyan-500 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </Link>
               )} 

              <Link
                to="/contact"
                className="px-6 py-3 bg-transparent text-cyan-400 font-semibold rounded-md border border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 transform hover:scale-105"
              >
                Hire Me
              </Link>
            </div>

            <div className="flex space-x-6 mt-8">
              <a
                href="https://www.facebook.com/profile.php?id=100068198153843"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 text-xl hover:text-cyan-300 transition-all duration-300"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="https://x.com/PiyushBhul"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 text-xl hover:text-cyan-300 transition-all duration-300"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://www.instagram.com/kumarpiyush3024"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 text-xl hover:text-cyan-300 transition-all duration-300"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 text-xl hover:text-cyan-300 transition-all duration-300"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Right side - Photo */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end order-1 md:order-2">
          <div className="relative">
            <div className="absolute inset-0 border-4 border-cyan-400 rounded-lg transform rotate-12 animate-pulse"></div>
            <div className="relative rounded-lg overflow-hidden w-64 h-64 md:w-80 md:h-80">
              {/* Replace with standard img tag instead of Next.js Image component */}
              <img
                alt="Piyush Bhul"
                className="h-full object-cover w-full"
                src="/profile.jpg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}