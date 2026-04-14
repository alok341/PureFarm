"use client";

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getFarmerProfile,
  clearFarmerProfile,
} from "../redux/slices/farmerSlice";
import { getProducts } from "../redux/slices/productSlice";
import { sendMessage } from "../redux/slices/messageSlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import {
  FaLeaf,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaArrowLeft,
  FaComment,
  FaCheckCircle,
  FaTractor,
  FaClock,
} from "react-icons/fa";

const FarmerDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");

  const { farmerProfile, loading } = useSelector((state) => state.farmers);
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getFarmerProfile(id));
    dispatch(getProducts({ farmer: id }));

    return () => {
      dispatch(clearFarmerProfile());
    };
  }, [dispatch, id]);

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
        receiver: id,
        content: message,
      })
    );

    setMessage("");
    setShowMessageForm(false);
  };

  if (loading || productsLoading) {
    return <Loader />;
  }

  if (!farmerProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-6">
            <span className="block sm:inline">Farmer not found</span>
          </div>
          <Link
            to="/farmers"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Farmers
          </Link>
        </div>
      </div>
    );
  }

  const { farmer, profile } = farmerProfile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/farmers"
          className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6 transition-colors duration-200 group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Farmers
        </Link>

        {/* Farmer Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 hover:shadow-2xl transition-shadow duration-300">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center p-2">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-white">
                    <img
                      src="/logo.png"
                      alt="PureFarm Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-teal-500 rounded-full p-1">
                  <FaLeaf className="text-white text-xs" />
                </div>
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {profile?.farmName || farmer.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-teal-100 mb-4">
                  {farmer.address && (
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>
                        {farmer.address.city}, {farmer.address.state}
                      </span>
                    </div>
                  )}
                  {farmer.phone && (
                    <div className="flex items-center">
                      <FaPhone className="mr-2" />
                      <span>{farmer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <FaEnvelope className="mr-2" />
                    <span>{farmer.email}</span>
                  </div>
                </div>
                
                {profile?.establishedYear && (
                  <div className="flex items-center justify-center md:justify-start text-teal-100">
                    <FaCalendarAlt className="mr-2" />
                    <span>Established in {profile.establishedYear}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            {profile?.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600 leading-relaxed">{profile.description}</p>
              </div>
            )}

            {profile?.socialMedia && (
              <div className="flex space-x-3 mb-6">
                {profile.socialMedia.facebook && (
                  <a
                    href={profile.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 hover:bg-teal-50 rounded-full flex items-center justify-center text-blue-600 hover:text-teal-600 transition-all duration-200 hover:scale-110"
                  >
                    <FaFacebook className="text-lg" />
                  </a>
                )}
                {profile.socialMedia.instagram && (
                  <a
                    href={profile.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 hover:bg-teal-50 rounded-full flex items-center justify-center text-pink-600 hover:text-teal-600 transition-all duration-200 hover:scale-110"
                  >
                    <FaInstagram className="text-lg" />
                  </a>
                )}
                {profile.socialMedia.twitter && (
                  <a
                    href={profile.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 hover:bg-teal-50 rounded-full flex items-center justify-center text-blue-400 hover:text-teal-600 transition-all duration-200 hover:scale-110"
                  >
                    <FaTwitter className="text-lg" />
                  </a>
                )}
              </div>
            )}

            {isAuthenticated && user?.role !== "farmer" && (
              <div>
                {showMessageForm ? (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <form onSubmit={handleSendMessage}>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="Write your message here..."
                        rows="4"
                        required
                      ></textarea>
                      <div className="flex space-x-3 mt-3">
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                        >
                          Send Message
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowMessageForm(false)}
                          className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowMessageForm(true)}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-teal-50 text-teal-600 rounded-lg font-semibold hover:bg-teal-100 transition-all duration-200 hover:scale-105"
                  >
                    <FaComment />
                    <span>Message Farmer</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Farming Practices & Business Hours */}
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {profile.farmingPractices && profile.farmingPractices.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                    <FaTractor className="text-teal-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Farming Practices</h2>
                </div>
                <div className="space-y-3">
                  {profile.farmingPractices.map((practice, index) => (
                    <div key={index} className="flex items-start">
                      <FaCheckCircle className="text-teal-500 mt-1 mr-3 text-sm flex-shrink-0" />
                      <span className="text-gray-700">{practice}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.businessHours && (
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                    <FaClock className="text-teal-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Business Hours</h2>
                </div>
                <div className="space-y-2">
                  {Object.entries(profile.businessHours).map(
                    ([day, hours]) =>
                      hours.open &&
                      hours.close && (
                        <div key={day} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                          <span className="capitalize font-medium text-gray-700">{day}:</span>
                          <span className="text-gray-600">
                            {hours.open} - {hours.close}
                          </span>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Products Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Products</h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-teal-600 to-emerald-600"></div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg text-center py-12 px-4">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLeaf className="text-teal-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Products Available
              </h3>
              <p className="text-gray-600">
                This farmer doesn't have any products listed at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDetailPage;