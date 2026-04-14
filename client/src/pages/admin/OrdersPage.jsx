"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateOrderStatus } from "../../redux/slices/orderSlice";
import OrderItem from "../../components/OrderItem";
import Loader from "../../components/Loader";
import { 
  FaSearch, 
  FaFilter, 
  FaShoppingBasket,
  FaClipboardList,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaEdit,
  FaUser,
  FaEye,
  FaTimes
} from "react-icons/fa";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { adminOrders, loading } = useSelector((state) => state.orders);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (adminOrders) {
      let filtered = [...adminOrders];

      if (filter !== "all") {
        filtered = filtered.filter((order) => order.status === filter);
      }

      if (searchTerm) {
        filtered = filtered.filter(
          (order) =>
            order._id.includes(searchTerm) ||
            order.consumer.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            order.farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredOrders(filtered);
    }
  }, [adminOrders, filter, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const confirmStatusUpdate = async () => {
    if (selectedOrder && newStatus && newStatus !== selectedOrder.status) {
      setIsUpdating(true);
      await dispatch(updateOrderStatus({ id: selectedOrder._id, status: newStatus }));
      setIsUpdating(false);
      setShowStatusModal(false);
    } else if (newStatus === selectedOrder.status) {
      setShowStatusModal(false);
    }
  };

  const getStatusCount = (status) => {
    if (status === "all") return adminOrders.length;
    return adminOrders.filter(order => order.status === status).length;
  };

  if (loading && adminOrders.length === 0) {
    return <Loader />;
  }

  const filters = [
    { id: "all", label: "All", icon: FaClipboardList, color: "teal" },
    { id: "pending", label: "Pending", icon: FaHourglassHalf, color: "amber" },
    { id: "accepted", label: "Accepted", icon: FaCheckCircle, color: "teal" },
    { id: "completed", label: "Completed", icon: FaCheckCircle, color: "emerald" },
    { id: "rejected", label: "Rejected", icon: FaTimesCircle, color: "red" },
    { id: "cancelled", label: "Cancelled", icon: FaBan, color: "gray" },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-amber-100 text-amber-700", icon: FaHourglassHalf },
      accepted: { color: "bg-teal-100 text-teal-700", icon: FaCheckCircle },
      completed: { color: "bg-emerald-100 text-emerald-700", icon: FaCheckCircle },
      rejected: { color: "bg-red-100 text-red-700", icon: FaTimesCircle },
      cancelled: { color: "bg-gray-100 text-gray-700", icon: FaBan },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon className="text-xs" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-100 text-amber-700",
      accepted: "bg-teal-100 text-teal-700",
      completed: "bg-emerald-100 text-emerald-700",
      rejected: "bg-red-100 text-red-700",
      cancelled: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: FaHourglassHalf,
      accepted: FaCheckCircle,
      completed: FaCheckCircle,
      rejected: FaTimesCircle,
      cancelled: FaBan,
    };
    const Icon = icons[status] || FaClipboardList;
    return <Icon className="text-xs mr-1" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <FaShoppingBasket className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">All Orders</h1>
              <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
            </div>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full mt-2"></div>
        </div>

        {/* Stats Summary */}
        {adminOrders.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {filters.map((filterItem) => (
              <div
                key={filterItem.id}
                className={`bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  filter === filterItem.id ? "ring-2 ring-teal-500 shadow-md" : ""
                }`}
                onClick={() => setFilter(filterItem.id)}
              >
                <div className="text-2xl font-bold text-teal-600">
                  {getStatusCount(filterItem.id)}
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                  <filterItem.icon className="text-xs" />
                  {filterItem.label}
                </div>
              </div>
            ))}
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
                placeholder="Search by order ID, customer, or farmer..."
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

          <div className="flex items-center gap-3">
            <FaFilter className="text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {filters.map((filterItem) => {
                const Icon = filterItem.icon;
                const isActive = filter === filterItem.id;
                const colorClass = isActive
                  ? filterItem.color === "teal" ? "from-teal-600 to-emerald-600" :
                     filterItem.color === "amber" ? "from-amber-500 to-amber-600" :
                     filterItem.color === "emerald" ? "from-emerald-500 to-emerald-600" :
                     filterItem.color === "red" ? "from-red-500 to-red-600" :
                     "from-gray-500 to-gray-600"
                  : "";
                
                return (
                  <button
                    key={filterItem.id}
                    onClick={() => setFilter(filterItem.id)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? `bg-gradient-to-r ${colorClass} text-white shadow-md`
                        : "bg-white border border-gray-200 text-gray-700 hover:border-teal-300 hover:text-teal-600 hover:shadow-sm"
                    }`}
                  >
                    <Icon className="text-sm" />
                    <span>{filterItem.label}</span>
                    {!isActive && getStatusCount(filterItem.id) > 0 && (
                      <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                        {getStatusCount(filterItem.id)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <OrderItem order={order} />
                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex justify-end">
                  <button
                    onClick={() => handleUpdateStatus(order)}
                    disabled={
                      order.status === "completed" || order.status === "cancelled"
                    }
                    className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      order.status === "completed" || order.status === "cancelled"
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    <FaEdit className="text-sm" />
                    Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg text-center py-16 px-4">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBasket className="text-teal-600 text-4xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {filter === "all" && !searchTerm
                ? "There are no orders in the system yet. Orders will appear here when customers place them."
                : "No orders match your search criteria. Try adjusting your search or filter."}
            </p>
            {(filter !== "all" || searchTerm) && (
              <div className="mt-6 flex justify-center gap-3">
                {filter !== "all" && (
                  <button
                    onClick={() => setFilter("all")}
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    View All Orders
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

        {/* Status Update Modal */}
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Update Order Status</h3>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
                <p className="text-teal-100 text-sm mt-1">
                  Order #{selectedOrder._id.substring(0, 8)}
                </p>
              </div>
              
              {/* Modal Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.consumer.name}</p>
                  </div>
                  <div className="ml-auto">
                    <p className="text-sm text-gray-500">Farmer</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.farmer.name}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                    Order Status
                  </label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="accepted">✓ Accepted</option>
                    <option value="rejected">✗ Rejected</option>
                    <option value="completed">✅ Completed</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </div>
                
                {/* Status Preview */}
                <div className="mb-6 p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-2">Status Change Preview</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedOrder.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>
                    <FaEye className="text-gray-400 text-xs" />
                    <div className="flex items-center gap-2">
                      {getStatusIcon(newStatus)}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(newStatus)}`}>
                        {newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmStatusUpdate}
                    disabled={isUpdating || newStatus === selectedOrder.status}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                      isUpdating || newStatus === selectedOrder.status
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    {isUpdating ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Updating...
                      </>
                    ) : (
                      "Update Status"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;