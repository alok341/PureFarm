"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/slices/userSlice";
import { getAllOrders } from "../../redux/slices/orderSlice";
import { getCategories } from "../../redux/slices/categorySlice";
import { getProducts } from "../../redux/slices/productSlice";
import Loader from "../../components/Loader";
import { 
  FaUsers, 
  FaList, 
  FaBox, 
  FaUserCheck,
  FaShoppingCart,
  FaMoneyBillWave,
  FaChartLine,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaHourglassHalf
} from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { adminOrders, loading: ordersLoading } = useSelector(
    (state) => state.orders
  );
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllOrders());
    dispatch(getCategories());
    dispatch(getProducts());
  }, [dispatch]);

  // Count users by role
  const userCounts = {
    total: users.length,
    farmers: users.filter((u) => u.role === "farmer").length,
    consumers: users.filter((u) => u.role === "consumer").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  // Count orders by status
  const orderCounts = {
    total: adminOrders.length,
    pending: adminOrders.filter((order) => order.status === "pending").length,
    accepted: adminOrders.filter((order) => order.status === "accepted").length,
    completed: adminOrders.filter((order) => order.status === "completed")
      .length,
    rejected: adminOrders.filter((order) => order.status === "rejected").length,
    cancelled: adminOrders.filter((order) => order.status === "cancelled")
      .length,
  };

  // Calculate total revenue
  const totalRevenue = adminOrders
    .filter((order) => order.status === "completed")
    .reduce((total, order) => total + order.totalAmount, 0);

  if (usersLoading || ordersLoading || categoriesLoading || productsLoading) {
    return <Loader />;
  }

  const stats = [
    {
      title: "Total Users",
      value: userCounts.total - userCounts.admins,
      icon: FaUsers,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      link: "/admin/users",
      linkText: "Manage Users",
    },
    {
      title: "Total Orders",
      value: orderCounts.total,
      icon: FaShoppingCart,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      link: "/admin/orders",
      linkText: "View All Orders",
    },
    {
      title: "Categories",
      value: categories.length,
      icon: FaList,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      link: "/admin/categories",
      linkText: "Manage Categories",
    },
    {
      title: "Total Revenue",
      value: `₨${totalRevenue.toFixed(2)}`,
      icon: FaMoneyBillWave,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      link: "/admin/orders?status=completed",
      linkText: "View Earnings",
    },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <FaChartLine className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Overview of your platform's performance</p>
            </div>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full mt-2"></div>
        </div>

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
                    <Icon className="text-2xl" style={{ color: stat.color.split('-')[1] === 'blue' ? '#3b82f6' : stat.color.split('-')[1] === 'orange' ? '#f97316' : stat.color.split('-')[1] === 'purple' ? '#a855f7' : '#10b981' }} />
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

        {/* User Statistics Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaUsers />
              User Statistics
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Farmers</p>
                    <p className="text-3xl font-bold text-emerald-600">{userCounts.farmers}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <GiFarmer className="text-emerald-600 text-xl" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Consumers</p>
                    <p className="text-3xl font-bold text-blue-600">{userCounts.consumers}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUserCheck className="text-blue-600 text-xl" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Admins</p>
                    <p className="text-3xl font-bold text-purple-600">{userCounts.admins}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <FaUsers className="text-purple-600 text-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Statistics Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaShoppingCart />
              Order Statistics
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <FaHourglassHalf className="text-amber-500" />
                  <p className="text-2xl font-bold text-amber-600">{orderCounts.pending}</p>
                </div>
                <p className="text-sm text-gray-600">Pending Orders</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                <div className="flex items-center justify-between mb-2">
                  <FaCheckCircle className="text-teal-500" />
                  <p className="text-2xl font-bold text-teal-600">{orderCounts.accepted}</p>
                </div>
                <p className="text-sm text-gray-600">Accepted Orders</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <div className="flex items-center justify-between mb-2">
                  <FaCheckCircle className="text-emerald-500" />
                  <p className="text-2xl font-bold text-emerald-600">{orderCounts.completed}</p>
                </div>
                <p className="text-sm text-gray-600">Completed Orders</p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <div className="flex items-center justify-between mb-2">
                  <FaTimesCircle className="text-red-500" />
                  <p className="text-2xl font-bold text-red-600">{orderCounts.rejected}</p>
                </div>
                <p className="text-sm text-gray-600">Rejected Orders</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <FaBan className="text-gray-500" />
                  <p className="text-2xl font-bold text-gray-600">{orderCounts.cancelled}</p>
                </div>
                <p className="text-sm text-gray-600">Cancelled Orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaShoppingCart />
                  Recent Orders
                </h2>
                <Link
                  to="/admin/orders"
                  className="text-white hover:text-teal-100 transition-colors text-sm font-semibold flex items-center gap-1"
                >
                  View All
                  <FaEye className="text-xs" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              {adminOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminOrders.slice(0, 5).map((order) => (
                        <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-2">
                            <Link
                              to={`/orders/${order._id}`}
                              className="text-teal-600 hover:text-teal-700 font-medium"
                            >
                              #{order._id.substring(0, 8)}
                            </Link>
                          </td>
                          <td className="py-3 px-2 font-medium text-gray-800">
                            {order.consumer.name}
                          </td>
                          <td className="text-center py-3 px-2">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="text-right py-3 px-2 font-bold text-gray-900">
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
                </div>
              )}
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaBox />
                  Recent Products
                </h2>
                <Link
                  to="/products"
                  className="text-white hover:text-teal-100 transition-colors text-sm font-semibold flex items-center gap-1"
                >
                  View All
                  <FaEye className="text-xs" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              {products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Farmer
                        </th>
                        <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Stock
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.slice(0, 5).map((product) => {
                        const getStockColor = () => {
                          if (product.quantityAvailable === 0) return "text-red-600";
                          if (product.quantityAvailable < 5) return "text-orange-600";
                          return "text-emerald-600";
                        };
                        return (
                          <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                  {product.images && product.images.length > 0 ? (
                                    <img
                                      src={product.images[0] || "/placeholder.svg"}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <FaBox className="text-teal-500 text-sm" />
                                    </div>
                                  )}
                                </div>
                                <Link
                                  to={`/products/${product._id}`}
                                  className="text-teal-600 hover:text-teal-700 font-medium"
                                >
                                  {product.name}
                                </Link>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-gray-700">{product.farmer?.name}</td>
                            <td className="text-center py-3 px-2 font-semibold text-gray-800">
                              ₨{product.price.toFixed(2)}
                            </td>
                            <td className="text-right py-3 px-2">
                              <span className={`font-semibold ${getStockColor()}`}>
                                {product.quantityAvailable} {product.unit}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBox className="text-gray-400 text-3xl" />
                  </div>
                  <p className="text-gray-500">No products yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;