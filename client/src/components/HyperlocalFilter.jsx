"use client";

import { useState } from "react";
import { FaMapMarkerAlt, FaFilter, FaTimes } from "react-icons/fa";

const HyperlocalFilter = ({ radius, onRadiusChange, onClose, userLocation }) => {
  const [selectedRadius, setSelectedRadius] = useState(radius);
  
  const radiusOptions = [
    { value: 5, label: "5 km", icon: "📍" },
    { value: 10, label: "10 km", icon: "🏘️" },
    { value: 25, label: "25 km", icon: "🌆" },
    { value: 50, label: "50 km", icon: "🌍" },
    { value: 100, label: "100 km", icon: "🗺️" }
  ];

  const handleApply = () => {
    onRadiusChange(selectedRadius);
    // Don't call onClose here - it will be called from parent after radius change
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaFilter className="text-white text-xl" />
              <h3 className="text-xl font-bold text-white">Nearby Search</h3>
            </div>
            <button onClick={handleCancel} className="text-white/80 hover:text-white">
              <FaTimes />
            </button>
          </div>
          <p className="text-teal-100 text-sm mt-1">
            Find farmers and products within your preferred distance
          </p>
        </div>
        
        <div className="p-6">
          {userLocation && (
            <div className="mb-4 p-3 bg-teal-50 rounded-xl">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-teal-600" />
                <div>
                  <p className="text-xs text-gray-500">Your location</p>
                  <p className="text-sm font-medium text-gray-800">
                    {userLocation.address || `${userLocation.lat?.toFixed(4)}, ${userLocation.lng?.toFixed(4)}`}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Search Radius
            </label>
            <div className="grid grid-cols-2 gap-3">
              {radiusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedRadius(option.value)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-2 ${
                    selectedRadius === option.value
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-gray-200 hover:border-teal-300 text-gray-700"
                  }`}
                >
                  <span className="text-xl">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleApply}
              className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Apply Filter
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HyperlocalFilter;