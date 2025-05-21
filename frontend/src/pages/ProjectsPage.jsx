import { useState, useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "../providers/ThemeProvider";
import useProjectStore from "../stores/useProjectStore.js";

function ProjectsPage() {
  const { projects, fetchProjects, isLoading } = useProjectStore();
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "teal";

  const pageRef = useRef(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;

  // Simulating API fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Pagination calculations
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Number of page numbers to show

    if (totalPages <= maxVisiblePages) {
      // If total pages are less than maxVisiblePages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of visible page numbers
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the start
      if (currentPage <= 2) {
        end = 4;
      }
      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      // Add ellipsis if needed
      if (start > 2) {
        pageNumbers.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div
      ref={pageRef}
      className=" max-w-full top-12 md:w-screen  flex flex-col items-center px-4 md:px-8 lg:px-16 py-8"
    >
      <Toaster />
      <h1
        className="text-3xl font-bold mb-8 text-center"
        style={{ color: textColor }}
      >
        Projects
      </h1>
      <div className="w-full animate-fadeIn">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center w-full py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-cyan-400 border-r-transparent align-[-0.125em]"></div>
            <p
              className="mt-4 text-lg font-medium"
              style={{ color: textColor }}
            >
              Loading Projects...
            </p>
          </div>
        ) : projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProjects.map((project) => (
                <div
                  key={project.id}
                  className="relative overflow-hidden rounded-lg h-64 md:h-72 group transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 border-2 border-cyan-400 rounded-lg transform rotate-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative h-full w-full overflow-hidden rounded-lg">
                    <img
                      src={project.imageUrl}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
                      style={{
                        background: `radial-gradient(circle at 50% 100%, rgba(6, 182, 212, 0.4) 0%, rgba(17, 24, 39, 0.8) 70%)`,
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <h3 className="text-xl font-bold text-white">
                        {project.name}
                      </h3>
                      <p className="text-gray-200 mt-2 text-sm">
                        {project.description}
                      </p>
                      <div className="flex gap-4 mt-4">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-cyan-400 text-gray-900 text-sm font-medium rounded hover:bg-cyan-500 transition-colors duration-300"
                        >
                          GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center space-x-2 mt-8">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-cyan-400 text-gray-900 hover:bg-cyan-500"
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
                      ? "bg-cyan-400 text-gray-900"
                      : number === "..."
                      ? "bg-transparent text-gray-400 cursor-default"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-cyan-400 text-gray-900 hover:bg-cyan-500"
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
            <p className="text-lg font-medium" style={{ color: textColor }}>
              No projects available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsPage;
