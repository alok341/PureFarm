"use client";

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  clearProductDetails,
} from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { sendMessage } from "../redux/slices/messageSlice";
import Loader from "../components/Loader";
import AIInsightsCard from "../components/AIInsightsCard";
import {
  FaLeaf,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaUser,
  FaComment,
  FaArrowLeft,
  FaTractor,
  FaCalendarAlt,
  FaBoxes,
  FaCheckCircle,
} from "react-icons/fa";
import { placeholder } from "../assets";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");

  const { product, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems, farmerId } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getProductDetails(id));

    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value);
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user.role === "farmer") {
      alert("Farmers cannot place orders. Please use a consumer account.");
      return;
    }

    if (farmerId && farmerId !== product.farmer._id && cartItems.length > 0) {
      if (
        !confirm(
          "Your cart contains items from a different farm. Would you like to clear your cart and add this item?"
        )
      ) {
        return;
      }
    }

    dispatch(addToCart({ product, quantity }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!message.trim()) {
      return;
    }

    dispatch(
      sendMessage({
        receiver: product.farmer._id,
        content: message,
      })
    );

    setMessage("");
    setShowMessageForm(false);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-6">
            <span className="block sm:inline">{error}</span>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/products"
          className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6 transition-colors duration-200 group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Product Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
                {/* Image Gallery */}
                <div>
                  <div className="bg-gray-50 rounded-2xl overflow-hidden mb-4 h-80 md:h-96">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[activeImage]}
                        alt={product.name}
                        onError={handleImageError}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-teal-50">
                        <FaLeaf className="text-teal-400 text-5xl" />
                      </div>
                    )}
                  </div>

                  {product.images && product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.map((image, index) => (
                        <div
                          key={index}
                          className={`cursor-pointer rounded-xl overflow-hidden h-20 transition-all duration-200 ${
                            activeImage === index 
                              ? "ring-2 ring-teal-500 shadow-lg scale-95" 
                              : "opacity-70 hover:opacity-100 hover:scale-105"
                          }`}
                          onClick={() => setActiveImage(index)}
                        >
                          <img
                            src={image || placeholder}
                            alt={`${product.name} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div>
                  {/* Organic Badge */}
                  {product.isOrganic && (
                    <div className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                      <FaLeaf className="text-sm" />
                      <span>Organic</span>
                    </div>
                  )}

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-500 text-sm">
                      Category: {product.category?.name || "General"}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 text-sm">
                      Unit: {product.unit}
                    </span>
                  </div>

                  <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                    ₨{product.price.toFixed(2)} / {product.unit}
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Product Details */}
                  <div className="bg-gray-50 rounded-xl p-5 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FaBoxes className="text-teal-600" />
                      Product Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Available Quantity:</span>
                        <span className="font-semibold text-gray-900">
                          {product.quantityAvailable} {product.unit}
                        </span>
                      </div>
                      {product.harvestDate && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Harvest Date:</span>
                          <span className="text-gray-700">
                            {new Date(product.harvestDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Farmer Information */}
                  <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-5 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FaTractor className="text-teal-600" />
                      Farmer Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <FaUser className="text-teal-600 mr-2 text-sm" />
                        <span className="text-gray-700">{product.farmer?.name}</span>
                      </div>
                      {product.farmer?.address && (
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="text-teal-600 mr-2 text-sm" />
                          <span className="text-gray-700">
                            {product.farmer.address.city}, {product.farmer.address.state}
                          </span>
                        </div>
                      )}
                      <Link
                        to={`/farmers/${product.farmer?._id}`}
                        className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium mt-2 group"
                      >
                        View Farm Profile
                        <FaArrowLeft className="ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Add to Cart Section */}
                  {user?.role !== "farmer" && (
                    <div className="mb-6">
                      <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="w-full sm:w-1/3">
                          <label
                            htmlFor="quantity"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Quantity
                          </label>
                          <input
                            type="number"
                            id="quantity"
                            min="1"
                            max={product.quantityAvailable}
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div className="w-full sm:w-2/3">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            &nbsp;
                          </label>
                          <button
                            onClick={handleAddToCart}
                            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={product.quantityAvailable === 0}
                          >
                            <FaShoppingCart />
                            <span>
                              {product.quantityAvailable === 0
                                ? "Out of Stock"
                                : "Add to Cart"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message Farmer Section */}
                  {isAuthenticated && user?.role !== "farmer" && (
                    <div className="border-t border-gray-200 pt-6">
                      {showMessageForm ? (
                        <form onSubmit={handleSendMessage} className="space-y-3">
                          <label
                            htmlFor="message"
                            className="block text-sm font-semibold text-gray-700"
                          >
                            Message to Farmer
                          </label>
                          <textarea
                            id="message"
                            rows="3"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            placeholder="Ask a question about this product..."
                            required
                          ></textarea>
                          <div className="flex space-x-3">
                            <button
                              type="submit"
                              className="px-5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                            >
                              Send Message
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowMessageForm(false)}
                              className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => setShowMessageForm(true)}
                          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                        >
                          <FaComment />
                          <span>Message Farmer</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="lg:col-span-1">
            <AIInsightsCard 
              product={product} 
              type={user?.role === "farmer" ? "farmer" : "consumer"} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;