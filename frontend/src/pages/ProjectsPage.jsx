import  { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import useAuthStore from "../stores/useAuthStore.js"
import useProjectStore from "../stores/useProjectStore.js";

function ProjectsPage() {
  const {  projects } = useProjectStore();
  const { isAuthenticated } = useAuthStore()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const pageRef = useRef(null);

  //   const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock auth state
  // const [project, setProjects] = useState([
  //   {
  //     id: 1,
  //     name: "Spotify Clone",
  //     description:
  //       "A web application mimicking Spotify's interface and functionality.",
  //     imageUrl: "/spotify.jpeg",
  //     githubUrl: "https://github.com/your-repo",
  //     liveUrl: "https://your-live-demo.com",
  //   },
  //   {
  //     id: 2,
  //     name: "Netflix Clone",
  //     description: "A clone of Netflix's UI with basic streaming features.",
  //     imageUrl: "/netflix.jpeg",
  //     githubUrl: "https://github.com/your-repo",
  //     liveUrl: "https://your-live-demo.com",
  //   },
  //   {
  //     id: 3,
  //     name: "Snake Game",
  //     description:
  //       "A classic snake game built with JavaScript and HTML5 Canvas.",
  //     imageUrl: "/snake.jpeg",
  //     githubUrl: "https://github.com/your-repo",
  //     liveUrl: "https://your-live-demo.com",
  //   },
  //   {
  //     id: 4,
  //     name: "Calculator",
  //     description: "A simple calculator app with basic arithmetic operations.",
  //     imageUrl: "/calculator.jpeg",
  //     githubUrl: "https://github.com/your-repo",
  //     liveUrl: "https://your-live-demo.com",
  //   },
  //   {
  //     id: 5,
  //     name: "Adventure Game",
  //     description: "An interactive text-based adventure game.",
  //     imageUrl: "/adventure.jpeg",
  //     githubUrl: "https://github.com/your-repo",
  //     liveUrl: "https://your-live-demo.com",
  //   },
  //   {
  //     id: 6,
  //     name: "Analog Clock",
  //     description: "A functional analog clock using CSS and JavaScript.",
  //     imageUrl: "/analog.jpeg",
  //     githubUrl: "https://github.com/your-repo",
  //     liveUrl: "https://your-live-demo.com",
  //   },
  //   {
  //     id: 7,
  //     name: "Weather App",
  //     description: "Real-time weather application using external API.",
  //     imageUrl: "/logo.png",
  //     githubUrl: "https://github.com/your-repo",
  //     liveUrl: "https://your-live-demo.com",
  //   },
  //   {
  //     id: 8,
  //     name: "Todo List",
  //     description: "Task management application with local storage.",
  //     imageUrl: "/profile.jpg",
  //     githubUrl: "https://github.com/your-repo",
  //     liveUrl: "https://your-live-demo.com",
  //   },
  //   {
  //     id: 9,
  //     name: "Ecommerce App",
  //     description: "Online shopping platform with payment processing.",
  //     imageUrl: "/profile.jpg",
  //     githubUrl: "https://github.com/your-repo",
  //     liveUrl: "https://your-live-demo.com",
  //   },
  //   {
  //     id: 10,
  //     name: "Chat Application",
  //     description: "Real-time messaging app with WebSocket technology.",
  //     imageUrl: "/profile.jpg",
  //     githubUrl: "https://github.com/your-repo",
  //     liveUrl: "https://your-live-demo.com",
  //   },
  // ]);

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

  // Simulating API fetch
  useEffect(() => {
    // This would be your API call in the future
    // const fetchProjects = async () => {
    //   const response = await fetch('your-api-endpoint');
    //   const data = await response.json();
    //   setProjects(data);
    // };
    // fetchProjects();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-[calc(100vh-0rem)] w-full  top-12  md:w-[100vw] md:h-[100vh] md:absolute left-0 md:top-12 fixed flex flex-col items-center px-4 md:px-8 lg:px-16 py-8"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.3) 0%, rgba(17, 24, 39, 0.95) 45%)`,
      }}
    >
      <Toaster />
      <div className="w-full max-w-6xl">
        <div
          className="overflow-y-auto h-full overflow-x-hidden md:pb-0 pb-8"
          style={{
            maxHeight: "calc(100vh - 8rem)",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(6, 182, 212, 0.5) rgba(17, 24, 39, 0.3)",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
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
                      {isAuthenticated ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-cyan-400 text-gray-900 text-sm font-medium rounded hover:bg-cyan-500 transition-colors duration-300"
                        >
                          GitHub
                        </a>
                      ) : (
                        <div
                          className="px-3 py-1 bg-cyan-400 text-gray-900 text-sm font-medium rounded hover:bg-cyan-500 transition-colors duration-300"
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            toast.error("Please login to see the project")
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              toast.error("Please login to view the project");
                            }
                          }}
                        >
                          GitHub
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
