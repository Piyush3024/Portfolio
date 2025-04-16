import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast, Toaster } from "react-hot-toast";
import { Eye, Trash, Edit, Plus, Check, X, ToggleLeft, ToggleRight, MessageSquare } from "lucide-react";
import usePostStore from "../../stores/usePostStore";
import useCommentStore from "../../stores/useCommentStore";
import useMousePosition from "../../hooks/useMousePosition";
// import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

function PostsManage() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const mousePosition = useMousePosition(pageRef);
  
  // Add missing state variables
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [postToAction, setPostToAction] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    published: false
  });
  
  const { posts, fetchPosts, deletePost, togglePublishStatus, isLoading, error, fetchPostById, updatePost, createPost } = usePostStore();
  const { comments, fetchComments } = useCommentStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [postToDelete, setPostToDelete] = useState(null);
  
  // Fetch posts and comments on component mount
  useEffect(() => {
    fetchPosts();
    fetchComments(); // Fetch comments to get counts
  }, [fetchPosts, fetchComments]);

  // console.log("Comments: ", comments)



  // Calculate comment counts - Fix the error by accessing comments.data
  // const commentCountByPost = comments && comments.data ? comments.data.reduce((acc, comment) => {
  //   acc[comment.postId] = (acc[comment.postId] || 0) + 1;
  //   return acc;
  // }, {}) : {};

  // Handle view comments
  const handleViewComments = (post) => {

    navigate(`/adminComment`, { state: {post : post} });
  };

  // Add missing handler functions
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleViewDetails = async (post) => {
    try {
      const postDetails = await fetchPostById(post.id);
      setSelectedPost(postDetails || post);
      setIsViewDetailsOpen(true);
    } catch (err) {
      toast.error("Failed to fetch post details");
    }
  };

  const handleCloseDetails = () => {
    setIsViewDetailsOpen(false);
    setSelectedPost(null);
  };

  const handleDeleteClick = (post) => {
    setPostToAction(post);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToAction) return;
    
    try {
      await deletePost(postToAction.id);
      toast.success("Post deleted successfully");
      if (isViewDetailsOpen && selectedPost?.id === postToAction.id) {
        setIsViewDetailsOpen(false);
      }
    } catch (err) {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleteConfirmOpen(false);
      setPostToAction(null);
    }
  };

  const cancelAction = () => {
    setIsDeleteConfirmOpen(false);
    setPostToAction(null);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDateFilter({
      startDate: "",
      endDate: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPostForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddPost = () => {
    setPostForm({
      title: "",
      content: "",
      published: false
    });
    setIsEditMode(false);
    setIsPostFormOpen(true);
  };

  const handleEditPost = (post) => {
    setPostForm({
      id: post.id,
      title: post.title || "",
      content: post.content || "",
      published: post.published || false
    });
    setIsEditMode(true);
    setIsPostFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsPostFormOpen(false);
    setPostForm({
      title: "",
      content: "",
      published: false
    });
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditMode) {
        await updatePost(postForm.id, postForm);
        toast.success("Post updated successfully");
      } else {
        await createPost(postForm);
        toast.success("Post created successfully");
      }
      handleCloseForm();
    } catch (err) {
      toast.error(isEditMode ? "Failed to update post" : "Failed to create post");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Add this properly formatted function
  const handleToggleStatus = async (post) => {
    try {
      const updatedPost = {
        ...post,
        published: !post.published
      };
      await updatePost(post.id, updatedPost);
      toast.success(`Post status changed to ${updatedPost.published ? 'Published' : 'Draft'}`);
    } catch (err) {
      toast.error("Failed to update post status");
    }
  };

  // Filter posts based on search and date filters
  const filteredPosts = posts.filter(post => {
    // Search filter
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filter
    let matchesDate = true;
    if (dateFilter.startDate) {
      const startDate = new Date(dateFilter.startDate);
      const postDate = new Date(post.createdAt);
      matchesDate = matchesDate && postDate >= startDate;
    }
    if (dateFilter.endDate) {
      const endDate = new Date(dateFilter.endDate);
      endDate.setHours(23, 59, 59, 999); // End of the day
      const postDate = new Date(post.createdAt);
      matchesDate = matchesDate && postDate <= endDate;
    }
    
    return matchesSearch && matchesDate;
  }).sort((a, b) => {
    if (sortConfig.key === "title") {
      return sortConfig.direction === "asc" 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortConfig.key === "createdAt") {
      return sortConfig.direction === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

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
            <h1 className="text-3xl md:text-4xl font-bold text-white">Blog Post Management</h1>
            <p className="text-gray-300 mt-2">
              View and manage all blog posts, track status, and update content
            </p>
          </div>
          <button
            onClick={handleAddPost}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition"
          >
            <Plus size={18} />
            Add Post
          </button>
        </div>

        {/* Controls section */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-4 md:p-6 mb-6">
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by title or content..."
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
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
            </div>
          </div>
        </div>

        {/* Post list section */}
        <div className="flex-1 overflow-hidden flex flex-col bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 p-4 text-center">
              {error}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-gray-400 p-8 text-center">
              No posts found matching your criteria
            </div>
          ) : (
            <div className="overflow-auto h-full">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800 sticky top-0">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center">
                        Title
                        {sortConfig.key === "title" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
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
                      Author
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 bg-opacity-50 divide-y divide-gray-800">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-200">
                          {post.title}
                        </div>
                        <div className="text-xs text-gray-400 truncate max-w-xs">
                          {post.content?.substring(0, 60)}{post.content?.length > 60 ? '...' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => handleToggleStatus(post)}
                          className="flex items-center gap-1 group"
                          title={post.published ? "Click to unpublish" : "Click to publish"}
                        >
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.published ? 'bg-green-100 text-green-800 group-hover:bg-yellow-100 group-hover:text-yellow-800' : 'bg-yellow-100 text-yellow-800 group-hover:bg-green-100 group-hover:text-green-800'
                          } transition-colors`}>
                            {post.published ? (
                              <>
                                <ToggleRight size={14} className="mr-1" />
                                Published
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={14} className="mr-1" />
                                Draft
                              </>
                            )}
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {formatDate(post.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {post.author?.full_name || "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleViewDetails(post)}
                            className="text-cyan-400 hover:text-cyan-300"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditPost(post)}
                            className="text-yellow-400 hover:text-yellow-300"
                            title="Edit Post"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleViewComments(post)} // Call the new function here
                            className="text-blue-400 hover:text-blue-300 relative"
                            title="View Comments"
                          >
                            <MessageSquare size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(post)}
                            className="text-red-400 hover:text-red-300"
                            title="Delete Post"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Post Form Modal */}
      {isPostFormOpen && (
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
                  <label className="block text-gray-400 text-sm mb-1">Post Title*</label>
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
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={postForm.published}
                    onChange={handleFormChange}
                    className="w-4 h-4 text-cyan-600 bg-gray-800 border-gray-700 rounded focus:ring-cyan-500"
                  />
                  <label htmlFor="published" className="ml-2 text-gray-300">
                    Publish this post
                  </label>
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
      )}

      {/* Post Details Modal */}
      {isViewDetailsOpen && selectedPost && (
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
                  <label className="block text-gray-400 text-sm mb-1">Post Title</label>
                  <div className="text-white">{selectedPost.title}</div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Slug</label>
                  <div className="text-white">{selectedPost.slug}</div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Created Date</label>
                  <div className="text-white">{formatDate(selectedPost.createdAt)}</div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Last Updated</label>
                  <div className="text-white">{selectedPost.updatedAt ? formatDate(selectedPost.updatedAt) : 'Not updated'}</div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Author</label>
                  <div className="text-white">{selectedPost.author?.full_name || 'Unknown'}</div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Status</label>
                  <div className="flex items-center">
                    {selectedPost.published ? (
                      <span className="flex items-center text-green-400">
                        <Check size={16} className="mr-1" /> Published
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-400">
                        <X size={16} className="mr-1" /> Draft
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedPost.content && (
                <div className="mb-6">
                  <label className="block text-gray-400 text-sm mb-1">Content</label>
                  <div className="bg-gray-800 p-4 rounded-md text-gray-200 whitespace-pre-wrap">
                    {selectedPost.content}
                  </div>
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
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete post &quot;{postToAction?.title}&quot;? This action cannot be undone and will remove all associated data.
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

export default PostsManage;