"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getProducts } from "../redux/slices/productSlice";
import { getCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import LocationPermission from "../components/LocationPermission";
import HyperlocalFilter from "../components/HyperlocalFilter";
import { 
  FaFilter, 
  FaLocationArrow, 
  FaSearch, 
  FaLeaf, 
  FaTimes, 
  FaShoppingBag,
  FaSpinner,
  FaHome
} from "react-icons/fa";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || '';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const { products, loading } = useSelector((state) => state.products);
  const { categories, loading: categoryLoading } = useSelector(
    (state) => state.categories
  );

  const [filters, setFilters] = useState({
    category: "",
    search: "",
    sort: "newest",
  });

  const [showFilters, setShowFilters] = useState(false);
  
  // Hyperlocal states
  const [nearbyMode, setNearbyMode] = useState(false);
  const [nearbyProducts, setNearbyProducts] = useState([]);
  const [radius, setRadius] = useState(50);
  const [userLocation, setUserLocation] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [showGPTPrompt, setShowGPTPrompt] = useState(false);
  const [showRadiusFilter, setShowRadiusFilter] = useState(false);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [locationSource, setLocationSource] = useState("home");
  
  // Use ref to prevent multiple API calls
  const isFetchingRef = useRef(false);
  const initialLoadRef = useRef(true);

  // Get categories and sync URL param
  useEffect(() => {
    dispatch(getCategories());

    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");

    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [dispatch, location.search]);

  // Check if user has valid home location (only once)
  useEffect(() => {
    if (isAuthenticated && user?.address?.location?.coordinates && initialLoadRef.current) {
      const [lng, lat] = user.address.location.coordinates;
      if (lat !== 0 && lng !== 0) {
        setLocationEnabled(true);
        setUserLocation({ lat, lng, address: `${user.address.city}, ${user.address.state}` });
      }
      initialLoadRef.current = false;
    }
  }, [isAuthenticated, user]);

  // Debounced product fetching for normal mode
  useEffect(() => {
    if (!nearbyMode) {
      const delayDebounce = setTimeout(() => {
        const params = {};

        if (filters.category) {
          params.category = filters.category;
        }

        if (filters.search) {
          params.search = filters.search;
        }

        dispatch(getProducts(params));
      }, 500);

      return () => clearTimeout(delayDebounce);
    }
  }, [dispatch, filters.category, filters.search, nearbyMode]);

  const fetchNearbyProducts = useCallback(async (lat, lng, radiusKm, categoryFilter = null) => {
    // Prevent multiple simultaneous calls
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoadingNearby(true);
    
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let url = `${API_URL}/hyperlocal/nearby-products?radius=${radiusKm}`;
      if (categoryFilter) {
        url += `&category=${categoryFilter}`;
      }
      const res = await axios.get(url, config);
      setNearbyProducts(res.data.data || []);
      setUserLocation(res.data.userLocation);
    } catch (error) {
      console.error("Failed to fetch nearby products", error);
      setNearbyProducts([]);
    } finally {
      setLoadingNearby(false);
      isFetchingRef.current = false;
    }
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      search: "",
      sort: "newest",
    });
    setShowFilters(false);
  };

  const useHomeLocation = useCallback(() => {
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
        fetchNearbyProducts(lat, lng, radius, filters.category);
        setShowLocationOptions(false);
      } else {
        alert("Please go to Profile and click 'Get Location Coordinates' to set your home location");
        setShowLocationOptions(false);
      }
    } else {
      alert("Please go to Profile and add your address with location coordinates");
      setShowLocationOptions(false);
    }
  }, [user, radius, filters.category, fetchNearbyProducts]);

  const useCurrentLocation = () => {
    setShowLocationOptions(false);
    setShowGPTPrompt(true);
  };

  const handleLocationUpdate = useCallback((locationData) => {
    setLocationSource("current");
    setUserLocation({ 
      lat: locationData.latitude, 
      lng: locationData.longitude, 
      address: locationData.address?.displayName || `${locationData.latitude}, ${locationData.longitude}`
    });
    setLocationEnabled(true);
    setNearbyMode(true);
    fetchNearbyProducts(locationData.latitude, locationData.longitude, radius, filters.category);
    setShowGPTPrompt(false);
  }, [radius, filters.category, fetchNearbyProducts]);

  const handleRadiusChange = useCallback((newRadius) => {
    setRadius(newRadius);
    if (userLocation) {
      fetchNearbyProducts(userLocation.lat, userLocation.lng, newRadius, filters.category);
    }
    setShowRadiusFilter(false);
  }, [userLocation, filters.category, fetchNearbyProducts]);

  const toggleNearbyMode = () => {
    if (!nearbyMode) {
      setShowLocationOptions(true);
    } else {
      setNearbyMode(false);
      setLocationEnabled(false);
      setNearbyProducts([]);
    }
  };

  // Get products to display based on mode
  const displayProducts = nearbyMode ? nearbyProducts : [...products].sort((a, b) => {
    if (filters.sort === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (filters.sort === "price-low") {
      return a.price - b.price;
    } else if (filters.sort === "price-high") {
      return b.price - a.price;
    }
    return 0;
  });

  // Apply search filter to nearby products
  const filteredNearbyProducts = nearbyMode && filters.search
    ? displayProducts.filter(product => 
        product.name?.toLowerCase().includes(filters.search.toLowerCase())
      )
    : displayProducts;

  const finalProducts = nearbyMode ? filteredNearbyProducts : displayProducts;

  if (loading || categoryLoading) {
    return <Loader />;
  }

  const selectedCategory = categories.find(cat => cat._id === filters.category);
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
                Select how you want to find nearby products
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <FaShoppingBag className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {nearbyMode ? "Nearby Products" : "Browse Products"}
              </h1>
              <p className="text-gray-600 mt-1">
                {nearbyMode 
                  ? `Fresh produce within ${radius}km of your ${locationSource === 'home' ? 'home' : 'current'} location`
                  : "Fresh produce directly from local farms"}
              </p>
            </div>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full mt-2"></div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search products by name..."
                  className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                {filters.search && (
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, search: "" })}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </form>

            <div className="flex gap-3">
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white shadow-sm cursor-pointer"
                disabled={nearbyMode}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

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

              <button
                onClick={toggleFilters}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  showFilters || filters.category
                    ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-teal-300 hover:text-teal-600"
                }`}
              >
                <FaFilter className="text-sm" />
                <span>Filters</span>
                {filters.category && (
                  <span className="ml-1 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                    1
                  </span>
                )}
              </button>

              {/* Radius Filter Button (only in nearby mode) */}
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
          </div>

          {/* Location Info Banner */}
          {nearbyMode && locationEnabled && userLocation && (
            <div className="mt-4 p-3 bg-teal-50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                {locationSource === 'home' ? <FaHome className="text-teal-600" /> : <FaLocationArrow className="text-teal-600" />}
                <span className="text-sm text-gray-600">
                  Showing products within <strong>{radius} km</strong> of your {locationSource === 'home' ? 'home address' : 'current location'}
                </span>
              </div>
              <span className="text-xs text-teal-600">
                {nearbyProducts.length} products found
              </span>
            </div>
          )}

          {/* Active Filters */}
          {filters.category && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm">
                <FaLeaf className="text-xs" />
                {selectedCategory?.name || filters.category}
                <button
                  onClick={() => setFilters({ ...filters, category: "" })}
                  className="hover:text-teal-900"
                >
                  <FaTimes className="text-xs" />
                </button>
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Filter Products</h3>
                <button
                  onClick={toggleFilters}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {finalProducts.length > 0 && !isLoading && (
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Found {finalProducts.length} product{finalProducts.length !== 1 ? 's' : ''}
              {filters.search && ` matching "${filters.search}"`}
              {filters.category && selectedCategory && ` in ${selectedCategory.name}`}
              {nearbyMode && " near you"}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-3">
              <FaSpinner className="animate-spin text-teal-600 text-2xl" />
              <span className="text-gray-600">Finding products near you...</span>
            </div>
          </div>
        ) : finalProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {finalProducts.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                showDistance={nearbyMode}
                distance={product.distance}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg text-center py-16 px-4">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaSearch className="text-teal-600 text-4xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {filters.search || filters.category
                ? "No products match your search criteria. Try adjusting your filters or search term."
                : nearbyMode
                ? `No products found within ${radius}km of your location.`
                : "No products are currently available. Please check back later."}
            </p>
            {(filters.search || filters.category) && (
              <button
                onClick={clearFilters}
                className="mt-6 inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Clear Filters
              </button>
            )}
            {nearbyMode && !filters.search && !filters.category && (
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

export default ProductsPage;