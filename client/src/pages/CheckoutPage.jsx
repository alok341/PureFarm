"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "../redux/slices/cartSlice";
import { createOrder } from "../redux/slices/orderSlice";
import { FaArrowLeft, FaLeaf, FaTrash, FaTruck, FaStore, FaCreditCard, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaStickyNote } from "react-icons/fa";
import Loader from "../components/Loader";
import { placeholder } from "../assets";

const CheckoutPage = () => {
  const [orderType, setOrderType] = useState("pickup");
  const [orderDetails, setOrderDetails] = useState({
    pickupDetails: {
      date: "",
      time: "",
      location: "",
    },
    deliveryDetails: {
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
      date: "",
      time: "",
    },
    paymentMethod: "cash",
    notes: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, farmerId, farmerName } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.auth);
  const { loading, success, order } = useSelector((state) => state.orders);

  useEffect(() => {
    if (success && order) {
      navigate(`/orders/${order._id}`);
    }
  }, [success, order, navigate]);

  useEffect(() => {
    if (user && user.address) {
      setOrderDetails((prev) => ({
        ...prev,
        deliveryDetails: {
          ...prev.deliveryDetails,
          address: {
            street: user.address.street || "",
            city: user.address.city || "",
            state: user.address.state || "",
            zipCode: user.address.zipCode || "",
          },
        },
      }));
    }
  }, [user]);

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId, quantity) => {
    dispatch(updateCartQuantity({ productId, quantity }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child, grandchild] = name.split(".");

      if (grandchild) {
        setOrderDetails({
          ...orderDetails,
          [parent]: {
            ...orderDetails[parent],
            [child]: {
              ...orderDetails[parent][child],
              [grandchild]: value,
            },
          },
        });
      } else {
        setOrderDetails({
          ...orderDetails,
          [parent]: {
            ...orderDetails[parent],
            [child]: value,
          },
        });
      }
    } else {
      setOrderDetails({
        ...orderDetails,
        [name]: value,
      });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      return;
    }

    const orderData = {
      farmer: farmerId,
      items: cartItems.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      notes: orderDetails.notes,
    };

    if (orderType === "pickup") {
      orderData.pickupDetails = orderDetails.pickupDetails;
    } else {
      orderData.deliveryDetails = orderDetails.deliveryDetails;
    }

    orderData.paymentMethod = orderDetails.paymentMethod;
    dispatch(createOrder(orderData));
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  if (loading) {
    return <Loader />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-teal-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLeaf className="text-teal-600 text-4xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-teal-600 hover:text-teal-700 mb-6 transition-colors duration-200 group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FaLeaf className="mr-2" />
                  Your Cart
                </h2>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-gray-600 mb-4 pb-4 border-b border-gray-100">
                  <FaLeaf className="text-teal-500 mr-2" />
                  <span className="font-medium">Ordering from: {farmerName}</span>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 rounded-lg px-2"
                    >
                      <div className="flex items-center mb-3 sm:mb-0">
                        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden mr-4 shadow-sm">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              onError={handleImageError}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={placeholder}
                              alt="placeholder"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-teal-600 font-medium mt-1">₨{item.price.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div>
                          <label htmlFor={`quantity-${item.productId}`} className="sr-only">
                            Quantity
                          </label>
                          <input
                            type="number"
                            id={`quantity-${item.productId}`}
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.productId,
                                Number.parseInt(e.target.value)
                              )
                            }
                            className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          />
                        </div>

                        <div className="text-right min-w-[100px]">
                          <p className="font-bold text-gray-900">
                            ₨{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-red-500 hover:text-red-700 text-sm flex items-center justify-end mt-1 transition-colors"
                          >
                            <FaTrash className="mr-1 text-xs" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    Clear Cart
                  </button>
                  <div className="text-2xl font-bold text-gray-900">
                    Total: ₨{calculateTotal().toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 sticky top-8">
              <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Order Details</h2>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmitOrder}>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Order Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setOrderType("pickup")}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                          orderType === "pickup"
                            ? "border-teal-500 bg-teal-50 text-teal-700"
                            : "border-gray-200 hover:border-teal-300 text-gray-600"
                        }`}
                      >
                        <FaStore className="text-sm" />
                        <span className="font-medium">Pickup</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType("delivery")}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                          orderType === "delivery"
                            ? "border-teal-500 bg-teal-50 text-teal-700"
                            : "border-gray-200 hover:border-teal-300 text-gray-600"
                        }`}
                      >
                        <FaTruck className="text-sm" />
                        <span className="font-medium">Delivery</span>
                      </button>
                    </div>
                  </div>

                  {orderType === "pickup" ? (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label htmlFor="pickupDate" className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaCalendarAlt className="inline mr-2 text-teal-500" />
                          Pickup Date
                        </label>
                        <input
                          type="date"
                          id="pickupDate"
                          name="pickupDetails.date"
                          value={orderDetails.pickupDetails.date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="pickupTime" className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaClock className="inline mr-2 text-teal-500" />
                          Pickup Time
                        </label>
                        <input
                          type="time"
                          id="pickupTime"
                          name="pickupDetails.time"
                          value={orderDetails.pickupDetails.time}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="pickupLocation" className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaMapMarkerAlt className="inline mr-2 text-teal-500" />
                          Pickup Location
                        </label>
                        <input
                          type="text"
                          id="pickupLocation"
                          name="pickupDetails.location"
                          value={orderDetails.pickupDetails.location}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          placeholder="Farm address or specific pickup point"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaMapMarkerAlt className="inline mr-2 text-teal-500" />
                          Delivery Address
                        </label>
                        <input
                          type="text"
                          name="deliveryDetails.address.street"
                          value={orderDetails.deliveryDetails.address.street}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all mb-2"
                          placeholder="Street address"
                          required
                        />

                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <input
                            type="text"
                            name="deliveryDetails.address.city"
                            value={orderDetails.deliveryDetails.address.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            placeholder="City"
                            required
                          />
                          <input
                            type="text"
                            name="deliveryDetails.address.state"
                            value={orderDetails.deliveryDetails.address.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            placeholder="State"
                            required
                          />
                        </div>

                        <input
                          type="text"
                          name="deliveryDetails.address.zipCode"
                          value={orderDetails.deliveryDetails.address.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          placeholder="ZIP / Postal code"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="deliveryDate" className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaCalendarAlt className="inline mr-2 text-teal-500" />
                          Delivery Date
                        </label>
                        <input
                          type="date"
                          id="deliveryDate"
                          name="deliveryDetails.date"
                          value={orderDetails.deliveryDetails.date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="deliveryTime" className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaClock className="inline mr-2 text-teal-500" />
                          Delivery Time
                        </label>
                        <input
                          type="time"
                          id="deliveryTime"
                          name="deliveryDetails.time"
                          value={orderDetails.deliveryDetails.time}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <label htmlFor="paymentMethod" className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaCreditCard className="inline mr-2 text-teal-500" />
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={orderDetails.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="cash">Cash on Pickup/Delivery</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaStickyNote className="inline mr-2 text-teal-500" />
                      Order Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="3"
                      value={orderDetails.notes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                      placeholder="Any special instructions or requests..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      "Place Order"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;