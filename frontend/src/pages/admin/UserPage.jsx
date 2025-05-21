import { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import useUserStore from "../../stores/useUserStore.js";
import { format } from "date-fns";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal.jsx";

function AdminUserManagement() {
  const {
    users,
    blockedUsers,
    getAllUsers,
    getBlockedUsers,
    deleteUser,
    blockUser,
    unblockUser,
    isLoading,
    error,
  } = useUserStore();

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isBlockConfirmOpen, setIsBlockConfirmOpen] = useState(false);
  const [blockDuration, setBlockDuration] = useState("7");
  const [userToAction, setUserToAction] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const pageRef = useRef(null);
 

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "all") {
          await getAllUsers();
        } else if (activeTab === "blocked") {
          await getBlockedUsers();
        }
      } catch (err) {
        toast.error(
          `Failed to fetch ${activeTab === "all" ? "users" : "blocked users"}`
        );
      }
    };

    fetchData();
  }, [activeTab, getAllUsers, getBlockedUsers]);

  // Apply filters and search
  useEffect(() => {
    // Select source data based on active tab
    const sourceData = activeTab === "all" ? users : blockedUsers;
    let result = [...sourceData];

    // Apply date filter if both dates are provided
    if (dateFilter.startDate && dateFilter.endDate) {
      const startDate = new Date(dateFilter.startDate);
      const endDate = new Date(dateFilter.endDate);
      endDate.setHours(23, 59, 59, 999); // Set to end of day

      result = result.filter((user) => {
        const userDate = new Date(user.created_at);
        return userDate >= startDate && userDate <= endDate;
      });
    }

    // Apply search
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          (user.username && user.username.toLowerCase().includes(term)) ||
          (user.email && user.email.toLowerCase().includes(term)) ||
          (user.first_name && user.first_name.toLowerCase().includes(term)) ||
          (user.last_name && user.last_name.toLowerCase().includes(term))
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

    setFilteredUsers(result);
  }, [users, blockedUsers, searchTerm, dateFilter, sortConfig, activeTab]);

  // Track mouse position for spotlight effect
 

  // Handler functions
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setDateFilter({
      startDate: "",
      endDate: "",
    });
    setSelectedUser(null);
  };

  //   const handleViewDetails = (user) => {
  //     setSelectedUser(user);
  //   };

  const handleCloseDetails = () => {
    setSelectedUser(null);
  };

  const handleBlockDurationChange = (e) => {
    setBlockDuration(e.target.value);
  };

  const handleDeleteClick = (user) => {
    setUserToAction(user);
    setIsDeleteConfirmOpen(true);
  };

  const handleBlockClick = (user) => {
    setUserToAction(user);
    setIsBlockConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToAction) return;
    setIsDeleting(true);

    try {
      await deleteUser(userToAction.user_id);
      toast.success("User deleted successfully");
      if (selectedUser?.user_id === userToAction.user_id) {
        setSelectedUser(null);
      }
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
      setIsDeleteConfirmOpen(false);
      setUserToAction(null);
    }
  };

  const confirmBlock = async () => {
    if (!userToAction) return;
    setIsBlocking(true);

    try {
      await blockUser(userToAction.user_id, parseInt(blockDuration));
      toast.success(`User blocked for ${blockDuration} days`);
      // Refresh data
      if (activeTab === "all") {
        await getAllUsers();
      }
    } catch (err) {
      toast.error("Failed to block user");
    } finally {
      setIsBlocking(false);
      setIsBlockConfirmOpen(false);
      setUserToAction(null);
    }
  };

  const handleUnblock = async (user) => {
    try {
      await unblockUser(user.user_id);
      toast.success("User unblocked successfully");
      // Refresh data
      if (activeTab === "blocked") {
        await getBlockedUsers();
      }
    } catch (err) {
      toast.error("Failed to unblock user");
    }
  };

  const cancelAction = () => {
    setIsDeleteConfirmOpen(false);
    setIsBlockConfirmOpen(false);
    setUserToAction(null);
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
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
      className=" py-6  overflow-y-auto max-w-full  relative flex flex-col px-4 md:px-8 lg:px-16"
     
    >
      <Toaster />

      <div className="flex flex-col mt-14">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            User Management
          </h1>
          <p className="text-gray-300 mt-2">
            Manage user accounts, block problematic users, and monitor user
            activity
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex mb-6">
          <button
            className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
              activeTab === "all"
                ? "bg-gray-800 text-white border-b-2 border-cyan-400"
                : "bg-gray-900 text-gray-400 hover:text-white"
            }`}
            onClick={() => handleTabChange("all")}
          >
            All Users
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg text-sm font-medium ml-2 ${
              activeTab === "blocked"
                ? "bg-gray-800 text-white border-b-2 border-cyan-400"
                : "bg-gray-900 text-gray-400 hover:text-white"
            }`}
            onClick={() => handleTabChange("blocked")}
          >
            Blocked Users
          </button>
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
                  placeholder="Search by name, username, email..."
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
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "user" : "users"} found
              {filteredUsers.length > 0 && (
                <span className="ml-2">
                  (Showing {indexOfFirstUser + 1}-
                  {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                  {filteredUsers.length})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* User list section */}
        <div className="flex-1 overflow-hidden flex flex-col bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 p-4 text-center">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-gray-400 p-8 text-center">
              No users found matching your criteria
            </div>
          ) : (
            <div className="overflow-auto h-full">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800 sticky top-0">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("username")}
                    >
                      <div className="flex items-center">
                        Username
                        {sortConfig.key === "username" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("created_at")}
                    >
                      <div className="flex items-center">
                        Registration Date
                        {sortConfig.key === "created_at" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    {activeTab === "blocked" && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Blocked Until
                      </th>
                    )}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 bg-opacity-50 divide-y divide-gray-800">
                  {currentUsers.map((user) => (
                    <tr key={user.user_id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-200">
                          {user.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {user.full_name || "Not provided"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      {activeTab === "blocked" && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-red-400">
                            {user.blocked_until
                              ? formatDate(user.blocked_until)
                              : "Permanent"}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* <button
                          onClick={() => handleViewDetails(user)}
                          className="text-cyan-400 hover:text-cyan-300 mr-4"
                        >
                          View
                        </button> */}
                        {activeTab === "all" && !user.is_blocked && (
                          <button
                            onClick={() => handleBlockClick(user)}
                            className="text-yellow-400 hover:text-yellow-300 mr-4"
                          >
                            Block
                          </button>
                        )}
                        {activeTab === "blocked" && (
                          <button
                            onClick={() => handleUnblock(user)}
                            className="text-green-400 hover:text-green-300 mr-4"
                          >
                            Unblock
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(user)}
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
              {filteredUsers.length > 0 && (
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-start p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">User Details</h3>
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
                    Username
                  </label>
                  <div className="text-white">{selectedUser.username}</div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Email
                  </label>
                  <div className="text-white">{selectedUser.email}</div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    First Name
                  </label>
                  <div className="text-white">
                    {selectedUser.first_name || "Not provided"}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Last Name
                  </label>
                  <div className="text-white">
                    {selectedUser.last_name || "Not provided"}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Registration Date
                  </label>
                  <div className="text-white">
                    {formatDate(selectedUser.created_at)}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Status
                  </label>
                  <div
                    className={`${
                      selectedUser.is_blocked
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {selectedUser.is_blocked ? "Blocked" : "Active"}
                  </div>
                </div>
                {selectedUser.is_blocked && selectedUser.blocked_until && (
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">
                      Blocked Until
                    </label>
                    <div className="text-red-400">
                      {formatDate(selectedUser.blocked_until)}
                    </div>
                  </div>
                )}
              </div>

              {selectedUser.bio && (
                <div className="mb-6">
                  <label className="block text-gray-400 text-sm mb-1">
                    Bio
                  </label>
                  <div className="bg-gray-800 p-4 rounded-md text-gray-200 whitespace-pre-wrap">
                    {selectedUser.bio}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Role
                  </label>
                  <div className="text-white capitalize">
                    {selectedUser.role || "User"}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Last Login
                  </label>
                  <div className="text-white">
                    {selectedUser.last_login
                      ? formatDate(selectedUser.last_login)
                      : "Never"}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 p-6 border-t border-gray-700">
              {selectedUser.is_blocked ? (
                <button
                  onClick={() => handleUnblock(selectedUser)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Unblock
                </button>
              ) : (
                <button
                  onClick={() => handleBlockClick(selectedUser)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                  Block
                </button>
              )}
              <button
                onClick={() => handleDeleteClick(selectedUser)}
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
          onClose={cancelAction}
          onConfirm={confirmDelete}
          isLoading={isDeleting}
          title="Confirm Delete"
          message={`Are you sure you want to delete user ${userToAction?.username}? This action cannot be undone and will remove all associated data.`}
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
        />
      )}

      {/* Block Confirmation Modal */}
    {isBlockConfirmOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
      <h3 className="text-xl font-semibold text-white mb-4">
        Block User
      </h3>
      <p className="text-gray-300 mb-4">
        You are about to block user &quot;{userToAction?.username}&quot;.
        Blocked users will not be able to log in or access their account.
      </p>

      <div className="mb-6">
        <label className="block text-gray-300 text-sm mb-2">
          Block Duration (days)
        </label>
        <select
          value={blockDuration}
          onChange={handleBlockDurationChange}
          className="w-full p-3 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
          disabled={isBlocking}
        >
          <option value="1">1 day</option>
          <option value="3">3 days</option>
          <option value="7">7 days</option>
          <option value="14">14 days</option>
          <option value="30">30 days</option>
          <option value="90">90 days</option>
          <option value="0">Permanent</option>
        </select>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={cancelAction}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          disabled={isBlocking}
        >
          Cancel
        </button>
        <button
          onClick={confirmBlock}
          className={`px-4 py-2 bg-yellow-600 text-white rounded-md flex items-center justify-center min-w-[100px] ${
            isBlocking ? "opacity-75 cursor-not-allowed" : "hover:bg-yellow-700"
          }`}
          disabled={isBlocking}
        >
          {isBlocking ? (
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
              Blocking...
            </>
          ) : (
            "Block User"
          )}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default AdminUserManagement;
