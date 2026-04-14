"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllFarmers } from "../redux/slices/farmerSlice";
import FarmerCard from "../components/FarmerCard";
import Loader from "../components/Loader";
import LocationPermission from "../components/LocationPermission";
import HyperlocalFilter from "../components/HyperlocalFilter";
import { 
  FaSearch, 
  FaLeaf, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaLocationArrow,
  FaFilter,
  FaTimes,
  FaSpinner,
  FaHome
} from "react-icons/fa";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || '';

const FarmersPage = () => {
  const dispatch = useDispatch();
  const { farmers, loading } = useSelector((state) => state.farmers);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [showRadiusFilter, setShowRadiusFilter] = useState(false);
  const [showGPTPrompt, setShowGPTPrompt] = useState(false);
  const [nearbyMode, setNearbyMode] = useState(false);
  const [nearbyFarmers, setNearbyFarmers] = useState([]);
  const [radius, setRadius] = useState(50);
  const [userLocation, setUserLocation] = useState(null);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationSource, setLocationSource] = useState("home");

  useEffect(() => {
    dispatch(getAllFarmers());
  }, [dispatch]);

  // Check if user has valid home location
  useEffect(() => {
    if (isAuthenticated && user?.address?.location?.coordinates) {
      const [lng, lat] = user.address.location.coordinates;
      if (lat !== 0 && lng !== 0) {
        setLocationEnabled(true);
        setUserLocation({ lat, lng, address: `${user.address.city}, ${user.address.state}` });
      }
    }
  }, [isAuthenticated, user]);

  const fetchNearbyFarmers = async (lat, lng, radiusKm) => {
    setLoadingNearby(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(
        `${API_URL}/hyperlocal/nearby-farmers?radius=${radiusKm}`,
        config
      );
      setNearbyFarmers(res.data.data);
      setUserLocation(res.data.userLocation);
    } catch (error) {
      console.error("Failed to fetch nearby farmers", error);
      setNearbyFarmers([]);
      if (error.response?.status === 400) {
        alert(error.response.data.message);
      }
    } finally {
      setLoadingNearby(false);
    }
  };

  const useHomeLocation = () => {
    if (user?.address?.location?.coordinates) {
      const [lng, lat] = user.address.location.coordinates;
      if (lat !== 0 && lng !== 0) {
        setLocationSource("home");
        setUserLocation({ 
          lat, 
          lng, 
          address: `${user.address.city || ''}, ${user.address.state || ''}` 
        });
        setLocationEnabled(true);
        setNearbyMode(true);
        fetchNearbyFarmers(lat, lng, radius);
        setShowLocationOptions(false);
      } else {
        alert("Please go to Profile and click 'Get Location Coordinates' to set your home location");
        setShowLocationOptions(false);
      }
    } else {
      alert("Please go to Profile and add your address with location coordinates");
      setShowLocationOptions(false);
    }
  };

  const useCurrentLocation = () => {
    setShowLocationOptions(false);
    setShowGPTPrompt(true);
  };

  const handleLocationUpdate = (location) => {
    setLocationSource("current");
    setUserLocation({ 
      lat: location.latitude, 
      lng: location.longitude, 
      address: location.address?.displayName || `${location.latitude}, ${location.longitude}`
    });
    setLocationEnabled(true);
    setNearbyMode(true);
    fetchNearbyFarmers(location.latitude, location.longitude, radius);
    setShowGPTPrompt(false);
  };

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
    if (userLocation) {
      fetchNearbyFarmers(userLocation.lat, userLocation.lng, newRadius);
    }
    setShowRadiusFilter(false);
  };

  const toggleNearbyMode = () => {
    if (!nearbyMode) {
      setShowLocationOptions(true);
    } else {
      setNearbyMode(false);
      setLocationEnabled(false);
    }
  };

  // Filter farmers based on search term
  useEffect(() => {
    const farmersToFilter = nearbyMode ? nearbyFarmers : farmers;
    if (farmersToFilter) {
      setFilteredFarmers(
        farmersToFilter.filter((farmer) =>
          farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [farmers, nearbyFarmers, searchTerm, nearbyMode]);

  if (loading) {
    return <Loader />;
  }

  const displayFarmers = filteredFarmers;
  const isLoading = (nearbyMode && loadingNearby) || loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      {/* Location Options Modal */}
      {showLocationOptions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaLocationArrow className="text-white text-xl" />
                  <h3 className="text-xl font-bold text-white">Choose Location</h3>
                </div>
                <button onClick={() => setShowLocationOptions(false)} className="text-white/80 hover:text-white">
                  <FaTimes />
                </button>
              </div>
              <p className="text-teal-100 text-sm mt-1">
                Select how you want to find nearby farmers
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                <button
                  onClick={useHomeLocation}
                  className="w-full flex items-center gap-4 p-4 bg-teal-50 rounded-xl hover:bg-teal-100 transition-all duration-200 border border-teal-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full flex items-center justify-center">
                    <FaHome className="text-white text-xl" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Home Address</p>
                    <p className="text-sm text-gray-500">
                      {user?.address?.city && user?.address?.state 
                        ? `${user.address.city}, ${user.address.state}`
                        : "Set up in Profile"}
                    </p>
                  </div>
                </button>

                <button
                  onClick={useCurrentLocation}
                  className="w-full flex items-center gap-4 p-4 bg-teal-50 rounded-xl hover:bg-teal-100 transition-all duration-200 border border-teal-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full flex items-center justify-center">
                    <FaLocationArrow className="text-white text-xl" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Current Location</p>
                    <p className="text-sm text-gray-500">Use your device's GPS location</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GPS Permission Modal */}
      {showGPTPrompt && (
        <LocationPermission
          onLocationUpdate={handleLocationUpdate}
          onSkip={() => setShowGPTPrompt(false)}
        />
      )}

      {/* Radius Filter Modal */}
      {showRadiusFilter && (
        <HyperlocalFilter
          radius={radius}
          onRadiusChange={handleRadiusChange}
          onClose={() => setShowRadiusFilter(false)}
          userLocation={userLocation}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-3 rounded-2xl">
              <FaUsers className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {nearbyMode ? "Nearby Farmers" : "Our Farmers"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {nearbyMode 
              ? `Discover farmers within ${radius}km of your ${locationSource === 'home' ? 'home' : 'current'} location`
              : "Connect with local farmers who grow fresh, organic produce just for you"}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-grow relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search farmers by name..."
                className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Nearby Toggle Button */}
            {isAuthenticated && (
              <button
                onClick={toggleNearbyMode}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  nearbyMode
                    ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-teal-300 hover:text-teal-600"
                }`}
              >
                <FaLocationArrow className="text-sm" />
                <span>Nearby</span>
              </button>
            )}

            {/* Filter Button (only in nearby mode) */}
            {nearbyMode && locationEnabled && (
              <button
                onClick={() => setShowRadiusFilter(true)}
                className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-teal-300 hover:text-teal-600 transition-all duration-200"
              >
                <FaFilter className="text-sm" />
                <span>{radius} km</span>
              </button>
            )}
          </div>

          {/* Location Info Banner */}
          {nearbyMode && locationEnabled && userLocation && (
            <div className="mt-4 p-3 bg-teal-50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                {locationSource === 'home' ? <FaHome className="text-teal-600" /> : <FaLocationArrow className="text-teal-600" />}
                <span className="text-sm text-gray-600">
                  Showing farmers within <strong>{radius} km</strong> of your {locationSource === 'home' ? 'home address' : 'current location'}
                </span>
              </div>
              <span className="text-xs text-teal-600">
                {nearbyFarmers.length} farmers found
              </span>
            </div>
          )}
        </div>

        {/* Results Count */}
        {displayFarmers.length > 0 && !isLoading && (
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-500">
              Found {displayFarmers.length} farmer{displayFarmers.length !== 1 ? 's' : ''}
              {nearbyMode && " near you"}
            </p>
          </div>
        )}

        {/* Farmers Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-3">
              <FaSpinner className="animate-spin text-teal-600 text-2xl" />
              <span className="text-gray-600">Finding farmers near you...</span>
            </div>
          </div>
        ) : displayFarmers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayFarmers.map((farmer) => (
              <FarmerCard 
                key={farmer._id} 
                farmer={farmer} 
                showDistance={nearbyMode}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg text-center py-16 px-4">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaLeaf className="text-teal-600 text-4xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {searchTerm ? "No Farmers Found" : "No Farmers Available"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm
                ? `No farmers matching "${searchTerm}" were found. Try adjusting your search criteria.`
                : nearbyMode
                ? `No farmers found within ${radius}km of your location.`
                : "No farmers are currently available. Please check back later."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-6 inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Clear Search
              </button>
            )}
            {nearbyMode && !searchTerm && (
              <button
                onClick={() => setShowRadiusFilter(true)}
                className="mt-6 inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Increase Search Radius
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmersPage;