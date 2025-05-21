function ProjectForm({
  isEditMode,
  projectForm,
  handleFormChange,
  handleSubmitProject,
  handleCloseForm,
  isSubmitting,
}) {
  const handleImageChange = (e, handleFormChange) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Create a synthetic event object to work with existing handleFormChange
        const synthEvent = {
          target: {
            name: "imageUrl",
            value: reader.result,
          },
        };
        handleFormChange(synthEvent);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-start p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">
            {isEditMode ? "Update Project" : "Add New Project"}
          </h3>
          <button
            onClick={handleCloseForm}
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
        <form onSubmit={handleSubmitProject}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">
                Project Name*
              </label>
              <input
                type="text"
                name="name"
                value={projectForm.name}
                onChange={handleFormChange}
                required
                className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">
                Description*
              </label>
              <textarea
                name="description"
                value={projectForm.description}
                onChange={handleFormChange}
                required
                rows={4}
                className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                name="githubUrl"
                value={projectForm.githubUrl}
                onChange={handleFormChange}
                className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">
                Live URL
              </label>
              <input
                type="url"
                name="liveUrl"
                value={projectForm.liveUrl}
                onChange={handleFormChange}
                className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">
                Technologies*
              </label>
              <input
                type="text"
                name="technologies"
                value={projectForm.technologies}
                onChange={handleFormChange}
                required
                placeholder="React, Node.js, Express, MySQL (comma separated)"
                className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Image</label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  id="image"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, handleFormChange)}
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  <svg
                    className="h-5 w-5 inline-block mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Upload Image
                </label>
                {projectForm.imageUrl && (
                  <span className="ml-3 text-sm text-gray-400">
                    Image uploaded
                  </span>
                )}
              </div>
              {projectForm.imageUrl && (
                <img
                  src={projectForm.imageUrl}
                  alt="Preview"
                  className="mt-2 h-32 w-auto rounded-md"
                />
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4 p-6 border-t border-gray-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 ${
                isEditMode
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-cyan-600 hover:bg-cyan-700"
              } text-white rounded-md flex items-center justify-center`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : isEditMode ? (
                "Update Project"
              ) : (
                "Add Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectForm;
