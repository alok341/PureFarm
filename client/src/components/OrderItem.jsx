import { Link } from "react-router-dom";

import { 
  FaEye, 
  FaCalendarAlt, 
  FaBox, 
  FaRupeeSign, 
  FaUser, 
  FaTag, 
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBan
} from "react-icons/fa";
const OrderItem = ({ order }) => {
  // Function to get status badge color and icon
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "bg-amber-100 text-amber-700",
        icon: FaClock,
        label: "Pending"
      },
      accepted: {
        color: "bg-teal-100 text-teal-700",
        icon: FaCheckCircle,
        label: "Accepted"
      },
      rejected: {
        color: "bg-red-100 text-red-700",
        icon: FaTimesCircle,
        label: "Rejected"
      },
      completed: {
        color: "bg-emerald-100 text-emerald-700",
        icon: FaCheckCircle,
        label: "Completed"
      },
      cancelled: {
        color: "bg-gray-100 text-gray-700",
        icon: FaBan,
        label: "Cancelled"
      }
    };
    return configs[status] || configs.pending;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Order ID & Date */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FaTag className="text-teal-500 text-sm" />
            <span className="text-gray-500 text-sm font-medium">Order ID:</span>
            <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md text-sm">
              #{order._id.substring(0, 8)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400 text-sm" />
            <span className="text-gray-500 text-sm">Placed on:</span>
            <span className="text-gray-700 text-sm">{formatDate(order.createdAt)}</span>
          </div>
        </div>

        {/* Items & Total */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FaBox className="text-teal-500 text-sm" />
            <span className="text-gray-500 text-sm font-medium">Items:</span>
            <span className="font-semibold text-gray-800">{order.items.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaRupeeSign className="text-teal-500 text-sm" />
            <span className="text-gray-500 text-sm">Total:</span>
            <span className="font-bold text-teal-600 text-lg">
              ₨{order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Status & Customer */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className={`text-sm ${statusConfig.color.split(' ')[1]}`} />
            <span className="text-gray-500 text-sm font-medium">Status:</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
              <StatusIcon className="text-xs" />
              {statusConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaUser className="text-gray-400 text-sm" />
            <span className="text-gray-500 text-sm">Customer:</span>
            <span className="text-gray-700 text-sm font-medium">{order.consumer?.name || "N/A"}</span>
          </div>
        </div>

        {/* View Details Button */}
        <div className="lg:text-right">
          <Link
            to={`/orders/${order._id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 group"
          >
            <FaEye className="text-sm group-hover:translate-x-0.5 transition-transform" />
            <span>View Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;