import { Edit, Trash, Eye } from "lucide-react";

function PostDetails({ 
  selectedPost, 
  formatDate, 
  handleCloseDetails, 
  handleEditPost, 
  handleDeleteClick 
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-start p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">
            Post Details
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
              <label className="block text-gray-400 text-sm mb-1">Title</label>
              <div className="text-white">{selectedPost.title}</div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Status</label>
              <div className="text-white">
                <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${
                  selectedPost.status === 'published' ? 'bg-green-500' :
                  selectedPost.status === 'draft' ? 'bg-yellow-500' :
                  selectedPost.status === 'archived' ? 'bg-gray-500' : 'bg-blue-500'
                }`}>
                  {selectedPost.status || 'Draft'}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Created Date</label>
              <div className="text-white">{formatDate(selectedPost.created_at)}</div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Last Updated</label>
              <div className="text-white">{selectedPost.updated_at ? formatDate(selectedPost.updated_at) : 'Not updated'}</div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Author</label>
              <div className="text-white">{selectedPost.author?.name || 'Anonymous'}</div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Slug</label>
              <div className="text-white break-all">{selectedPost.slug || 'No slug defined'}</div>
            </div>
          </div>
          
          {selectedPost.tags && selectedPost.tags.length > 0 && (
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedPost.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {selectedPost.excerpt && (
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-1">Excerpt</label>
              <div className="bg-gray-800 p-4 rounded-md text-gray-200">
                {selectedPost.excerpt}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-1">Content</label>
            <div className="bg-gray-800 p-4 rounded-md text-gray-200 whitespace-pre-wrap max-h-64 overflow-y-auto">
              {selectedPost.content || "No content available"}
            </div>
          </div>
          
          {selectedPost.featured_image && (
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-1">Featured Image</label>
              <div className="mt-2">
                <img 
                  src={selectedPost.featured_image} 
                  alt={selectedPost.title} 
                  className="max-h-60 rounded-md"
                />
              </div>
            </div>
          )}
          
          {selectedPost.permalink && (
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-1">Permalink</label>
              <a 
                href={selectedPost.permalink}
                target="_blank"
                rel="noopener noreferrer" 
                className="text-cyan-400 hover:text-cyan-300 flex items-center"
              >
                <Eye size={16} className="mr-2" />
                View Post on Website
              </a>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-4 p-6 border-t border-gray-700">
          <button
            onClick={() => handleEditPost(selectedPost)}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(selectedPost)}
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

export default PostDetails;