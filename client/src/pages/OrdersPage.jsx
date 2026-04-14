"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getConsumerOrders } from "../redux/slices/orderSlice";
import OrderItem from "../components/OrderItem";
import Loader from "../components/Loader";
import { 
  FaShoppingBasket, 
  FaClipboardList, 
  FaHourglassHalf, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaBan,
  FaBox
} from "react-icons/fa";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getConsumerOrders());
  }, [dispatch]);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const getStatusCount = (status) => {
    if (status === "all") return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  if (loading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <FaBox className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-1">Track and manage your orders</p>
            </div>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full mt-2"></div>
        </div>

        {/* Stats Summary */}
        {orders.length > 0 && (
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

        {/* Filter Buttons */}
        <div className="mb-6">
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
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
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

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderItem key={order._id} order={order} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg text-center py-16 px-4">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBasket className="text-teal-600 text-4xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {filter === "all"
                ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                : `You don't have any ${filter} orders at the moment.`}
            </p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="mt-6 inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                View All Orders
              </button>
            )}
            {filter === "all" && (
              <Link
                to="/products"
                className="mt-6 inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Browse Products
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;