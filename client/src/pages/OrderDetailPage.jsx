"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../redux/slices/orderSlice";
import { sendMessage } from "../redux/slices/messageSlice";
import Loader from "../components/Loader";
import {
  FaArrowLeft,
  FaLeaf,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaComment,
  FaShoppingBag,
  FaUser,
  FaTractor,
  FaCreditCard,
  FaStickyNote,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
} from "react-icons/fa";

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");

  const { order, loading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    const receiverId =
      user.role === "consumer" ? order.farmer._id : order.consumer._id;

    dispatch(
      sendMessage({
        receiver: receiverId,
        content: message,
        relatedOrder: id,
      })
    );

    setMessage("");
    setShowMessageForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "accepted":
        return "bg-teal-100 text-teal-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "cancelled":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaHourglassHalf className="mr-2" />;
      case "accepted":
      case "completed":
        return <FaCheckCircle className="mr-2" />;
      case "rejected":
      case "cancelled":
        return <FaTimesCircle className="mr-2" />;
      default:
        return null;
    }
  };

  if (loading || !order) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          to={`/${user.role == 'farmer' && 'farmer/'}orders`}
          className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-8 transition-colors duration-200 group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Orders
        </Link>

        {/* Order Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Order #{order._id.substring(0, 8)}
                </h1>
                <p className="text-teal-100">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                {getStatusIcon(order.status)}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Order & Pickup/Delivery Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Order Details */}
              <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                    <FaShoppingBag className="text-teal-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-2xl text-teal-600">
                      ₨{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="capitalize font-medium text-gray-800 flex items-center gap-2">
                      <FaCreditCard className="text-gray-400 text-sm" />
                      {order.paymentMethod.replace("_", " ")}
                    </span>
                  </div>
                  {order.notes && (
                    <div className="mt-4 pt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <FaStickyNote className="text-teal-500 text-sm" />
                        <span className="text-gray-600 font-medium">Notes:</span>
                      </div>
                      <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                        {order.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pickup/Delivery Details */}
              <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                    <FaMapMarkerAlt className="text-teal-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {order.pickupDetails && order.pickupDetails.location
                      ? "Pickup Details"
                      : "Delivery Details"}
                  </h2>
                </div>
                {order.pickupDetails && order.pickupDetails.location ? (
                  <div className="space-y-3">
                    <div className="flex items-start bg-white p-3 rounded-lg border border-gray-200">
                      <FaMapMarkerAlt className="text-teal-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">
                        {order.pickupDetails.location}
                      </span>
                    </div>
                    {order.pickupDetails.date && (
                      <div className="flex items-start bg-white p-3 rounded-lg border border-gray-200">
                        <FaCalendarAlt className="text-teal-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">
                          {formatDate(order.pickupDetails.date)}
                        </span>
                      </div>
                    )}
                    {order.pickupDetails.time && (
                      <div className="flex items-start bg-white p-3 rounded-lg border border-gray-200">
                        <FaClock className="text-teal-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">
                          {order.pickupDetails.time}
                        </span>
                      </div>
                    )}
                  </div>
                ) : order.deliveryDetails && order.deliveryDetails.address ? (
                  <div className="space-y-3">
                    <div className="flex items-start bg-white p-3 rounded-lg border border-gray-200">
                      <FaMapMarkerAlt className="text-teal-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700">
                          {order.deliveryDetails.address.street}
                        </p>
                        <p className="text-gray-700">
                          {order.deliveryDetails.address.city},{" "}
                          {order.deliveryDetails.address.state}{" "}
                          {order.deliveryDetails.address.zipCode}
                        </p>
                      </div>
                    </div>
                    {order.deliveryDetails.date && (
                      <div className="flex items-start bg-white p-3 rounded-lg border border-gray-200">
                        <FaCalendarAlt className="text-teal-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">
                          {formatDate(order.deliveryDetails.date)}
                        </span>
                      </div>
                    )}
                    {order.deliveryDetails.time && (
                      <div className="flex items-start bg-white p-3 rounded-lg border border-gray-200">
                        <FaClock className="text-teal-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">
                          {order.deliveryDetails.time}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-center py-4">
                    No delivery/pickup details provided
                  </p>
                )}
              </div>
            </div>

            {/* Customer & Farmer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                    <FaUser className="text-teal-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Customer Information</h2>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 text-lg">
                    {order.consumer.name}
                  </p>
                  <p className="text-gray-600">{order.consumer.email}</p>
                  {order.consumer.phone && (
                    <p className="text-gray-600">{order.consumer.phone}</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                    <FaTractor className="text-teal-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Farmer Information</h2>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 text-lg">{order.farmer.name}</p>
                  <p className="text-gray-600">{order.farmer.email}</p>
                  {order.farmer.phone && (
                    <p className="text-gray-600">{order.farmer.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaShoppingBag className="text-teal-600" />
              Order Items
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 text-gray-600 font-semibold">
                      Product
                    </th>
                    <th className="text-center py-4 px-4 text-gray-600 font-semibold">
                      Price
                    </th>
                    <th className="text-center py-4 px-4 text-gray-600 font-semibold">
                      Quantity
                    </th>
                    <th className="text-right py-4 px-4 text-gray-600 font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden mr-4 flex-shrink-0">
                            {item.product.images &&
                            item.product.images.length > 0 ? (
                              <img
                                src={item.product.images[0] || "/placeholder.svg"}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-teal-50">
                                <FaLeaf className="text-teal-400 text-xl" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {item.product.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4 text-gray-700">
                        ₨{item.price.toFixed(2)}
                      </td>
                      <td className="text-center py-4 px-4 text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="text-right py-4 px-4 font-semibold text-gray-800">
                        ₨{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan="3"
                      className="text-right py-4 px-4 font-bold text-gray-900 text-lg"
                    >
                      Total:
                    </td>
                    <td className="text-right py-4 px-4 font-bold text-teal-600 text-xl">
                      ₨{order.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaComment className="text-teal-600" />
              Contact {user.role === "consumer" ? "Farmer" : "Customer"}
            </h2>
            {showMessageForm ? (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder={`Write your message to the ${
                    user.role === "consumer" ? "farmer" : "customer"
                  }...`}
                  rows="4"
                  required
                ></textarea>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    Send Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMessageForm(false)}
                    className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowMessageForm(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-50 text-teal-600 rounded-lg font-semibold hover:bg-teal-100 transition-all duration-200 hover:scale-105"
              >
                <FaComment />
                <span>
                  Send a message about this order to the{" "}
                  {user.role === "consumer" ? "farmer" : "customer"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;