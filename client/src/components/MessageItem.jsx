import { Link } from "react-router-dom"
import { FaCircle, FaUser, FaClock, FaArrowRight, FaEnvelope } from "react-icons/fa"
import { GiFarmer } from "react-icons/gi"

const MessageItem = ({ conversation }) => {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()

    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }

    // Otherwise show full date
    return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" })
  }

  // Get role-specific styling
  const getRoleConfig = (role) => {
    const configs = {
      farmer: {
        bgColor: "from-emerald-500 to-teal-500",
        icon: GiFarmer,
        label: "Farmer"
      },
      consumer: {
        bgColor: "from-blue-500 to-teal-500",
        icon: FaUser,
        label: "Consumer"
      },
      admin: {
        bgColor: "from-purple-500 to-pink-500",
        icon: FaUser,
        label: "Admin"
      }
    }
    return configs[role] || configs.consumer
  }

  const roleConfig = getRoleConfig(conversation.user.role)
  const RoleIcon = roleConfig.icon

  return (
    <Link to={`/messages/${conversation.user._id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 mb-3 border border-gray-100 group-hover:border-teal-200 group-hover:translate-x-1">
        <div className="flex items-center justify-between">
          {/* Left Section - User Info */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Avatar */}
            <div className="relative">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${roleConfig.bgColor} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <RoleIcon className="text-white text-xl" />
              </div>
              {conversation.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full animate-pulse border-2 border-white"></div>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                  {conversation.user.name}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  conversation.user.role === "farmer" 
                    ? "bg-emerald-100 text-emerald-700" 
                    : conversation.user.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {roleConfig.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-gray-400 text-xs flex-shrink-0" />
                <p className="text-sm text-gray-600 truncate">
                  {conversation.lastMessage.content}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Time & Unread */}
          <div className="flex flex-col items-end space-y-2 ml-4">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <FaClock className="text-xs" />
              <span>{formatDate(conversation.lastMessage.createdAt)}</span>
            </div>
            
            {conversation.unreadCount > 0 ? (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 px-2.5 py-1 rounded-full shadow-sm">
                <FaCircle className="text-white text-xs" />
                <span className="text-xs font-semibold text-white">
                  {conversation.unreadCount} new
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-400 group-hover:text-teal-500 transition-colors">
                <span className="text-xs">View</span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MessageItem