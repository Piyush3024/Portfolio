
import { Edit, Trash } from "lucide-react";

function ProjectDetails({ 
  selectedProject, 
  formatDate, 
  handleCloseDetails, 
  handleEditProject, 
  handleDeleteClick 
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-start p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">
            Project Details
          </h3>
          <button
            onClick={handleCloseDetails}
            className="text-gray-400 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Project Name</label>
              <div className="text-white">{selectedProject.name}</div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Created Date</label>
              <div className="text-white">{formatDate(selectedProject.createdAt)}</div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Last Updated</label>
              <div className="text-white">{selectedProject.updatedAt ? formatDate(selectedProject.updatedAt) : 'Not updated'}</div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Owner</label>
              <div className="text-white">{selectedProject.user?.full_name || 'Unknown'}</div>
            </div>
          </div>
          
          {selectedProject.technologies && (
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-1">Technologies</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedProject.technologies.split(',').map((tech, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded-md"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {selectedProject.description && (
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-1">Description</label>
              <div className="bg-gray-800 p-4 rounded-md text-gray-200 whitespace-pre-wrap">
                {selectedProject.description}
              </div>
            </div>
          )}
          
          {/* Links section */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-1">Links</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {selectedProject.githubUrl ? (
                <a 
                  href={selectedProject.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-cyan-400 hover:text-cyan-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub Repository
                </a>
              ) : (
                <span className="text-gray-500">No GitHub URL provided</span>
              )}
              
              {selectedProject.liveUrl ? (
                <a 
                  href={selectedProject.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-green-400 hover:text-green-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Website
                </a>
              ) : (
                <span className="text-gray-500">No Live URL provided</span>
              )}
            </div>
          </div>
          
          {selectedProject.imageUrl && (
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-1">Project Image</label>
              <div className="mt-2">
                <img 
                  src={selectedProject.imageUrl} 
                  alt={selectedProject.name} 
                  className="max-h-60 rounded-md"
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-4 p-6 border-t border-gray-700">
          <button
            onClick={() => handleEditProject(selectedProject)}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(selectedProject)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <Trash size={16} />
            Delete
          </button>
          <button
            onClick={handleCloseDetails}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;