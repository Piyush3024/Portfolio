import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { Trash, ArrowLeft, MessageSquare } from "lucide-react";
import useCommentStore from "../../stores/useCommentStore";
import usePostStore from "../../stores/usePostStore";
import useMousePosition from "../../hooks/useMousePosition";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

function CommentsManage() {
  const navigate = useNavigate();
  const location = useLocation();
  const pageRef = useRef(null);
  const mousePosition = useMousePosition(pageRef);

  // Extract post from location state if available
  const post = location.state?.post;

  const {
    comments,
    fetchComments,
    fetchCommentsByPost,
    deleteComment,
    isLoading,
    error,
  } = useCommentStore();

  const { posts, fetchPosts } = usePostStore();

  const [selectedPostId, setSelectedPostId] = useState(post?.id || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;


  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Fetch comments based on selected post or fetch all comments
  useEffect(() => {
    const loadComments = async () => {
      try {
        if (selectedPostId) {
          await fetchCommentsByPost(selectedPostId);
        } else {
          await fetchComments();
        }
      } catch (err) {
        console.error("Error loading comments:", err);
      }
    };

    loadComments();
  }, [selectedPostId, fetchCommentsByPost, fetchComments]);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Handle sort
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle delete click
  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment);
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (commentToDelete) {
      setIsDeleting(true);
      setShowDeleteModal(false);
      
      try {
        await deleteComment(commentToDelete.id);
        toast.success("Comment deleted successfully");
        setShowDeleteModal(false);

        // Refresh comments after deletion
        if (selectedPostId) {
          await fetchCommentsByPost(selectedPostId);
        } else {
          await fetchComments();
        }
      } catch (error) {
        toast.error("Failed to delete comment");
      }

      setIsDeleting(false);
      
    }
  };

  // Handle back to posts
  const handleBackToPosts = () => {
    navigate("/adminPost");
  };

  // Filter and sort comments
  const filteredComments = (comments || [])
    .filter((comment) => {
      // Apply search filter
      return (
        comment.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (comment.author?.full_name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortConfig.key === "createdAt") {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortConfig.key === "author") {
        const authorA = a.author?.full_name || "";
        const authorB = b.author?.full_name || "";
        return sortConfig.direction === "asc"
          ? authorA.localeCompare(authorB)
          : authorB.localeCompare(authorA);
      }
      return 0;
    });

  // Get post title by ID
  const getPostTitle = (postId) => {
    const foundPost = posts.find((p) => p.id === postId);
    return foundPost ? foundPost.title : post?.title || "Unknown Post";
  };

  // Count comments by post
  const commentCountByPost = (comments || []).reduce((acc, comment) => {
    if (comment && comment.postId) {
      acc[comment.postId] = (acc[comment.postId] || 0) + 1;
    }
    return acc;
  }, {});

  // Pagination calculations
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

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
      className=" py-6 overflow-y-auto max-w-full mt-14 relative flex flex-col px-4 md:px-8 lg:px-16"
     
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBackToPosts}
            className="mr-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} className="text-cyan-400" />
          </button>
          <h1 className="text-2xl font-bold text-white">
            {selectedPostId
              ? `Comments for "${getPostTitle(selectedPostId)}"`
              : "All Comments"}
          </h1>
        </div>
        <div className="text-white bg-gray-800 px-4 py-2 rounded-lg">
          <span className="font-bold">{filteredComments.length}</span> comments
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search comments..."
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <select
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={selectedPostId || ""}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedPostId(value === "" ? null : parseInt(value));
            }}
          >
            <option value="">All Posts</option>
            {posts.map((post) => (
              <option key={post.id} value={post.id}>
                {post.title} ({commentCountByPost[post.id] || 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-hidden flex flex-col bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-red-500">
            <p>Error loading comments: {error}</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>No comments found</p>
          </div>
        ) : (
          <div className="overflow-auto h-full">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Post Title
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center">
                      Date
                      {sortConfig.key === "createdAt" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("author")}
                  >
                    <div className="flex items-center">
                      Author
                      {sortConfig.key === "author" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 bg-opacity-50 divide-y divide-gray-800">
                {currentComments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-200">
                        {comment.content}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {comment.post?.title ||
                          getPostTitle(comment.postId) ||
                          "Unknown Post"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {formatDate(comment.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {comment.author?.full_name || "Anonymous"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleDeleteClick(comment)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete Comment"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {filteredComments.length > 0 && (
              <div className="flex justify-center items-center space-x-2 mt-8 mb-4">
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
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
      />
    </div>
  );
}

export default CommentsManage;
