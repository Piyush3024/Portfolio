import { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import useContactStore from "../stores/useContactStore";

function ContactPage() {
  const { submitContactForm } = useContactStore();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // In a real implementation, you would import this from your store
  const submitForm = async (data) => {
    console.log("Submitting contact form:", data);
    try {
      await submitContactForm(data);
      // toast.success("Your message has been sent successfully")
    } catch (error) {
      toast.error("Error in sending the Message")
    }
    // API call would go here
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const pageRef = useRef(null);
  const formRef = useRef(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm({
      ...formData,
      full_name: formData.full_name,
    });
    toast.success("Your message has been sent");

    // Reset form after submission
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

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

  return (
    <div
      ref={pageRef}
      className="md:min-h-[calc(100vh-7rem)] h-[85vh] pt-[28rem] pb-[5.5rem] md:overflow-hidden overflow-y-auto md:mt-0 -mt-5 w-full md:w-screen md:absolute left-0 md:top-12 relative flex items-center justify-center px-4 md:px-8 lg:px-16 py-8 sm:py-16"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.3) 0%, rgba(17, 24, 39, 0.95) 45%)`,
      }}
    >
      <Toaster />
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 lg:gap-16 ">
        {/* Left side content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Let&apos;s Connect
          </h1>
          <p className="text-gray-300 mb-8 text-lg">
            Got a project in mind or just want to say hello? I&apos;m always
            excited to collaborate on innovative ideas and bring visions to life
            through creative development solutions.
          </p>

          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-3 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>piyushbhul3024@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>+977 9769830588</span>
            </div>

            <div className="pt-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                Response Time
              </h3>
              <p className="text-gray-300">
                I typically respond to all inquiries within 24 hours. For urgent
                matters, don&apos;t hesitate to reach out via phone.
              </p>
            </div>
          </div>
        </div>

        {/* Form container */}
        <div
          ref={formRef}
          className="w-full md:w-1/2 relative overflow-hidden p-6 sm:p-8 rounded-lg bg-opacity-30 backdrop-blur-sm"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.4) 0%, rgba(17, 24, 39, 0.8) 70%)`,
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-4 relative z-10"
          >
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Your Full Name"
                required
                className="w-full sm:w-1/2 p-3 sm:p-4 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full sm:w-1/2 p-3 sm:p-4 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
              />
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number (optional)"
                className="w-full sm:w-1/2 p-3 sm:p-4 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
              />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full sm:w-1/2 p-3 sm:p-4 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
              />
            </div>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project or inquiry..."
              required
              className="w-full p-3 sm:p-4 h-32 sm:h-40 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none border border-gray-700"
            ></textarea>

            <button
              type="submit"
              className="w-full p-3 sm:p-4 bg-cyan-500 text-gray-900 font-bold rounded-md hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
