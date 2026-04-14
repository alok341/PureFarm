"use client";

import { useState } from "react";
import { FaMapMarkerAlt, FaLocationArrow, FaTimes } from "react-icons/fa";
import { getCurrentLocation, getAddressFromCoords } from "../services/locationService";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || '';

const LocationPermission = ({ onLocationUpdate, onSkip }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPrompt, setShowPrompt] = useState(true);

  const handleAllowLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { latitude, longitude } = await getCurrentLocation();
      const address = await getAddressFromCoords(latitude, longitude);
      
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/hyperlocal/update-location`,
        { latitude, longitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Location update response:", response.data);
      
      onLocationUpdate({ latitude, longitude, address });
      setShowPrompt(false);
    } catch (err) {
      console.error("Location error:", err);
      setError(err.response?.data?.message || err.message || "Failed to get your location");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setShowPrompt(false);
    if (onSkip) onSkip();
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaLocationArrow className="text-white text-xl" />
              <h3 className="text-xl font-bold text-white">Enable Location</h3>
            </div>
            <button onClick={handleSkip} className="text-white/80 hover:text-white">
              <FaTimes />
            </button>
          </div>
          <p className="text-teal-100 text-sm mt-1">
            Allow location access to discover nearby farmers and products
          </p>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4 p-4 bg-teal-50 rounded-xl">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full flex items-center justify-center">
              <FaMapMarkerAlt className="text-white text-xl" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Find what's near you</p>
              <p className="text-sm text-gray-500">
                See farmers and products in your area
              </p>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={handleAllowLocation}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Getting location...
                </>
              ) : (
                <>
                  <FaLocationArrow />
                  Allow Location
                </>
              )}
            </button>
            <button
              onClick={handleSkip}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPermission;