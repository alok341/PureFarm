"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFarmerProducts } from "../../redux/slices/productSlice";
import { getFarmerOrders } from "../../redux/slices/orderSlice";
import { getConversations } from "../../redux/slices/messageSlice";
import Loader from "../../components/Loader";
import AIInsightsCard from "../../components/AIInsightsCard";
import {
  FaBox,
  FaShoppingCart,
  FaComment,
  FaPlus,
  FaChartLine,
  FaTractor,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaBrain,
} from "react-icons/fa";
import axios from "axios";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { farmerProducts, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { farmerOrders, loading: ordersLoading } = useSelector(
    (state) => state.orders
  );
  const { conversations, loading: messagesLoading } = useSelector(
    (state) => state.messages
  );
  const { user } = useSelector((state) => state.auth);

  const [aiInsights, setAiInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(true);

  useEffect(() => {
    dispatch(getFarmerProducts());
    dispatch(getFarmerOrders());
    dispatch(getConversations());
  }, [dispatch]);

  useEffect(() => {
    fetchFarmerInsights();
  }, [farmerProducts]);

  const fetchFarmerInsights = async () => {
    if (farmerProducts.length === 0) {
      setInsightsLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get("/api/ai/farmer-insights", config);
      setAiInsights(res.data.data);
    } catch (error) {
      console.error("Failed to fetch AI insights", error);
    } finally {
      setInsightsLoading(false);
    }
  };

  const orderCounts = {
    pending: ordersLoading
      ? 0
      : farmerOrders.filter((order) => order.status === "pending").length,
    accepted: ordersLoading
      ? 0
      : farmerOrders.filter((order) => order.status === "accepted").length,
    completed: ordersLoading
      ? 0
      : farmerOrders.filter((order) => order.status === "completed").length,
    rejected: ordersLoading
      ? 0
      : farmerOrders.filter((order) => order.status === "rejected").length,
    cancelled: ordersLoading
      ? 0
      : farmerOrders.filter((order) => order.status === "cancelled").length,
  };

  const unreadMessages = messagesLoading
    ? 0
    : conversations.reduce(
        (total, conversation) => total + conversation.unreadCount,
        0
      );

  const totalRevenue = ordersLoading
    ? 0
    : farmerOrders
        .filter((order) => order.status === "completed")
        .reduce((total, order) => total + order.totalAmount, 0);

  if (productsLoading || ordersLoading || messagesLoading) {
    return <Loader />;
  }

  const stats = [
    {
      title: "Total Products",
      value: farmerProducts.length,
      icon: FaBox,
      color: "from-teal-500 to-teal-600",
      link: "/farmer/products",
      linkText: "Manage Products",
      bgColor: "bg-teal-50",
    },
    {
      title: "Pending Orders",
      value: orderCounts.pending,
      icon: FaShoppingCart,
      color: "from-amber-500 to-amber-600",
      link: "/farmer/orders?status=pending",
      linkText: "View Orders",
      bgColor: "bg-amber-50",
    },
    {
      title: "Unread Messages",
      value: unreadMessages,
      icon: FaComment,
      color: "from-blue-500 to-blue-600",
      link: "/messages",
      linkText: "View Messages",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Revenue",
      value: `₨${totalRevenue.toFixed(2)}`,
      icon: FaChartLine,
      color: "from-emerald-500 to-emerald-600",
      link: "/farmer/orders?status=completed",
      linkText: "View Earnings",
      bgColor: "bg-emerald-50",
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-amber-100 text-amber-700", icon: FaClock },
      accepted: { color: "bg-teal-100 text-teal-700", icon: FaCheckCircle },
      completed: { color: "bg-emerald-100 text-emerald-700", icon: FaCheckCircle },
      rejected: { color: "bg-red-100 text-red-700", icon: FaExclamationTriangle },
      cancelled: { color: "bg-gray-100 text-gray-700", icon: FaExclamationTriangle },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <FaTractor className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Farmer Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
              </div>
            </div>
            <div className="w-20 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full mt-2"></div>
          </div>
          <Link
            to="/farmer/products/add"
            className="mt-4 md:mt-0 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
          >
            <FaPlus className="text-sm" />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* AI Farm Health Score Card */}
        {!insightsLoading && aiInsights && (
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="px-6 py-4">
              <div className="flex items-center gap-2 mb-2">
                <FaBrain className="text-white text-xl" />
                <h2 className="text-xl font-bold text-white">AI Farm Health Score</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-teal-100 text-sm mb-2">Overall Health</p>
                  <div className="flex items-end gap-3">
                    <p className="text-5xl font-bold text-white">{aiInsights.farmHealth.score}%</p>
                    <p className="text-teal-100 mb-1">{aiInsights.farmHealth.level}</p>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 mt-2">
                    <div
                      className="bg-white h-3 rounded-full transition-all duration-500"
                      style={{ width: `${aiInsights.farmHealth.score}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/20 rounded-xl p-3 text-center">
                    <p className="text-xs text-teal-100">Low Stock Items</p>
                    <p className="text-2xl font-bold text-white">{aiInsights.farmHealth.lowStockCount}</p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-3 text-center">
                    <p className="text-xs text-teal-100">Total Products</p>
                    <p className="text-2xl font-bold text-white">{aiInsights.farmHealth.totalProducts}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`text-2xl`} style={{ color: stat.color.split('-')[1] === 'teal' ? '#0d9488' : stat.color.split('-')[1] === 'amber' ? '#d97706' : stat.color.split('-')[1] === 'blue' ? '#3b82f6' : '#10b981' }} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-3">{stat.value}</p>
                <Link
                  to={stat.link}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium inline-flex items-center gap-1 group"
                >
                  {stat.linkText}
                  <FaEye className="text-xs group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* AI Insights for Top Products */}
        {!insightsLoading && aiInsights?.insights?.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FaBrain className="text-teal-600 text-xl" />
              <h2 className="text-xl font-bold text-gray-900">AI Product Insights</h2>
              <span className="text-xs bg-teal-100 text-teal-600 px-2 py-1 rounded-full">Top Recommendations</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiInsights.insights.slice(0, 3).map((product) => (
                <div key={product.productId} className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">{product.productName}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.actionNeeded === "Low Stock Alert" ? "bg-red-100 text-red-600" :
                      product.actionNeeded === "Increase Stock" ? "bg-amber-100 text-amber-600" :
                      product.actionNeeded === "Clearance Recommended" ? "bg-orange-100 text-orange-600" :
                      "bg-green-100 text-green-600"
                    }`}>
                      {product.actionNeeded}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Demand</p>
                      <p className="text-lg font-bold text-teal-600">{product.demandScore}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Freshness</p>
                      <p className="text-lg font-bold text-emerald-600">{product.freshnessScore}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Stock</p>
                      <p className="text-lg font-bold text-gray-800">{product.stock}</p>
                    </div>
                  </div>
                  <Link
                    to={`/products/${product.productId}`}
                    className="block w-full text-center bg-gray-50 hover:bg-teal-50 text-teal-600 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    View Product
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaShoppingCart />
                Recent Orders
              </h2>
              <Link
                to="/farmer/orders"
                className="text-white hover:text-teal-100 transition-colors text-sm font-semibold flex items-center gap-1"
              >
                View All
                <FaEye className="text-xs" />
              </Link>
            </div>
          </div>

          <div className="p-6">
            {farmerOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Order ID</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Customer</th>
                      <th className="text-center py-3 px-4 text-gray-600 font-semibold">Date</th>
                      <th className="text-center py-3 px-4 text-gray-600 font-semibold">Status</th>
                      <th className="text-right py-3 px-4 text-gray-600 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmerOrders.slice(0, 5).map((order) => (
                      <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <Link
                            to={`/orders/${order._id}`}
                            className="text-teal-600 hover:text-teal-700 font-medium"
                          >
                            #{order._id.substring(0, 8)}
                          </Link>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-800">{order.consumer.name}</td>
                        <td className="text-center py-3 px-4 text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="text-center py-3 px-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="text-right py-3 px-4 font-bold text-gray-900">
                          ₨{order.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingCart className="text-gray-400 text-3xl" />
                </div>
                <p className="text-gray-500">No orders yet.</p>
                <p className="text-sm text-gray-400 mt-1">Orders will appear here once customers place them.</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Products Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaExclamationTriangle />
                Low Stock Products
              </h2>
              <Link
                to="/farmer/products"
                className="text-white hover:text-amber-100 transition-colors text-sm font-semibold flex items-center gap-1"
              >
                Manage Inventory
                <FaEye className="text-xs" />
              </Link>
            </div>
          </div>

          <div className="p-6">
            {farmerProducts.filter((product) => product.quantityAvailable < 10).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Product</th>
                      <th className="text-center py-3 px-4 text-gray-600 font-semibold">Price</th>
                      <th className="text-center py-3 px-4 text-gray-600 font-semibold">Stock Left</th>
                      <th className="text-right py-3 px-4 text-gray-600 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmerProducts
                      .filter((product) => product.quantityAvailable < 10)
                      .slice(0, 5)
                      .map((product) => {
                        const getStockColor = () => {
                          if (product.quantityAvailable === 0) return "text-red-600 bg-red-50";
                          if (product.quantityAvailable < 5) return "text-orange-600 bg-orange-50";
                          return "text-yellow-600 bg-yellow-50";
                        };
                        return (
                          <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                  {product.images && product.images.length > 0 ? (
                                    <img
                                      src={product.images[0] || "/placeholder.svg"}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <FaBox className="text-teal-500" />
                                    </div>
                                  )}
                                </div>
                                <span className="font-medium text-gray-800">{product.name}</span>
                              </div>
                            </td>
                            <td className="text-center py-3 px-4 font-semibold text-gray-800">
                              ₨{product.price.toFixed(2)}
                            </td>
                            <td className="text-center py-3 px-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStockColor()}`}>
                                {product.quantityAvailable} {product.unit}
                              </span>
                            </td>
                            <td className="text-right py-3 px-4">
                              <Link
                                to={`/farmer/products/edit/${product._id}`}
                                className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1 group"
                              >
                                Update Stock
                                <FaEye className="text-xs group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-teal-500 text-3xl" />
                </div>
                <p className="text-gray-500">No low stock products.</p>
                <p className="text-sm text-gray-400 mt-1">All your products have sufficient inventory.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;