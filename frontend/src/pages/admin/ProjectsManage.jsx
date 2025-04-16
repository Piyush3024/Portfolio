import { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import useProjectStore from "../../stores/useProjectStore.js";
import { format } from "date-fns";
import { Eye, Trash, Edit, Plus } from "lucide-react";
import ProjectForm from "../../components/admin/ProjectForm.jsx";
import ProjectDetails from "../../components/admin/ProjectDetails.jsx";

function ProjectsManage() {
  const { 
    projects, 
    selectedProject,
    fetchProjects, 
    fetchProjectById,
    updateProject,
    createProject,
    deleteProject,
    isLoading, 
    error 
  } = useProjectStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [projectToAction, setProjectToAction] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    githubUrl: "",
    liveUrl: "",
    technologies: "",
    imageUrl: ""
  });
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  
  const pageRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
       await fetchProjects();
      
      } catch (err) {
        toast.error("Failed to fetch projects");
      }
    };
    
    fetchData();
  }, [fetchProjects]);

  // Apply filters and search
  useEffect(() => {
    let result = [...projects];
    
    // Apply date filter if both dates are provided
    if (dateFilter.startDate && dateFilter.endDate) {
      const startDate = new Date(dateFilter.startDate);
      const endDate = new Date(dateFilter.endDate);
      endDate.setHours(23, 59, 59, 999); // Set to end of day

      result = result.filter((project) => {
        const projectDate = new Date(project.created_at);
        return projectDate >= startDate && projectDate <= endDate;
      });
    }

    // Apply search
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (project) =>
          (project.title && project.title.toLowerCase().includes(term)) ||
          (project.name && project.name.toLowerCase().includes(term)) ||
          (project.description && project.description.toLowerCase().includes(term))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredProjects(result);
  }, [projects, searchTerm, dateFilter, sortConfig]);

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

  // Handler functions
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewDetails = async (project) => {
    try {
      await fetchProjectById(project.id);
      setProjectToAction(project);
      setIsViewDetailsOpen(true);
    } catch (err) {
      toast.error("Failed to fetch project details");
    }
  };

  const handleCloseDetails = () => {
    setIsViewDetailsOpen(false);
    setProjectToAction(null);
  };

  const handleDeleteClick = (project) => {
    setProjectToAction(project);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToAction) return;
    
    try {
      await deleteProject(projectToAction.id);
      toast.success("Project deleted successfully");
      if (isViewDetailsOpen && selectedProject?.id === projectToAction.id) {
        setIsViewDetailsOpen(false);
      }
    } catch (err) {
      toast.error("Failed to delete project");
    } finally {
      setIsDeleteConfirmOpen(false);
      setProjectToAction(null);
    }
  };

  const cancelAction = () => {
    setIsDeleteConfirmOpen(false);
    setProjectToAction(null);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDateFilter({
      startDate: "",
      endDate: "",
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Handler for adding a new project
  const handleAddProject = () => {
    setProjectForm({
      name: "",
      description: "",
      githubUrl: "",
      liveUrl: "",
      technologies: "",
      imageUrl: ""
    });
    setIsEditMode(false);
    setIsProjectFormOpen(true);
  };

  // Handler for editing a project
  const handleEditProject = (project) => {
    setProjectForm({
      name: project.name || "",
      description: project.description || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      technologies: project.technologies || "",
      imageUrl: project.imageUrl || ""
    });
    setProjectToAction(project);
    setIsEditMode(true);
    setIsProjectFormOpen(true);
  };

  // Handler for form field changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler for form submission
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditMode && projectToAction) {
        await updateProject(projectToAction.id, projectForm);
        toast.success("Project updated successfully");
      } else {
        await createProject(projectForm);
        console.log("Project :", projectForm);
        toast.success("Project created successfully");
      }
      setIsProjectFormOpen(false);
      setProjectToAction(null);
    } catch (err) {
      toast.error(isEditMode ? "Failed to update project" : "Failed to create project");
    }
  };

  // Handler for closing the form
  const handleCloseForm = () => {
    setIsProjectFormOpen(false);
    setProjectToAction(null);
    setIsEditMode(false);
  };

  return (
    <div
      ref={pageRef}
      className="md:min-h-[calc(100vh-7rem)] h-[85vh] py-6 md:overflow-hidden overflow-y-auto md:mt-0 -mt-5 w-full md:w-screen md:absolute left-0 md:top-12 relative flex flex-col px-4 md:px-8 lg:px-16"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.3) 0%, rgba(17, 24, 39, 0.95) 45%)`,
      }}
    >
      <Toaster />
      
      <div className="flex flex-col h-full">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Project Management</h1>
            <p className="text-gray-300 mt-2">
              View and manage all projects, track status, and update project information
            </p>
          </div>
          <button
            onClick={handleAddProject}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition"
          >
            <Plus size={18} />
            Add Project
          </button>
        </div>

        {/* Controls section */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by title or description..."
                  className="w-full p-3 pl-10 bg-gray-900 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={dateFilter.startDate}
                  onChange={handleDateFilterChange}
                  className="w-full p-3 bg-gray-900 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={dateFilter.endDate}
                  onChange={handleDateFilterChange}
                  className="w-full p-3 bg-gray-900 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                />
              </div>
              <div className="self-end">
                <button
                  onClick={resetFilters}
                  className="p-3 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-gray-300">
              {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"} found
            </div>
          </div>
        </div>

        {/* Project list section */}
        <div className="flex-1 overflow-hidden flex flex-col bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 p-4 text-center">
              {error}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-gray-400 p-8 text-center">
              No projects found matching your criteria
            </div>
          ) : (
            <div className="overflow-auto h-full">
              <table className="min-w-full divide-y divide-gray-700">

                <thead className="bg-gray-800 sticky top-0">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Project Name
                        {sortConfig.key === "name" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Links
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        Created Date
                        {sortConfig.key === "createdAt" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                

                <tbody className="bg-gray-900 bg-opacity-50 divide-y divide-gray-800">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-200">
                          {project.name}
                        </div>
                        <div className="text-xs text-gray-400 truncate max-w-xs">
                          {project.description?.substring(0, 60)}{project.description?.length > 60 ? '...' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-3">
                          {project.githubUrl && (
                            <a 
                              href={project.githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                              GitHub
                            </a>
                          )}
                          {project.liveUrl && (
                            <a 
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-green-400 hover:text-green-300 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Live
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {formatDate(project.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {project.user?.full_name || "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(project)}
                          className="text-cyan-400 hover:text-cyan-300 mr-4"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditProject(project)}
                          className="text-yellow-400 hover:text-yellow-300 mr-4"
                          title="Edit Project"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(project)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete Project"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Project Form Modal */}
      {isProjectFormOpen && (
        <ProjectForm 
          isEditMode={isEditMode}
          projectForm={projectForm}
          handleFormChange={handleFormChange}
          handleSubmitProject={handleSubmitProject}
          handleCloseForm={handleCloseForm}
        />
      )}

      {/* Project Details Modal */}
      {isViewDetailsOpen && selectedProject && (
        <ProjectDetails 
          selectedProject={selectedProject}
          formatDate={formatDate}
          handleCloseDetails={handleCloseDetails}
          handleEditProject={handleEditProject}
          handleDeleteClick={handleDeleteClick}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete project &quot;{projectToAction?.name || projectToAction?.title}&quot;? This action cannot be undone and will remove all associated data.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelAction}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Trash size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsManage;