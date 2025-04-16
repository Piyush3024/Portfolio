import { useState, useEffect, useRef } from "react";
import usePostStore from "../stores/usePostStore";
import useCommentStore from "../stores/useCommentStore";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

// Add this import at the top
import  useAuthStore  from "../stores/useAuthStore";

function BlogPage() {
  const { isAuthenticated } = useAuthStore();
  console.log("isAuthenticated:", isAuthenticated);
  const { posts, fetchPosts } = usePostStore();
  const { fetchCommentsByPost, addComment, updateComment, deleteComment } =
    useCommentStore();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const pageRef = useRef(null);
  const [activePost, setActivePost] = useState(null);
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [editedComment, setEditedComment] = useState("");
  const [postComments, setPostComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts().then((fetchedPosts) => {
      // After posts are fetched, get comment counts for each post
      if (Array.isArray(fetchedPosts) && fetchedPosts.length > 0) {
        fetchedPosts.forEach((post) => {
          fetchCommentsByPost(post.id)
            .then((comments) => {
              setCommentCounts((prev) => ({
                ...prev,
                [post.id]: Array.isArray(comments) ? comments.length : 0,
              }));
            })

            .catch((error) => {
              console.error(
                `Error fetching comments for post ${post.id}:`,
                error
              );
              setCommentCounts((prev) => ({ ...prev, [post.id]: 0 }));
            });
        });
      }
    });
  }, [fetchPosts, fetchCommentsByPost]);

  // Fetch comments when a post is activated
  useEffect(() => {
    if (activePost) {
      setLoadingComments((prev) => ({ ...prev, [activePost]: true }));
      fetchCommentsByPost(activePost)
        .then((comments) => {
          setPostComments((prev) => ({
            ...prev,
            [activePost]: Array.isArray(comments) ? comments : [],
          }));

          setLoadingComments((prev) => ({ ...prev, [activePost]: false }));
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
          setLoadingComments((prev) => ({ ...prev, [activePost]: false }));
          toast.error("Failed to load comments");
        });
    }
  }, [activePost, fetchCommentsByPost]);

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
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle comment submission
  const handleCommentSubmit = async (postId) => {
    if (!isAuthenticated) {
      toast.error("Please login to add a comment", {
        icon: '🔒',
        style: {
          background: '#374151',
          color: '#fff',
        },
      });
      return;
    }

    if (comment.trim() === "") return;

    try {
      const newComment = await addComment({
        content: comment,
        postId: postId,
      });

      // Add the new comment to our state
      setPostComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));
      setCommentCounts((prev) => ({
        ...prev,
        [postId]: (prev[postId] || 0) + 1,
      }));

      setComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  // Handle edit comment
  const handleSaveComment = async (postId, commentId) => {
    if (editedComment.trim() === "") return;

    try {
      const updatedComment = await updateComment(commentId, {
        content: editedComment,
      });

      // Update the comment in our state
      setPostComments((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).map((comment) =>
          comment.id === commentId
            ? { ...comment, content: editedComment }
            : comment
        ),
      }));

      setEditingComment(null);
      setEditedComment("");
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (postId, commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(commentId);

        // Remove the comment from our state
        setPostComments((prev) => ({
          ...prev,
          [postId]: (prev[postId] || []).filter(
            (comment) => comment.id !== commentId
          ),
        }));
        setCommentCounts((prev) => ({
          ...prev,
          [postId]: Math.max((prev[postId] || 0) - 1, 0),
        }));

        toast.success("Comment deleted successfully");
      } catch (error) {
        console.error("Error deleting comment:", error);
        toast.error("Failed to delete comment");
      }
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditedComment("");
  };

  // Add this function after other handle functions
  const handleEditComment = (postId, commentId, content) => {
    setEditingComment({
      postId,
      commentId,
    });
    setEditedComment(content);
  };

  const toggleComments = (postId) => {
    setActivePost((prevActivePost) =>
      prevActivePost === postId ? null : postId
    );
  };

  // Format date helper
  const formatCommentDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "Unknown date";
    }
  };

  // Check if a comment belongs to current user
  const isCurrentUserComment = (comment) => {
    // This logic depends on your authentication setup
    // You might need to check comment.userId against the current logged-in user
    return comment.isCurrentUser || comment.author?.id === "current-user-id";
  };

  return (
    <div
      ref={pageRef}
      className="min-h-[calc(100vh-4rem)] h-[100vh] md:mt-0 -mt-5 w-full md:w-[100vw] md:absolute left-0 md:top-12 md:overflow-y-hidden relative flex flex-col items-center px-4 md:px-8 lg:px-16 py-8"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.3) 0%, rgba(17, 24, 39, 0.95) 45%)`,
      }}
    >
      <div className="w-full max-w-6xl h-full">
        <div
          className="overflow-y-auto md:pb-2 pb-12 "
          style={{
            maxHeight: "calc(100vh - 8rem)",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(6, 182, 212, 0.5) rgba(17, 24, 39, 0.3)",
          }}
        >
          <div className="grid grid-cols-1 gap-8 md:w-[98%]">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="relative overflow-hidden rounded-lg bg-gray-800 bg-opacity-50 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.01]"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(17, 24, 39, 0.8) 0%, rgba(17, 24, 39, 0.95) 100%)`,
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    position: "relative", // Ensure proper stacking context
                    zIndex: 1
                  }}
                >
                  <div className="absolute inset-0 border-2 border-cyan-400 rounded-lg transform rotate-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img
                          src="/profile.jpg"
                          alt={post.author?.full_name || "Author"}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">
                          {post.author?.full_name || "Anonymous"}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {format(new Date(post.createdAt), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-3">
                      {post.title}
                    </h2>

                    <p className="text-gray-200 mb-4">{post.content}</p>

                    <div className="border-t border-gray-700 pt-4 mt-4">
                      <button
                        type="button"
                        className="text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2 py-2 px-3 z-10 relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault()
                          toggleComments(post.id);
                        }}
                        aria-expanded={activePost === post.id}
                        aria-controls={`comments-section-${post.id}`}
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
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        {/* {(postComments[post.id] || []).length}{" "} */}
                        {(postComments[post.id] || []).length === 1
                          ? "Comment"
                          : "Comments"}
                        {/* {commentCounts[post.id] || 0}{" "}
                          {commentCounts[post.id] === 1 ? "Comment" : "Comments"} */}
                        {activePost === post.id ? (
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
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        ) : (
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
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </button>

                      {activePost === post.id && (
                        <div
                          id={`comments-section-${post.id}`}
                          className="mt-4 transition-all duration-300"
                          style={{
                            animation: "fadeIn 0.3s ease-in-out",
                           
                            position: "relative",
                            zIndex: 30,
                          }}
                        >
                          <h4 className="text-white font-semibold mb-3 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2 text-cyan-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                              />
                            </svg>
                            Comments Section
                          </h4>

                          {loadingComments[post.id] ? (
                            <div className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-center">
                              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-cyan-400 border-r-transparent"></div>
                              <span className="ml-2 text-gray-300">
                                Loading comments...
                              </span>
                            </div>
                          ) : postComments[post.id] &&
                            postComments[post.id].length > 0 ? (
                            <div className="space-y-4 mb-4">
                              {postComments[post.id].map((comment) => (
                                <div
                                  key={comment.id}
                                  className={`bg-gray-800 p-4 rounded-lg border-l-4 ${
                                    isCurrentUserComment(comment)
                                      ? "border-cyan-400"
                                      : "border-gray-600"
                                  } transition-all duration-300`}
                                >
                                  {editingComment &&
                                  editingComment.postId === post.id &&
                                  editingComment.commentId === comment.id ? (
                                    // Edit mode
                                    <div>
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-white font-medium flex items-center">
                                          {comment.author?.full_name ||
                                            comment.author ||
                                            "Anonymous"}
                                          {isCurrentUserComment(comment) && (
                                            <span className="ml-2 text-xs bg-cyan-400 text-gray-900 px-2 py-0.5 rounded-full">
                                              You
                                            </span>
                                          )}
                                        </span>
                                        <span className="text-gray-400 text-xs">
                                          {formatCommentDate(
                                            comment.createdAt || comment.date
                                          )}
                                        </span>
                                      </div>
                                      <textarea
                                        value={editedComment}
                                        onChange={(e) =>
                                          setEditedComment(e.target.value)
                                        }
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors duration-300 mb-2"
                                        rows={3}
                                      />
                                      <div className="flex gap-2 justify-end">
                                        <button
                                          onClick={handleCancelEdit}
                                          className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors duration-300"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleSaveComment(
                                              post.id,
                                              comment.id
                                            )
                                          }
                                          className="px-3 py-1 bg-cyan-400 text-gray-900 rounded hover:bg-cyan-500 transition-colors duration-300"
                                        >
                                          Save
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    // View mode
                                    <div>
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-white font-medium flex items-center">
                                          {comment.author?.full_name ||
                                            comment.author ||
                                            "Anonymous"}
                                          {isCurrentUserComment(comment) && (
                                            <span className="ml-2 text-xs bg-cyan-400 text-gray-900 px-2 py-0.5 rounded-full">
                                              You
                                            </span>
                                          )}
                                        </span>
                                        <span className="text-gray-400 text-xs">
                                          {formatCommentDate(
                                            comment.createdAt || comment.date
                                          )}
                                        </span>
                                      </div>
                                      <p className="text-gray-300">
                                        {comment.content}
                                      </p>
                                      {isCurrentUserComment(comment) && (
                                        <div className="flex justify-end mt-2 gap-2">
                                          <button
                                            onClick={() =>
                                              handleEditComment(
                                                post.id,
                                                comment.id,
                                                comment.content
                                              )
                                            }
                                            className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center"
                                            aria-label="Edit comment"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-4 w-4 mr-1"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                              />
                                            </svg>
                                            Edit
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeleteComment(
                                                post.id,
                                                comment.id
                                              )
                                            }
                                            className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center"
                                            aria-label="Delete comment"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-4 w-4 mr-1"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                              />
                                            </svg>
                                            Delete
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-gray-800 p-4 rounded-lg mb-4 text-center">
                              <p className="text-gray-400">
                                No comments yet. Be the first to comment!
                              </p>
                            </div>
                          )}

                          <div className="mt-4">
                            <div className="bg-gray-800 p-4 rounded-lg">
                              <h5 className="text-white font-medium mb-2">
                                {isAuthenticated ? "Add a comment" : "Login to comment"}
                              </h5>
                              <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full bg-gray-700 border cursor-pointer border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors duration-300"
                                placeholder={isAuthenticated ? "Share your thoughts..." : "Please login to comment"}
                                rows={3}
                                disabled={!isAuthenticated}
                              ></textarea>
                              <div className="flex justify-end mt-2">
                                <button
                                  onClick={() => handleCommentSubmit(post.id)}
                                  disabled={!isAuthenticated || comment.trim() === ""}
                                  className={`px-4 py-2 rounded-md transition-colors duration-300 flex items-center ${
                                    !isAuthenticated || comment.trim() === ""
                                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                      : "bg-cyan-400 text-gray-900 hover:bg-cyan-500"
                                  }`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                  </svg>
                                  {isAuthenticated ? "Post Comment" : "Login to Comment"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No posts available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
