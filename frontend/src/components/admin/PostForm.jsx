function PostForm({ 
    isEditMode, 
    postForm, 
    handleFormChange, 
    handleSubmitPost, 
    handleCloseForm 
  }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
          <div className="flex justify-between items-start p-6 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-white">
              {isEditMode ? "Update Post" : "Add New Post"}
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
          <form onSubmit={handleSubmitPost}>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={postForm.title}
                  onChange={handleFormChange}
                  required
                  className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Slug*</label>
                <input
                  type="text"
                  name="slug"
                  value={postForm.slug}
                  onChange={handleFormChange}
                  required
                  placeholder="your-post-slug"
                  className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">URL-friendly version of the title (e.g., my-blog-post)</p>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={postForm.excerpt}
                  onChange={handleFormChange}
                  rows={2}
                  placeholder="Brief summary of your post"
                  className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Content*</label>
                <textarea
                  name="content"
                  value={postForm.content}
                  onChange={handleFormChange}
                  required
                  rows={8}
                  className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Featured Image URL</label>
                <input
                  type="url"
                  name="featured_image"
                  value={postForm.featured_image}
                  onChange={handleFormChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={postForm.tags}
                  onChange={handleFormChange}
                  placeholder="technology, tutorial, react (comma separated)"
                  className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Status*</label>
                <select
                  name="status"
                  value={postForm.status}
                  onChange={handleFormChange}
                  required
                  className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4 p-6 border-t border-gray-700">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 ${isEditMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-cyan-600 hover:bg-cyan-700'} text-white rounded-md`}
              >
                {isEditMode ? "Update Post" : "Add Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  export default PostForm;