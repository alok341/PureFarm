"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, loadUser } from "../redux/slices/authSlice";
import { updateFarmerProfile } from "../redux/slices/farmerSlice";
import Loader from "../components/Loader";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLeaf,
  FaCheck,
  FaTractor,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaClock,
  FaTruck,
  FaStore,
  FaPlus,
  FaTrash,
  FaSave,
  FaLocationArrow,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || '';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const {
    myFarmerProfile,
    loading: farmerLoading,
    success: farmerSuccess,
  } = useSelector((state) => state.farmers);

  const [userForm, setUserForm] = useState({
    name: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const [farmerForm, setFarmerForm] = useState({
    farmName: "",
    description: "",
    farmingPractices: [],
    establishedYear: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    businessHours: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
    },
    acceptsPickup: false,
    acceptsDelivery: false,
    deliveryRadius: 0,
  });

  const [farmingPractice, setFarmingPractice] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [userSaveSuccess, setUserSaveSuccess] = useState(false);
  const [updatingLocation, setUpdatingLocation] = useState(false);

  useEffect(() => {
    if (user) {
      setUserForm({
        name: user.name || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
        },
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "farmer" && myFarmerProfile) {
      setFarmerForm({
        farmName: myFarmerProfile.farmName || "",
        description: myFarmerProfile.description || "",
        farmingPractices: myFarmerProfile.farmingPractices || [],
        establishedYear: myFarmerProfile.establishedYear || "",
        socialMedia: {
          facebook: myFarmerProfile.socialMedia?.facebook || "",
          instagram: myFarmerProfile.socialMedia?.instagram || "",
          twitter: myFarmerProfile.socialMedia?.twitter || "",
        },
        businessHours: {
          monday: myFarmerProfile.businessHours?.monday || {
            open: "",
            close: "",
          },
          tuesday: myFarmerProfile.businessHours?.tuesday || {
            open: "",
            close: "",
          },
          wednesday: myFarmerProfile.businessHours?.wednesday || {
            open: "",
            close: "",
          },
          thursday: myFarmerProfile.businessHours?.thursday || {
            open: "",
            close: "",
          },
          friday: myFarmerProfile.businessHours?.friday || {
            open: "",
            close: "",
          },
          saturday: myFarmerProfile.businessHours?.saturday || {
            open: "",
            close: "",
          },
          sunday: myFarmerProfile.businessHours?.sunday || {
            open: "",
            close: "",
          },
        },
        acceptsPickup: myFarmerProfile.acceptsPickup || false,
        acceptsDelivery: myFarmerProfile.acceptsDelivery || false,
        deliveryRadius: myFarmerProfile.deliveryRadius || 0,
      });
    }
  }, [user, myFarmerProfile]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setUserForm({
        ...userForm,
        [parent]: {
          ...userForm[parent],
          [child]: value,
        },
      });
    } else {
      setUserForm({
        ...userForm,
        [name]: value,
      });
    }
  };

  const handleFarmerChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFarmerForm({
        ...farmerForm,
        [name]: checked,
      });
      return;
    }

    if (name.includes(".")) {
      const [parent, child, grandchild] = name.split(".");

      if (grandchild) {
        setFarmerForm({
          ...farmerForm,
          [parent]: {
            ...farmerForm[parent],
            [child]: {
              ...farmerForm[parent][child],
              [grandchild]: value,
            },
          },
        });
      } else {
        setFarmerForm({
          ...farmerForm,
          [parent]: {
            ...farmerForm[parent],
            [child]: value,
          },
        });
      }
    } else {
      setFarmerForm({
        ...farmerForm,
        [name]: value,
      });
    }
  };

  const updateLocationCoordinates = async () => {
    if (!userForm.address.city && !userForm.address.state) {
      toast.error("Please enter city and state first");
      return;
    }

    setUpdatingLocation(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/users/geocode-address`,
        { address: userForm.address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("Location coordinates updated! You can now use 'Home Address' for nearby search.");
        dispatch(loadUser());
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update location");
    } finally {
      setUpdatingLocation(false);
    }
  };

  const handleAddFarmingPractice = () => {
    if (farmingPractice.trim() !== "") {
      setFarmerForm({
        ...farmerForm,
        farmingPractices: [
          ...farmerForm.farmingPractices,
          farmingPractice.trim(),
        ],
      });
      setFarmingPractice("");
    }
  };

  const handleRemoveFarmingPractice = (index) => {
    setFarmerForm({
      ...farmerForm,
      farmingPractices: farmerForm.farmingPractices.filter(
        (_, i) => i !== index
      ),
    });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(updateProfile(userForm)).unwrap();
      if (result.success) {
        setUserSaveSuccess(true);
        toast.success("Profile updated successfully!");
        setTimeout(() => setUserSaveSuccess(false), 3000);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleFarmerSubmit = (e) => {
    e.preventDefault();
    dispatch(updateFarmerProfile(farmerForm));
  };

  if (loading || farmerLoading) {
    return <Loader />;
  }

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  const hasValidCoordinates = user?.address?.location?.coordinates && 
    user.address.location.coordinates[0] !== 0 && 
    user.address.location.coordinates[1] !== 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account settings</p>
            </div>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full mt-2"></div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-4 px-6 font-semibold transition-all duration-200 ${
                activeTab === "general"
                  ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50/30"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("general")}
            >
              <FaUser className="inline mr-2 text-sm" />
              General Information
            </button>
            {user?.role === "farmer" && (
              <button
                className={`py-4 px-6 font-semibold transition-all duration-200 ${
                  activeTab === "farm"
                    ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50/30"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("farm")}
              >
                <FaTractor className="inline mr-2 text-sm" />
                Farm Profile
              </button>
            )}
          </div>

          {/* General Information Tab */}
          {activeTab === "general" && (
            <div className="p-6 md:p-8">
              <form onSubmit={handleUserSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400 text-sm" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={userForm.name}
                        onChange={handleUserChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400 text-sm" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={user?.email}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400 text-sm" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={userForm.phone}
                        onChange={handleUserChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                      Account Type
                    </label>
                    <input
                      type="text"
                      id="role"
                      value={user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                      disabled
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-teal-600" />
                      Address
                    </h3>
                    <button
                      type="button"
                      onClick={updateLocationCoordinates}
                      disabled={updatingLocation}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-all duration-200"
                    >
                      <FaLocationArrow className="text-xs" />
                      {updatingLocation ? "Updating..." : hasValidCoordinates ? "Update Coordinates" : "Get Location Coordinates"}
                    </button>
                  </div>
                  
                  {hasValidCoordinates && (
                    <div className="mb-3 p-2 bg-green-50 rounded-lg text-xs text-green-600 flex items-center gap-1">
                      <FaCheck className="text-xs" />
                      Location coordinates are set. You can use "Home Address" for nearby search!
                    </div>
                  )}
                  
                  {!hasValidCoordinates && user?.address?.city && (
                    <div className="mb-3 p-2 bg-yellow-50 rounded-lg text-xs text-yellow-600">
                      Click "Get Location Coordinates" to enable home address search
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-gray-400 text-sm" />
                      </div>
                      <input
                        type="text"
                        name="address.street"
                        value={userForm.address.street}
                        onChange={handleUserChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="Street address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="address.city"
                        value={userForm.address.city}
                        onChange={handleUserChange}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="City"
                      />
                      <input
                        type="text"
                        name="address.state"
                        value={userForm.address.state}
                        onChange={handleUserChange}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="State"
                      />
                    </div>

                    <input
                      type="text"
                      name="address.zipCode"
                      value={userForm.address.zipCode}
                      onChange={handleUserChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="ZIP / Postal code"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                    disabled={loading}
                  >
                    <FaSave className="text-sm" />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  {userSaveSuccess && (
                    <div className="flex items-center text-teal-600">
                      <FaCheck className="mr-2" />
                      <span>Profile updated successfully!</span>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Farm Profile Tab */}
          {activeTab === "farm" && user?.role === "farmer" && (
            <div className="p-6 md:p-8">
              <form onSubmit={handleFarmerSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="farmName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Farm Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaTractor className="text-gray-400 text-sm" />
                      </div>
                      <input
                        type="text"
                        id="farmName"
                        name="farmName"
                        value={farmerForm.farmName}
                        onChange={handleFarmerChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="establishedYear" className="block text-sm font-semibold text-gray-700 mb-2">
                      Established Year
                    </label>
                    <input
                      type="number"
                      id="establishedYear"
                      name="establishedYear"
                      value={farmerForm.establishedYear}
                      onChange={handleFarmerChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      min="1900"
                      max={new Date().getFullYear()}
                      placeholder="e.g., 2010"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Farm Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={farmerForm.description}
                    onChange={handleFarmerChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="Tell customers about your farm..."
                    required
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Farming Practices
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={farmingPractice}
                      onChange={(e) => setFarmingPractice(e.target.value)}
                      className="flex-grow px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="e.g., Organic, No-till, Permaculture"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFarmingPractice())}
                    />
                    <button
                      type="button"
                      onClick={handleAddFarmingPractice}
                      className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <FaPlus className="text-sm" />
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {farmerForm.farmingPractices.map((practice, index) => (
                      <div
                        key={index}
                        className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm"
                      >
                        <FaLeaf className="text-xs" />
                        <span>{practice}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFarmingPractice(index)}
                          className="text-teal-500 hover:text-teal-700"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    Social Media
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="facebook" className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaFacebook className="inline mr-2 text-blue-600" />
                        Facebook
                      </label>
                      <input
                        type="url"
                        id="facebook"
                        name="socialMedia.facebook"
                        value={farmerForm.socialMedia.facebook}
                        onChange={handleFarmerChange}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="https://facebook.com/yourfarm"
                      />
                    </div>
                    <div>
                      <label htmlFor="instagram" className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaInstagram className="inline mr-2 text-pink-600" />
                        Instagram
                      </label>
                      <input
                        type="url"
                        id="instagram"
                        name="socialMedia.instagram"
                        value={farmerForm.socialMedia.instagram}
                        onChange={handleFarmerChange}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="https://instagram.com/yourfarm"
                      />
                    </div>
                    <div>
                      <label htmlFor="twitter" className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaTwitter className="inline mr-2 text-blue-400" />
                        Twitter
                      </label>
                      <input
                        type="url"
                        id="twitter"
                        name="socialMedia.twitter"
                        value={farmerForm.socialMedia.twitter}
                        onChange={handleFarmerChange}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="https://twitter.com/yourfarm"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaClock className="text-teal-600" />
                    Business Hours
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    {days.map((day) => {
                      const hours = farmerForm.businessHours[day.key];
                      return (
                        <div key={day.key} className="grid grid-cols-3 gap-3 items-center">
                          <span className="font-medium text-gray-700 capitalize">{day.label}</span>
                          <input
                            type="time"
                            name={`businessHours.${day.key}.open`}
                            value={hours.open}
                            onChange={handleFarmerChange}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                          <input
                            type="time"
                            name={`businessHours.${day.key}.close`}
                            value={hours.close}
                            onChange={handleFarmerChange}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaTruck className="text-teal-600" />
                    Order Options
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="acceptsPickup"
                        name="acceptsPickup"
                        checked={farmerForm.acceptsPickup}
                        onChange={handleFarmerChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <label htmlFor="acceptsPickup" className="ml-2 block text-sm text-gray-700">
                        <FaStore className="inline mr-2 text-teal-500" />
                        Accepts Pickup Orders
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="acceptsDelivery"
                        name="acceptsDelivery"
                        checked={farmerForm.acceptsDelivery}
                        onChange={handleFarmerChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <label htmlFor="acceptsDelivery" className="ml-2 block text-sm text-gray-700">
                        <FaTruck className="inline mr-2 text-teal-500" />
                        Offers Delivery
                      </label>
                    </div>

                    {farmerForm.acceptsDelivery && (
                      <div className="ml-6">
                        <label htmlFor="deliveryRadius" className="block text-sm font-semibold text-gray-700 mb-2">
                          Delivery Radius (miles)
                        </label>
                        <input
                          type="number"
                          id="deliveryRadius"
                          name="deliveryRadius"
                          value={farmerForm.deliveryRadius}
                          onChange={handleFarmerChange}
                          className="w-32 px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          min="0"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                    disabled={farmerLoading}
                  >
                    <FaSave className="text-sm" />
                    {farmerLoading ? "Saving..." : "Save Farm Profile"}
                  </button>

                  {farmerSuccess && (
                    <div className="flex items-center text-teal-600">
                      <FaCheck className="mr-2" />
                      <span>Farm profile updated successfully!</span>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;