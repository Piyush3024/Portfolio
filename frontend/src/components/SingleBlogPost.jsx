import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { format, isValid, parseISO } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import usePostStore from "../stores/usePostStore";
import useCommentStore from "../stores/useCommentStore";
import useAuthStore from "../stores/useAuthStore";
import { toast } from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../providers/ThemeProvider";

function SingleBlogPost() {
  const { theme } = useTheme();
  const { id, slug } = useParams();
  const {
    selectedPost,
    fetchPostById,
    fetchPostBySlug,
    posts,
    fetchPosts,
    isLoading,
  } = usePostStore();
  const { fetchCommentsByPost, addComment, updateComment, deleteComment } =
    useCommentStore();
  const { isAuthenticated } = useAuthStore();

  // States for comment handling
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  // State for mouse position effects
  const pageRef = useRef(null);

  // State for related posts
  const [relatedPosts, setRelatedPosts] = useState([]);

  // Fetch the post when component mounts
  useEffect(() => {
    if (id) {
      fetchPostById(id);
    } else if (slug) {
      fetchPostBySlug(slug);
    }

    if (posts.length === 0) {
      fetchPosts();
    }
  }, [id, slug, fetchPostById, fetchPostBySlug, fetchPosts, posts.length]);

  // Fetch comments for the post
  useEffect(() => {
    if (selectedPost?.id) {
      setLoadingComments(true);
      fetchCommentsByPost(selectedPost.id)
        .then((fetchedComments) => {
          setComments(Array.isArray(fetchedComments) ? fetchedComments : []);
          setLoadingComments(false);
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
          setLoadingComments(false);
          toast.error("Failed to load comments");
        });
    }
  }, [selectedPost, fetchCommentsByPost]);

  // Find related posts based on matching categories or author
  useEffect(() => {
    if (selectedPost && posts.length > 0) {
      const related = posts
        .filter((post) => {
          if (post.id === selectedPost.id) return false;
          if (post.author?.id === selectedPost.author?.id) return true;
          if (post.categories && selectedPost.categories) {
            return post.categories.some((cat) =>
              selectedPost.categories.includes(cat)
            );
          }
          return false;
        })
        .slice(0, 3);

      if (related.length < 3) {
        const remainingPosts = posts
          .filter(
            (post) =>
              post.id !== selectedPost.id &&
              !related.find((r) => r.id === post.id)
          )
          .slice(0, 3 - related.length);
        setRelatedPosts([...related, ...remainingPosts]);
      } else {
        setRelatedPosts(related);
      }
    }
  }, [selectedPost, posts]);

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
  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add a comment", {
        icon: "🔒",
        style: {
          background: "#374151",
          color: "#fff",
        },
      });
      return;
    }

    if (comment.trim() === "") return;

    try {
      const newComment = await addComment({
        content: comment,
        postId: selectedPost.id,
      });

      setComments((prev) => [...prev, newComment]);
      setComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  // Handle edit comment
  const handleSaveComment = async (commentId) => {
    if (editedComment.trim() === "") return;

    try {
      await updateComment(commentId, {
        content: editedComment,
      });

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: editedComment }
            : comment
        )
      );

      setEditingComment(null);
      setEditedComment("");
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(commentId);
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
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

  // Start editing a comment
  const handleEditComment = (commentId, content) => {
    setEditingComment(commentId);
    setEditedComment(content);
  };

  // Format date helper with improved error handling
  const formatCommentDate = (dateString) => {
    try {
      const date =
        typeof dateString === "string"
          ? parseISO(dateString)
          : new Date(dateString);

      if (!isValid(date)) {
        return "Unknown date";
      }

      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Unknown date";
    }
  };

  // Check if a comment belongs to current user
  const isCurrentUserComment = (comment) => {
    return comment.isCurrentUser || comment.author?.id === "current-user-id";
  };

  // Helper to share on social media
  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const title = selectedPost?.title || "Check out this blog post";

    let shareUrl;

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  // Safe date formatting function for post dates
  const formatPostDate = (dateString) => {
    try {
      const date =
        typeof dateString === "string"
          ? parseISO(dateString)
          : new Date(dateString);

      if (!isValid(date)) {
        return "Unknown date";
      }

      return format(date, "MMMM d, yyyy");
    } catch (error) {
      console.error("Error formatting post date:", error, dateString);
      return "Unknown date";
    }
  };

  if (isLoading || !selectedPost) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-20">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-cyan-400 border-r-transparent align-[-0.125em]"></div>
        <p className={`mt-4 text-cyan-400 text-lg font-medium ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
          Loading post...
        </p>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className={`max-w-full flex flex-col items-center px-4 md:px-8 lg:px-16 py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="w-full">
        {/* Back button */}
        <Link
          to="/blog"
          className={`inline-flex items-center mb-6 ${theme === 'dark' ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'} transition-colors duration-300`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to all posts
        </Link>

        {/* Blog post content */}
        <div
          className={`relative overflow-hidden rounded-lg ${theme === 'dark' ? 'bg-gray-800 bg-opacity-50' : 'bg-white'} backdrop-blur-sm mb-8`}
          style={{
            background: theme === 'dark' 
              ? `radial-gradient(circle at 50% 50%, rgba(17, 24, 39, 0.8) 0%, rgba(17, 24, 39, 0.95) 100%)`
              : `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.95) 100%)`,
            boxShadow: theme === 'dark' 
              ? "0 4px 30px rgba(0, 0, 0, 0.1)"
              : "0 4px 30px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="p-6 md:p-8">
            {/* Author info and date */}
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <img
                  src="/profile.webp"
                  alt={selectedPost.author?.full_name || "Author"}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className={`font-medium text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {selectedPost.author?.full_name || "Anonymous"}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatPostDate(selectedPost.createdAt)}
                </p>
              </div>
            </div>

            {/* Post title */}
            <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {selectedPost.title}
            </h1>

            {/* Featured image */}
            {selectedPost.featured_image && (
              <div className="mb-6">
                <img
                  src={selectedPost.featured_image}
                  alt={selectedPost.title}
                  className="w-full h-auto rounded-lg object-cover max-h-96"
                  loading="lazy"
                />
              </div>
            )}

            {/* Post content */}
            <div className={`prose prose-lg max-w-none mb-8 ${theme === 'dark' ? 'prose-invert' : ''}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-md my-4"
                        showLineNumbers={true}
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : inline ? (
                      <code
                        className={`px-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-cyan-300' : 'bg-gray-100 text-cyan-600'}`}
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <pre className={`p-4 rounded-lg overflow-x-auto my-4 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
                        <code className="text-sm" {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                  h2: ({ ...props }) => (
                    <h2
                      className={`text-2xl font-bold mt-8 mb-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}
                      {...props}
                    />
                  ),
                  h3: ({ ...props }) => (
                    <h3
                      className={`text-xl font-bold mt-6 mb-3 ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-500'}`}
                      {...props}
                    />
                  ),
                  h4: ({ ...props }) => (
                    <h4
                      className={`text-lg font-bold mt-5 mb-2 ${theme === 'dark' ? 'text-cyan-200' : 'text-cyan-400'}`}
                      {...props}
                    />
                  ),
                  p: ({ ...props }) => (
                    <p className={`mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`} {...props} />
                  ),
                  ul: ({ ...props }) => (
                    <ul
                      className={`list-disc pl-6 mb-4 space-y-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                      {...props}
                    />
                  ),
                  ol: ({ ...props }) => (
                    <ol
                      className={`list-decimal pl-6 mb-4 space-y-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                      {...props}
                    />
                  ),
                  li: ({ ...props }) => (
                    <li className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} {...props} />
                  ),
                  blockquote: ({ ...props }) => (
                    <blockquote
                      className={`border-l-4 pl-4 italic my-4 ${theme === 'dark' ? 'border-cyan-400 text-gray-300' : 'border-cyan-500 text-gray-600'}`}
                      {...props}
                    />
                  ),
                }}
              >
                {selectedPost.content}
              </ReactMarkdown>
            </div>

            {/* Social share buttons */}
            <div className={`border-t pt-6 mt-8 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h4 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Share this post</h4>
              <div className="flex gap-3">
                <button
                  onClick={() => shareOnSocial("twitter")}
                  className={`rounded-full p-3 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  aria-label="Share on Twitter"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
                <button
                  onClick={() => shareOnSocial("facebook")}
                  className={`rounded-full p-3 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  aria-label="Share on Facebook"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </button>
                <button
                  onClick={() => shareOnSocial("linkedin")}
                  className={`rounded-full p-3 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  aria-label="Share on LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div
          className={`relative overflow-hidden rounded-lg ${theme === 'dark' ? 'bg-gray-800 bg-opacity-50' : 'bg-white'} backdrop-blur-sm mb-8`}
          style={{
            background: theme === 'dark' 
              ? `radial-gradient(circle at 50% 50%, rgba(17, 24, 39, 0.8) 0%, rgba(17, 24, 39, 0.95) 100%)`
              : `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.95) 100%)`,
            boxShadow: theme === 'dark' 
              ? "0 4px 30px rgba(0, 0, 0, 0.1)"
              : "0 4px 30px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="p-6 md:p-8">
            <h2 className={`text-xl font-bold mb-6 flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 mr-2 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}
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
              Comments ({comments.length})
            </h2>

            {/* Comments list */}
            {loadingComments ? (
              <div className={`p-4 rounded-lg mb-4 flex justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-cyan-400 border-r-transparent"></div>
                <span className={`ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Loading comments...
                </span>
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-4 mb-6">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      isCurrentUserComment(comment)
                        ? theme === 'dark' ? 'border-cyan-400' : 'border-cyan-500'
                        : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                    } ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} transition-all duration-300`}
                  >
                    {/* Comment content */}
                    {editingComment === comment.id ? (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-medium flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {comment.author?.full_name || comment.author || "Anonymous"}
                            {isCurrentUserComment(comment) && (
                              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-cyan-400 text-gray-900' : 'bg-cyan-500 text-white'}`}>
                                You
                              </span>
                            )}
                          </span>
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatCommentDate(comment.createdAt || comment.date)}
                          </span>
                        </div>
                        <textarea
                          value={editedComment}
                          onChange={(e) => setEditedComment(e.target.value)}
                          className={`w-full rounded-lg p-3 focus:outline-none transition-colors duration-300 mb-2 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border border-gray-600 text-white focus:border-cyan-400' 
                              : 'bg-white border border-gray-300 text-gray-900 focus:border-cyan-500'
                          }`}
                          rows={3}
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={handleCancelEdit}
                            className={`px-3 py-1 rounded transition-colors duration-300 ${
                              theme === 'dark'
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveComment(comment.id)}
                            className={`px-3 py-1 rounded transition-colors duration-300 ${
                              theme === 'dark'
                                ? 'bg-cyan-400 text-gray-900 hover:bg-cyan-500'
                                : 'bg-cyan-500 text-white hover:bg-cyan-600'
                            }`}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-medium flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {comment.author?.full_name || comment.author || "Anonymous"}
                            {isCurrentUserComment(comment) && (
                              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-cyan-400 text-gray-900' : 'bg-cyan-500 text-white'}`}>
                                You
                              </span>
                            )}
                          </span>
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatCommentDate(comment.createdAt || comment.date)}
                          </span>
                        </div>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{comment.content}</p>
                        {isCurrentUserComment(comment) && (
                          <div className="flex justify-end mt-2 gap-2">
                            <button
                              onClick={() => handleEditComment(comment.id, comment.content)}
                              className={`text-sm flex items-center transition-colors duration-300 ${
                                theme === 'dark'
                                  ? 'text-gray-400 hover:text-cyan-400'
                                  : 'text-gray-500 hover:text-cyan-600'
                              }`}
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
                              onClick={() => handleDeleteComment(comment.id)}
                              className={`text-sm flex items-center transition-colors duration-300 ${
                                theme === 'dark'
                                  ? 'text-gray-400 hover:text-red-400'
                                  : 'text-gray-500 hover:text-red-600'
                              }`}
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
              <div className={`p-4 rounded-lg mb-6 text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                  No comments yet. Be the first to comment!
                </p>
              </div>
            )}

            {/* Comment form */}
            <div className="mt-4">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {isAuthenticated ? "Add a comment" : "Login to comment"}
                </h3>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className={`w-full rounded-lg p-3 focus:outline-none transition-colors duration-300 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border border-gray-600 text-white focus:border-cyan-400'
                      : 'bg-white border border-gray-300 text-gray-900 focus:border-cyan-500'
                  }`}
                  placeholder={isAuthenticated ? "Share your thoughts..." : "Please login to comment"}
                  rows={3}
                  disabled={!isAuthenticated}
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!isAuthenticated || comment.trim() === ""}
                    className={`px-4 py-2 rounded-md transition-colors duration-300 flex items-center ${
                      !isAuthenticated || comment.trim() === ""
                        ? theme === 'dark'
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : theme === 'dark'
                        ? 'bg-cyan-400 text-gray-900 hover:bg-cyan-500'
                        : 'bg-cyan-500 text-white hover:bg-cyan-600'
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
        </div>

        {/* Related posts section */}
        {relatedPosts.length > 0 && (
          <div
            className={`relative overflow-hidden rounded-lg ${theme === 'dark' ? 'bg-gray-800 bg-opacity-50' : 'bg-white'} backdrop-blur-sm`}
            style={{
              background: theme === 'dark' 
                ? `radial-gradient(circle at 50% 50%, rgba(17, 24, 39, 0.8) 0%, rgba(17, 24, 39, 0.95) 100%)`
                : `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.95) 100%)`,
              boxShadow: theme === 'dark' 
                ? "0 4px 30px rgba(0, 0, 0, 0.1)"
                : "0 4px 30px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="p-6 md:p-8">
              <h2 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Other blogs you might like
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className={`rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="p-4">
                      <h3 className={`font-medium mb-2 text-lg line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {post.title}
                      </h3>
                      <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatPostDate(post.createdAt)}
                      </p>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                          <img
                            src="/profile.webp"
                            alt={post.author?.full_name || "Author"}
                            className="object-cover w-full h-full"
                            loading="lazy"
                          />
                        </div>
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {post.author?.full_name || "Anonymous"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SingleBlogPost;


