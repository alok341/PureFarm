"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllUsers, deleteUser } from "../../redux/slices/userSlice"
import Loader from "../../components/Loader"
import { 
  FaSearch, 
  FaUserEdit, 
  FaTrash, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaUsers,
  FaUserCheck,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaCalendarAlt,
  FaExclamationTriangle
} from "react-icons/fa"
import { GiFarmer } from "react-icons/gi"

const UsersPage = () => {
  const dispatch = useDispatch()
  const { users, loading } = useSelector((state) => state.users)

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [filteredUsers, setFilteredUsers] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [showUserDetails, setShowUserDetails] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch])

  useEffect(() => {
    if (users) {
      let filtered = [...users]

      // Apply role filter
      if (roleFilter !== "all") {
        filtered = filtered.filter((user) => user.role === roleFilter)
      }

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      setFilteredUsers(filtered)
    }
  }, [users, searchTerm, roleFilter])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value)
  }

  const handleDeleteClick = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (userToDelete) {
      setIsDeleting(true)
      await dispatch(deleteUser(userToDelete._id))
      setIsDeleting(false)
      setShowDeleteModal(false)
      setUserToDelete(null)
    }
  }

  const toggleUserDetails = (userId) => {
    if (showUserDetails === userId) {
      setShowUserDetails(null)
    } else {
      setShowUserDetails(userId)
    }
  }

  // User statistics
  const userStats = {
    total: users.length,
    consumers: users.filter(u => u.role === "consumer").length,
    farmers: users.filter(u => u.role === "farmer").length,
    admins: users.filter(u => u.role === "admin").length,
  }

  if (loading && users.length === 0) {
    return <Loader />
  }

  const getRoleBadge = (role) => {
    switch(role) {
      case "admin":
        return { color: "bg-purple-100 text-purple-700", icon: FaUsers, label: "Admin" }
      case "farmer":
        return { color: "bg-emerald-100 text-emerald-700", icon: GiFarmer, label: "Farmer" }
      case "consumer":
        return { color: "bg-blue-100 text-blue-700", icon: FaUserCheck, label: "Consumer" }
      default:
        return { color: "bg-gray-100 text-gray-700", icon: FaUsers, label: role }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <FaUsers className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Manage Users</h1>
              <p className="text-gray-600 mt-1">View and manage all platform users</p>
            </div>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full mt-2"></div>
        </div>

        {/* Stats Summary */}
        {users.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
                </div>
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <FaUsers className="text-teal-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Consumers</p>
                  <p className="text-2xl font-bold text-blue-600">{userStats.consumers}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaUserCheck className="text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Farmers</p>
                  <p className="text-2xl font-bold text-emerald-600">{userStats.farmers}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <GiFarmer className="text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Admins</p>
                  <p className="text-2xl font-bold text-purple-600">{userStats.admins}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaUsers className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="md:w-1/2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search users by name or email..."
                className="w-full px-5 py-3 pl-12 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          <div className="md:w-1/4">
            <select
              value={roleFilter}
              onChange={handleRoleFilterChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
            >
              <option value="all">All Roles</option>
              <option value="consumer">Consumers</option>
              <option value="farmer">Farmers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => {
                    const roleBadge = getRoleBadge(user.role)
                    const RoleIcon = roleBadge.icon
                    return (
                      <React.Fragment key={user._id}>
                        <tr className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${roleBadge.color}`}>
                              <RoleIcon className="text-xs" />
                              {roleBadge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                              <FaCalendarAlt className="text-xs text-gray-400" />
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => toggleUserDetails(user._id)}
                                className="p-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all duration-200"
                                title={showUserDetails === user._id ? "Hide Details" : "View Details"}
                              >
                                {showUserDetails === user._id ? (
                                  <FaEyeSlash className="text-sm" />
                                ) : (
                                  <FaEye className="text-sm" />
                                )}
                              </button>
                              {user.role !== "admin" && (
                                <button
                                  onClick={() => handleDeleteClick(user)}
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                                  title="Delete User"
                                >
                                  <FaTrash className="text-sm" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        {showUserDetails === user._id && (
                          <tr className="bg-gray-50">
                            <td colSpan="4" className="px-6 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <FaEnvelope className="text-teal-500" />
                                    Contact Information
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center text-gray-700">
                                      <FaEnvelope className="text-gray-400 mr-2 text-sm" />
                                      <span>{user.email}</span>
                                    </div>
                                    {user.phone && (
                                      <div className="flex items-center text-gray-700">
                                        <FaPhone className="text-gray-400 mr-2 text-sm" />
                                        <span>{user.phone}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {user.address && (user.address.street || user.address.city) && (
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                      <FaMapMarkerAlt className="text-teal-500" />
                                      Address
                                    </h4>
                                    <div className="flex items-start text-gray-700">
                                      <FaMapMarkerAlt className="text-gray-400 mr-2 mt-0.5 text-sm" />
                                      <div>
                                        {user.address.street && <p>{user.address.street}</p>}
                                        {(user.address.city || user.address.state) && (
                                          <p>
                                            {user.address.city && `${user.address.city}, `}
                                            {user.address.state && user.address.state}
                                            {user.address.zipCode && ` ${user.address.zipCode}`}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg text-center py-16 px-4">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUsers className="text-teal-600 text-4xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm || roleFilter !== "all"
                ? "No users match your search criteria. Try adjusting your filters."
                : "There are no users in the system yet."}
            </p>
            {(searchTerm || roleFilter !== "all") && (
              <div className="mt-6 flex justify-center gap-3">
                {roleFilter !== "all" && (
                  <button
                    onClick={() => setRoleFilter("all")}
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Clear Role Filter
                  </button>
                )}
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="px-5 py-2.5 border-2 border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-all duration-200"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Confirm Delete</h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
                <p className="text-red-100 text-sm mt-1">This action cannot be undone</p>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4 p-3 bg-red-50 rounded-xl">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <FaExclamationTriangle className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User to delete</p>
                    <p className="font-semibold text-gray-900">{userToDelete.name}</p>
                    <p className="text-sm text-gray-500">{userToDelete.email}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this user? This action cannot be undone and will permanently remove all associated data.
                </p>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                      isDeleting
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    {isDeleting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      "Delete User"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersPage