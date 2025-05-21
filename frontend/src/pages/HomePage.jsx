import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import useAuthStore from "../stores/useAuthStore";
import useProjectStore from "../stores/useProjectStore";
import usePostStore from "../stores/usePostStore";

export default function HomePage() {
  //
  const [typingText, setTypingText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const pageRef = useRef(null);
  const typingTexts = [
    "MERN Stack Developer!",
    "Full Stack Developer!",
    "Next.js Developer!",
    "Python Developer!",
    "AI Integrated Web Developer!",
  ];

  const { isAuthenticated } = useAuthStore();
  const { fetchProjects } = useProjectStore();
  const { fetchPosts } = usePostStore();

  const [isTyping, setIsTyping] = useState(true);

  // Fetch projects and posts
  useEffect(() => {
    fetchProjects();
    fetchPosts();
  }, [fetchProjects, fetchPosts]);

  // Typewriter animation effect
  useEffect(() => {
    const currentWord = typingTexts[currentWordIndex];
    let timeoutId;

    if (isTyping) {
      if (currentLetterIndex < currentWord.length) {
        timeoutId = setTimeout(() => {
          setTypingText(currentWord.slice(0, currentLetterIndex + 1));
          setCurrentLetterIndex(currentLetterIndex + 1);
        }, 100);
      } else {
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, 1000);
      }
    } else {
      if (currentLetterIndex > 0) {
        timeoutId = setTimeout(() => {
          setTypingText(currentWord.slice(0, currentLetterIndex - 1));
          setCurrentLetterIndex(currentLetterIndex - 1);
        }, 100);
      } else {
        timeoutId = setTimeout(() => {
          setTypingText("");
          setCurrentWordIndex((prev) => (prev + 1) % typingTexts.length);
          setIsTyping(true);
        }, 500);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [currentLetterIndex, currentWordIndex, typingTexts, isTyping]);

  return (
    <>
      <Helmet>
        <link rel="preload" href="/profile.webp" as="image" />
      </Helmet>
      <div
        ref={pageRef}
        className="max-w-full md:mt-0 mt-8  min-h-screen relative flex items-center justify-center px-4 md:px-8 lg:px-16 py-8 sm:py-16"
      >
        <div className="w-full h-full md:overflow-hidden overflow-y-auto max-w-6xl flex flex-col md:flex-row items-center gap-8 lg:gap-16">
          {/* Left side - Introduction */}
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <div
              className="p-6 sm:p-8 rounded-lg mt-4 bg-opacity-30 backdrop-blur-sm animate-fadeIn relative"
              style={{
                background: `radial-gradient(circle at 30% 40%, rgba(6, 182, 212, 0.08) 0%, rgba(17, 24, 39, 0.7) 60%)`,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Dark/light mode adaptive overlay */}
              <div
                className="absolute inset-0 rounded-lg pointer-events-none hidden dark:block"
                style={{
                  background:
                    "radial-gradient(circle at 30% 40%, rgba(6, 182, 212, 0.12) 0%, rgba(17, 24, 39, 0.5) 60%)",
                }}
              />
              <div
                className="absolute inset-0 rounded-lg pointer-events-none block dark:hidden"
                style={{
                  background:
                    "radial-gradient(circle at 30% 40%, rgba(6, 182, 212, 0.05) 0%, rgba(241, 245, 249, 0.6) 60%)",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
                }}
              />

              {/* Content goes here - with dark/light mode adaptive classes */}
              <div className="relative z-10">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  Piyush{" "}
                  <span className="text-cyan-600 dark:text-cyan-400">Bhul</span>
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-2">
                  Hello, It&apos;s Me
                </h2>

                <div className="h-10 mt-4">
                  <h3
                    className="typing-text text-xl md:text-2xl font-semibold overflow-hidden border-r-2 border-cyan-500 dark:border-cyan-400 whitespace-nowrap inline-block pr-1 animate-pulse text-cyan-600 dark:text-cyan-400"
                    style={{ color: "inherit" }}
                  >
                    {typingText}
                  </h3>
                </div>

                <p className="mt-5 text-gray-700 dark:text-gray-200 leading-relaxed text-sm md:text-base">
                  I am a passionate full-stack developer with expertise in
                  frontend (React, Next.js), backend (Node.js, Express), and
                  databases. I combine technical expertise with problem-solving
                  creativity to develop efficient, user-friendly, and
                  future-ready solutions. Check out my blogs for technical
                  insights!
                </p>

                <div className="flex flex-wrap gap-4 mt-8">
                  {isAuthenticated ? (
                    <Link
                      to="/about"
                      className="px-6 py-3 bg-cyan-500 text-white dark:text-gray-900 font-semibold rounded-md hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105"
                      aria-label="Get Started with Piyush Bhul's Portfolio"
                    >
                      Get Started
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="px-6 py-3 bg-cyan-500 text-white dark:text-gray-900 font-semibold rounded-md hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105"
                      aria-label="Log in to Piyush Bhul's Portfolio"
                    >
                      Get Started
                    </Link>
                  )}

                  <Link
                    to="/blog"
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white dark:text-gray-900 font-semibold rounded-md hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
                    aria-label="Navigate to blog posts"
                  >
                    Read Articles
                  </Link>

                  <Link
                    to="/contact"
                    className="px-6 py-3 bg-transparent text-cyan-600 dark:text-cyan-400 font-semibold rounded-md border border-cyan-600 dark:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-400/10 transition-all duration-300 transform hover:scale-105"
                    aria-label="Contact Piyush Bhul for Hiring"
                  >
                    Hire Me
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Photo */}
          <div className="w-full md:w-2/5 flex justify-center md:justify-end order-1 md:order-2">
            <div className="relative group">
              <div
                className="absolute inset-0 border-4 border-cyan-400 rounded-lg transform rotate-12 animate-pulse group-hover:rotate-[-30deg] group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-teal-500 group-hover:animate-none transition-all duration-500 flex items-center justify-center"
                style={{
                  boxShadow:
                    "group-hover:0 0 20px rgba(6, 182, 212, 0.8), group-hover:0 0 40px rgba(13, 148, 136, 0.5)",
                }}
              >
                <span
                  className="text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                >
                  Jhuni
                </span>
              </div>
              <div className="relative rounded-lg overflow-hidden w-64 h-64 md:w-80 md:h-80 transition-transform duration-500 group-hover:-rotate-30 group-hover:scale-105">
                <img
                  alt="Piyush Bhul"
                  className="h-full object-cover w-full"
                  fetchPriority="high"
                  src="/profile.webp"
                  width="320"
                  height="320"
                  srcSet="/profile-lowres.webp 480w, /profile.webp 800w"
                  sizes="(max-width: 768px) 480px, 800px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
