import { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import useContactStore from "../stores/useContactStore";
import { format } from "date-fns";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

function AdminPage() {
  const { contacts, fetchContacts, deleteContact, isLoading, error } =
    useContactStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 10;

  const pageRef = useRef(null);
 

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts().catch((err) => {
      toast.error("Failed to fetch contacts");
    });
  }, [fetchContacts]);

  // Apply filters and search
  useEffect(() => {
    let result = [...contacts];

    // Apply date filter
    if (dateFilter.startDate && dateFilter.endDate) {
      const startDate = new Date(dateFilter.startDate);
      const endDate = new Date(dateFilter.endDate);
      endDate.setHours(23, 59, 59, 999); // Set to end of day

      result = result.filter((contact) => {
        const contactDate = new Date(contact.created_at);
        return contactDate >= startDate && contactDate <= endDate;
      });
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (contact) =>
          (contact.full_name &&
            contact.full_name.toLowerCase().includes(term)) ||
          (contact.email && contact.email.toLowerCase().includes(term)) ||
          (contact.subject && contact.subject.toLowerCase().includes(term)) ||
          (contact.message && contact.message.toLowerCase().includes(term)) ||
          (contact.phone && contact.phone.includes(term))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredContacts(result);
  }, [contacts, searchTerm, dateFilter, sortConfig]);

  // Track mouse position for spotlight effect
 

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
  };

  const handleCloseDetails = () => {
    setSelectedContact(null);
  };

  const handleDeleteClick = (contact) => {
    setContactToDelete(contact);
    setIsDeleteConfirmOpen(true);
  };

 const confirmDelete = async () => {
  if (!contactToDelete) return;
  
  setIsDeleting(true);
  try {
    await deleteContact(contactToDelete.contact_id);
    toast.success("Contact deleted successfully");
    if (selectedContact?.contact_id === contactToDelete.contact_id) {
      setSelectedContact(null);
    }
  } catch (err) {
    toast.error("Failed to delete contact");
  } finally {
    setIsDeleting(false);
    setIsDeleteConfirmOpen(false);
    setContactToDelete(null);
  }
};

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setContactToDelete(null);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDateFilter({
      startDate: "",
      endDate: "",
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch (error) {
      return "Invalid date";
    }
  };
  // Pagination calculations
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

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
      className="  py-6  overflow-y-auto  max-w-full  relative flex flex-col px-4 md:px-8 lg:px-16"
     
    >
      <Toaster />

      <div className="flex flex-col mt-14">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Contact Management
          </h1>
          <p className="text-gray-300 mt-2">
            View, search, and manage all contact submissions
          </p>
        </div>

        {/* Controls section */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by name, email, subject, message..."
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
                <label className="block text-gray-300 text-sm mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={dateFilter.startDate}
                  onChange={handleDateFilterChange}
                  className="w-full p-3 bg-gray-900 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  End Date
                </label>
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
              {filteredContacts.length}{" "}
              {filteredContacts.length === 1 ? "contact" : "contacts"} found
              {filteredContacts.length > 0 && (
                <span className="ml-2">
                  (Showing {indexOfFirstContact + 1}-
                  {Math.min(indexOfLastContact, filteredContacts.length)} of{" "}
                  {filteredContacts.length})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contact list section */}
        <div className="flex-1 overflow-hidden flex flex-col bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 p-4 text-center">{error}</div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-gray-400 p-8 text-center">
              No contacts found matching your criteria
            </div>
          ) : (
            <div className="overflow-auto h-full">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800 sticky top-0">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("full_name")}
                    >
                      <div className="flex items-center">
                        Name
                        {sortConfig.key === "full_name" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Subject
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("created_at")}
                    >
                      <div className="flex items-center">
                        Date
                        {sortConfig.key === "created_at" && (
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
                  {currentContacts.map((contact) => (
                    <tr key={contact.contact_id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-200">
                          {contact.full_name}
                        </div>
                        {contact.phone && (
                          <div className="text-xs text-gray-400">
                            {contact.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {contact.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300 truncate max-w-xs">
                          {contact.subject || "No subject"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {formatDate(contact.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(contact)}
                          className="text-cyan-400 hover:text-cyan-300 mr-4"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteClick(contact)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              {filteredContacts.length > 0 && (
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
      </div>

      {/* Contact Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-start p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">
                Contact Details
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
                  <label className="block text-gray-400 text-sm mb-1">
                    Name
                  </label>
                  <div className="text-white">{selectedContact.full_name}</div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Email
                  </label>
                  <div className="text-white">{selectedContact.email}</div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Phone
                  </label>
                  <div className="text-white">
                    {selectedContact.phone || "Not provided"}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Date Submitted
                  </label>
                  <div className="text-white">
                    {formatDate(selectedContact.created_at)}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-1">
                  Subject
                </label>
                <div className="text-white">
                  {selectedContact.subject || "No subject"}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Message
                </label>
                <div className="bg-gray-800 p-4 rounded-md text-gray-200 whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 p-6 border-t border-gray-700">
              <button
                onClick={() => handleDeleteClick(selectedContact)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
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
  <DeleteConfirmationModal
    isOpen={isDeleteConfirmOpen}
    onClose={cancelDelete}
    onConfirm={confirmDelete}
    isLoading={isDeleting}
    title="Confirm Delete"
    message={`Are you sure you want to delete this contact from ${contactToDelete?.full_name}? This action cannot be undone.`}
    confirmButtonText="Delete"
    cancelButtonText="Cancel"
  />
)}
    </div>
  );
}

export default AdminPage;
