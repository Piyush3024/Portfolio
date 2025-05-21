import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

// Initialize Markdown parser
const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {
        // Intentionally ignore highlighting errors
      }
    }
    return ""; // use external default escaping
  },
});

function PostForm({
  isEditMode,
  postForm,
  handleFormChange,
  handleSubmitPost,
  handleCloseForm,
  isSubmitting,
}) {
  // Handle Markdown editor changes
  const handleEditorChange = ({ text }) => {
    handleFormChange({ target: { name: "content", value: text } });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-start p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">
            {isEditMode ? "Update Post" : "Add New Post"}
          </h3>
          <button
            onClick={handleCloseForm}
            className="text-gray-400 hover:text-white transition-colors duration-300"
            aria-label="Close form"
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
          <div className="p-6 space-y-6">
            <div>
              <label
                className="block text-gray-400 text-sm mb-1"
                htmlFor="title"
              >
                Title* <span className="text-red-400">(required)</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={postForm.title}
                onChange={handleFormChange}
                required
                className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700 transition-colors duration-300"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label
                className="block text-gray-400 text-sm mb-1"
                htmlFor="slug"
              >
                Slug* <span className="text-red-400">(required)</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={postForm.slug}
                onChange={handleFormChange}
                required
                placeholder="your-post-slug"
                className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700 transition-colors duration-300"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL-friendly version of the title (e.g., my-blog-post)
              </p>
            </div>

            <div>
              <label
                className="block text-gray-400 text-sm mb-1"
                htmlFor="excerpt"
              >
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={postForm.excerpt}
                onChange={handleFormChange}
                rows={2}
                placeholder="Brief summary of your post"
                className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700 transition-colors duration-300"
              ></textarea>
            </div>

            <div>
              <label
                className="block text-gray-400 text-sm mb-1"
                htmlFor="content"
              >
                Content* <span className="text-red-400">(required)</span>
              </label>
              <MdEditor
                id="content"
                style={{ height: "400px" }}
                value={postForm.content}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
                placeholder="Write your post in Markdown..."
                className="border border-gray-700 rounded-md markdown-editor-custom"
                view={{ menu: true, md: true, html: true }}
                canView={{
                  menu: true,
                  md: true,
                  html: true,
                  fullScreen: true,
                  hideMenu: true,
                }}
                plugins={[
                  "header",
                  "font-bold",
                  "font-italic",
                  "font-underline",
                  "font-strikethrough",
                  "list-unordered",
                  "list-ordered",
                  "block-quote",
                  "block-code-inline",
                  "block-code-block",
                  "table",
                  "image",
                  "link",
                  "clear",
                  "logger",
                  "mode-toggle",
                  "full-screen",
                ]}
              />
              <div className="mt-3 bg-gray-800 p-4 rounded-md">
                <h4 className="text-cyan-400 font-medium mb-2">
                  Markdown Guide:
                </h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>
                    •{" "}
                    <code className="bg-gray-700 px-1 rounded">
                      # Heading 1
                    </code>
                    ,{" "}
                    <code className="bg-gray-700 px-1 rounded">
                      ## Heading 2
                    </code>
                    ,{" "}
                    <code className="bg-gray-700 px-1 rounded">
                      ### Heading 3
                    </code>
                  </li>
                  <li>
                    • <code className="bg-gray-700 px-1 rounded">**bold**</code>{" "}
                    for <strong>bold text</strong>
                  </li>
                  <li>
                    • <code className="bg-gray-700 px-1 rounded">*italic*</code>{" "}
                    for <em>italic text</em>
                  </li>
                  <li>
                    •{" "}
                    <code className="bg-gray-700 px-1 rounded">
                      [link text](url)
                    </code>{" "}
                    for links
                  </li>
                  <li>
                    •{" "}
                    <code className="bg-gray-700 px-1 rounded">
                      ![alt text](image-url)
                    </code>{" "}
                    for images
                  </li>
                  <li>
                    • <code className="bg-gray-700 px-1 rounded">1. Item</code>{" "}
                    for numbered lists
                  </li>
                  <li>
                    • <code className="bg-gray-700 px-1 rounded">- Item</code>{" "}
                    for bullet lists
                  </li>
                  <li>
                    •{" "}
                    <code className="bg-gray-700 px-1 rounded">
                      ```language
                    </code>{" "}
                    for code blocks:
                  </li>
                  <li className="pl-4">
                    <code className="bg-gray-700 px-1 rounded">
                      ```javascript
                    </code>
                  </li>
                  <li className="pl-4">
                    <code className="bg-gray-700 px-1 rounded">
                      {/* your code here */}
                    </code>
                  </li>
                  <li className="pl-4">
                    <code className="bg-gray-700 px-1 rounded">```</code>
                  </li>
                  <li>
                    •{" "}
                    <code className="bg-gray-700 px-1 rounded">
                      `inline code`
                    </code>{" "}
                    for `inline code`
                  </li>
                  <li>
                    • <code className="bg-gray-700 px-1 rounded"> quote</code>{" "}
                    for blockquotes
                  </li>
                  <li>
                    • <code className="bg-gray-700 px-1 rounded">---</code> for
                    horizontal line
                  </li>
                </ul>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use Markdown for formatting: # for headings, - for lists, ** for
                bold, * for italic, etc. Separate paragraphs with a blank line.
              </p>
            </div>

            <div>
              <label
                className="block text-gray-400 text-sm mb-1"
                htmlFor="featured_image"
              >
                Featured Image URL
              </label>
              <input
                type="url"
                id="featured_image"
                name="featured_image"
                value={postForm.featured_image}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
                className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700 transition-colors duration-300"
              />
            </div>

            <div>
              <label
                className="block text-gray-400 text-sm mb-1"
                htmlFor="tags"
              >
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={postForm.tags}
                onChange={handleFormChange}
                placeholder="technology, tutorial, react (comma separated)"
                className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700 transition-colors duration-300"
              />
            </div>

            <div>
              <label
                className="block text-gray-400 text-sm mb-1"
                htmlFor="status"
              >
                Status* <span className="text-red-400">(required)</span>
              </label>
              <select
                id="status"
                name="status"
                value={postForm.status}
                onChange={handleFormChange}
                required
                className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700 transition-colors duration-300"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
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
              } text-white rounded-md transition-colors duration-300 flex items-center justify-center`}
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
                "Update Post"
              ) : (
                "Add Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostForm;
