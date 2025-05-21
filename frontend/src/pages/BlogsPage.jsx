import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import usePostStore from "../stores/usePostStore";
import { format } from "date-fns";
import { JhuniIcon } from "../components/icons";
import { useTheme } from "../providers/ThemeProvider";

function BlogsPage() {
  const { posts, fetchPosts, isLoading } = usePostStore();
  const { theme } = useTheme();
  const pageRef = useRef(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Function to create a short snippet from content
  const createSnippet = (content, maxLength = 150) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 4;
      }
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pageNumbers.push("...");
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (end < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div
      ref={pageRef}
      className={`max-w-full top-12 md:w-screen flex flex-col items-center px-4 md:px-8 lg:px-16 py-8 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <h1 className={`text-4xl font-bold mb-2 text-center ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        Blog Posts
      </h1>
      <p className={`text-lg mb-8 text-center ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
      }`}>
        Explore our latest articles and insights
      </p>
      <div className="w-full animate-fadeIn">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center w-full py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-cyan-400 border-r-transparent align-[-0.125em]"></div>
            <p className={`mt-4 text-lg font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Loading posts...
            </p>
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <Link to={`/blog/${post.id}`} key={post.id} className="group h-full">
                  <div className={`${
                    theme === 'dark' 
                      ? 'bg-gray-800 hover:shadow-cyan-400/20' 
                      : 'bg-white hover:shadow-cyan-600/20'
                  } rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl transform hover:translate-y-[-5px] flex flex-col h-full`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.featured_image || "./blog.webp"}
                        alt={post.title}
                        loading="lazy"
                        width="400"
                        height="192"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${
                        theme === 'dark' 
                          ? 'from-gray-900' 
                          : 'from-gray-800'
                      } via-transparent to-transparent opacity-70`}></div>
                      <div className="absolute top-4 right-4 bg-cyan-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                        {post.category || "Jhuni"}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <div className={`flex items-center text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      } mb-3`}>
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span>
                          {format(new Date(post.createdAt), "MMM dd, yyyy")}
                        </span>
                      </div>

                      <h3 className={`text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {post.title}
                      </h3>

                      <div className="flex-grow">
                        <p className={`text-sm mb-4 line-clamp-3 h-18 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {createSnippet(post.content)}
                        </p>
                      </div>

                      <div className={`flex items-center justify-between pt-2 border-t ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      } mt-auto`}>
                        <div className="flex items-center gap-1">
                          <JhuniIcon className="w-8 h-8" />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {post.author?.full_name || "Admin"}
                          </span>
                        </div>

                        <div className="text-cyan-400 inline-flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform">
                          Read More
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center space-x-2 mt-12">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? theme === 'dark'
                      ? 'bg-gray-700 text-gray-500'
                      : 'bg-gray-200 text-gray-400'
                    : 'bg-cyan-400 text-gray-900 hover:bg-cyan-500'
                } transition-colors duration-300`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((number, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof number === "number" && handlePageChange(number)
                  }
                  className={`px-3 py-1 rounded-md ${
                    number === currentPage
                      ? 'bg-cyan-400 text-gray-900'
                      : number === "..."
                      ? theme === 'dark'
                        ? 'bg-transparent text-gray-400'
                        : 'bg-transparent text-gray-500'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-colors duration-300`}
                  disabled={number === "..."}
                >
                  {number}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? theme === 'dark'
                      ? 'bg-gray-700 text-gray-500'
                      : 'bg-gray-200 text-gray-400'
                    : 'bg-cyan-400 text-gray-900 hover:bg-cyan-500'
                } transition-colors duration-300`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full py-20">
            <p className={`text-lg font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No posts available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogsPage;