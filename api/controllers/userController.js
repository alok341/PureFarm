const User = require("../models/UserModel");
const FarmerProfile = require("../models/FarmerProfileModel");
const { geocodeAddress } = require("../services/geocodingService");

// @desc    Get all farmers
// @route   GET /api/users/farmers
// @access  Public
exports.getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: "farmer" }).select("-password");

    res.json({
      success: true,
      count: farmers.length,
      data: farmers,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get farmer profile
// @route   GET /api/users/farmers/:id
// @access  Public
exports.getFarmerProfile = async (req, res) => {
  try {
    const farmer = await User.findOne({
      _id: req.params.id,
      role: "farmer",
    }).select("-password");

    if (!farmer) {
      return res
        .status(404)
        .json({ success: false, message: "Farmer not found" });
    }

    const farmerProfile = await FarmerProfile.findOne({ user: req.params.id });

    res.json({
      success: true,
      data: {
        farmer,
        profile: farmerProfile || {},
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Create or update farmer profile
// @route   PUT /api/users/farmers/profile
// @access  Private (Farmer only)
exports.updateFarmerProfile = async (req, res) => {
  try {
    const {
      farmName,
      description,
      farmImages,
      farmingPractices,
      establishedYear,
      socialMedia,
      businessHours,
      acceptsPickup,
      acceptsDelivery,
      deliveryRadius,
    } = req.body;

    const profileFields = {
      user: req.user._id,
      farmName,
      description,
      farmImages,
      farmingPractices,
      establishedYear,
      socialMedia,
      businessHours,
      acceptsPickup,
      acceptsDelivery,
      deliveryRadius,
    };

    let farmerProfile = await FarmerProfile.findOne({ user: req.user._id });

    if (farmerProfile) {
      farmerProfile = await FarmerProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
    } else {
      farmerProfile = await FarmerProfile.create(profileFields);
    }

    res.json({
      success: true,
      data: farmerProfile,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update user profile (with geocoding)
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update basic info
    if (name) user.name = name;
    if (phone) user.phone = phone;
    
    // Handle address update with geocoding
    if (address) {
      // Geocode the address to get coordinates
      const coordinates = await geocodeAddress(address);
      
      user.address = {
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zipCode: address.zipCode || "",
        location: {
          type: "Point",
          coordinates: [coordinates.lng, coordinates.lat]
        }
      };
      
      console.log(`📍 Geocoded address for ${user.name}:`, coordinates);
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully! Location coordinates updated.",
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User removed",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Re-geocode address for existing user
// @route   POST /api/users/geocode-address
// @access  Private
exports.regeocodeAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    if (!address || (!address.city && !address.state)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide city and state for geocoding" 
      });
    }
    
    const coordinates = await geocodeAddress(address);
    
    // Initialize address if it doesn't exist
    if (!user.address) {
      user.address = {};
    }
    
    user.address.street = address.street || user.address?.street || "";
    user.address.city = address.city || user.address?.city || "";
    user.address.state = address.state || user.address?.state || "";
    user.address.zipCode = address.zipCode || user.address?.zipCode || "";
    user.address.location = {
      type: "Point",
      coordinates: [coordinates.lng, coordinates.lat]
    };
    
    await user.save();
    
    res.json({
      success: true,
      message: `Location coordinates updated successfully for ${user.address.city}, ${user.address.state}!`,
      coordinates: { lat: coordinates.lat, lng: coordinates.lng }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};