


import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

function AboutPage() {
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

  // Handle CV download
  const handleDownloadCV = () => {
    // Path to your CV file in the public folder
    const fileUrl = '/resume.pdf'; // Replace with your actual CV file path
    
    // Create an anchor element
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'Piyush_Bhul.pdf'; // Replace with your preferred filename
    
    // Append to the document
    document.body.appendChild(link);
    
    // Trigger the click event
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    toast.success("CV downloaded successfully");
  };

  return (
    <div
      ref={pageRef}
      className="md:min-h-[calc(100vh-8rem)]  h-[calc(100vh-8rem)]   md:mt-0 -mt-5 overflow-y-auto w-full md:h-[100vh] md:w-[100vw] md:absolute left-0 md:top-0 relative flex items-center justify-center px-4 md:px-8 lg:px-16 py-8 sm:py-16"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.3) 0%, rgba(17, 24, 39, 0.95) 45%)`,
      }}
    >
      <Toaster />
      <div className="w-full h-full  overflow-auto max-w-6xl flex flex-col md:flex-row items-center gap-20 lg:gap-16">
        {/* Left side - Photo */}
        <div className="w-full md:w-2/5 flex justify-center md:justify-start">
          <div className="relative">
            <div className="absolute inset-0 border-4 border-cyan-400 rounded-lg transform rotate-12 animate-pulse"></div>
            <div className="relative rounded-lg overflow-hidden w-64 h-64 md:w-72 md:h-72">
              {/* Replace with standard img tag instead of Next.js Image */}
              <img
                alt="Profile"
                className="h-full object-cover w-full"
                src="/skillset.jpg"
              />
            </div>
          </div>
        </div>

        {/* Right side - Content */}
        <div
          className="w-full md:w-[75%] p-6 sm:p-8 rounded-lg mt-4 bg-opacity-30 backdrop-blur-sm"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.4) 0%, rgba(17, 24, 39, 0.8) 70%)`,
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            About <span className="text-cyan-400">Me</span>
          </h2>

          <div className="h-10 mt-2">
            <h3 className="typing-text text-xl md:text-2xl font-semibold overflow-hidden border-r-2 border-cyan-400 whitespace-nowrap inline-block pr-1 animate-pulse">
              {typingText}
            </h3>
          </div>

          <p className="mt-5 md:mt-3 text-gray-200 leading-relaxed">
            I&apos;m a passionate full-stack developer skilled in React,
            Next.js, Node.js, Express, MongoDB, MySQL, and system
            administration. With expertise in REST APIs, web security, Git,
            Docker, and cloud computing, I build scalable and secure
            applications.
          </p>

          <p className="mt-5 md:mt-3 text-gray-200 leading-relaxed">
            I continuously explore new technologies to refine my skills and stay
            ahead of industry trends, creating efficient, user-friendly, and
            future-ready solutions.
          </p>

          <div className="mt-8 md:mt-5 space-y-4">
            <div className="flex items-start gap-2">
              <div className="bg-cyan-400 p-2 rounded-md flex items-center justify-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Experience</h4>
                <p className="text-gray-300">
                  2+ years of experience in full-stack development, databases,
                  and networking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-cyan-400 p-2 rounded-md flex items-center justify-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Projects</h4>
                <p className="text-gray-300">
                  Successfully completed 20+ projects for various clients and
                  organizations.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button 
              onClick={handleDownloadCV}
              className="px-6 py-2 bg-cyan-400 text-gray-900 font-semibold rounded-md hover:bg-cyan-500 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Download CV
            </button>
            <Link
              to="/projects"
              className="px-6 py-2 bg-transparent text-cyan-400 font-semibold rounded-md border border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300"
            >
              My Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;