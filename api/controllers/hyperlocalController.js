const User = require("../models/UserModel");
const Product = require("../models/ProductModel");

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// @desc    Get nearby farmers based on consumer's address
// @route   GET /api/hyperlocal/nearby-farmers
// @access  Private (Consumer only)
exports.getNearbyFarmers = async (req, res) => {
  try {
    const { radius = 50 } = req.query;
    const consumerId = req.user._id;

    const consumer = await User.findById(consumerId);
    
    // Check if consumer has location coordinates
    const hasValidLocation = consumer?.address?.location?.coordinates && 
      consumer.address.location.coordinates[0] !== 0 && 
      consumer.address.location.coordinates[1] !== 0;
    
    if (!hasValidLocation) {
      return res.status(400).json({
        success: false,
        message: "Please update your address with location coordinates in your profile. Go to Profile and click 'Get Location Coordinates'."
      });
    }

    const [consumerLon, consumerLat] = consumer.address.location.coordinates;

    const farmers = await User.find({ 
      role: "farmer",
      "address.location.coordinates": { $ne: [0, 0] }
    }).select("-password");

    const nearbyFarmers = farmers
      .map(farmer => {
        const [farmerLon, farmerLat] = farmer.address.location.coordinates;
        const distance = calculateDistance(consumerLat, consumerLon, farmerLat, farmerLon);
        return {
          ...farmer.toObject(),
          distance: Math.round(distance * 10) / 10,
          distanceUnit: "km"
        };
      })
      .filter(farmer => farmer.distance <= parseInt(radius))
      .sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      count: nearbyFarmers.length,
      data: nearbyFarmers,
      userLocation: {
        lat: consumerLat,
        lng: consumerLon,
        address: `${consumer.address.city || ''}, ${consumer.address.state || ''}`
      },
      radius: parseInt(radius)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get nearby products based on consumer's address
// @route   GET /api/hyperlocal/nearby-products
// @access  Private (Consumer only)
exports.getNearbyProducts = async (req, res) => {
  try {
    const { radius = 50, category } = req.query;
    const consumerId = req.user._id;

    const consumer = await User.findById(consumerId);
    
    const hasValidLocation = consumer?.address?.location?.coordinates && 
      consumer.address.location.coordinates[0] !== 0 && 
      consumer.address.location.coordinates[1] !== 0;
    
    if (!hasValidLocation) {
      return res.status(400).json({
        success: false,
        message: "Please update your address with location coordinates in your profile"
      });
    }

    const [consumerLon, consumerLat] = consumer.address.location.coordinates;

    let query = { isActive: true };
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate("farmer", "name email address phone")
      .populate("category", "name");

    const nearbyProducts = [];
    
    for (const product of products) {
      const farmer = product.farmer;
      if (farmer && farmer.address && farmer.address.location && 
          farmer.address.location.coordinates &&
          farmer.address.location.coordinates[0] !== 0) {
        
        const [farmerLon, farmerLat] = farmer.address.location.coordinates;
        const distance = calculateDistance(consumerLat, consumerLon, farmerLat, farmerLon);
        
        if (distance <= parseInt(radius)) {
          nearbyProducts.push({
            ...product.toObject(),
            distance: Math.round(distance * 10) / 10,
            distanceUnit: "km",
            farmerName: farmer.name,
            farmerAddress: `${farmer.address.city || ''}, ${farmer.address.state || ''}`
          });
        }
      }
    }

    nearbyProducts.sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      count: nearbyProducts.length,
      data: nearbyProducts,
      userLocation: {
        lat: consumerLat,
        lng: consumerLon,
        address: `${consumer.address.city || ''}, ${consumer.address.state || ''}`
      },
      radius: parseInt(radius)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update user's location coordinates from GPS
// @route   PUT /api/hyperlocal/update-location
// @access  Private
exports.updateUserLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required"
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    // Initialize address if it doesn't exist
    if (!user.address) {
      user.address = {};
    }
    
    // Save the coordinates
    user.address.location = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    };
    
    // Also update the city/state with approximate location (optional)
    // This helps with display
    if (!user.address.city) {
      user.address.city = "GPS Location";
    }
    if (!user.address.state) {
      user.address.state = "Current";
    }
    
    await user.save();

    res.json({
      success: true,
      message: "Location updated successfully! You can now search for nearby farmers.",
      data: {
        lat: latitude,
        lng: longitude,
        hasValidLocation: true
      }
    });
  } catch (error) {
    console.error("Update location error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get distance to a specific farmer
// @route   GET /api/hyperlocal/distance-to-farmer/:farmerId
// @access  Private
exports.getDistanceToFarmer = async (req, res) => {
  try {
    const consumerId = req.user._id;
    const { farmerId } = req.params;

    const consumer = await User.findById(consumerId);
    const farmer = await User.findById(farmerId);

    if (!consumer || !farmer) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!consumer.address?.location?.coordinates || consumer.address.location.coordinates[0] === 0) {
      return res.status(400).json({
        success: false,
        message: "Please update your address with location coordinates"
      });
    }

    if (!farmer.address?.location?.coordinates || farmer.address.location.coordinates[0] === 0) {
      return res.status(400).json({
        success: false,
        message: "Farmer hasn't set their location yet"
      });
    }

    const [consumerLon, consumerLat] = consumer.address.location.coordinates;
    const [farmerLon, farmerLat] = farmer.address.location.coordinates;
    const distance = calculateDistance(consumerLat, consumerLon, farmerLat, farmerLon);

    res.json({
      success: true,
      data: {
        distance: Math.round(distance * 10) / 10,
        unit: "km",
        consumerLocation: {
          lat: consumerLat,
          lng: consumerLon,
          address: `${consumer.address.city || ''}, ${consumer.address.state || ''}`
        },
        farmerLocation: {
          lat: farmerLat,
          lng: farmerLon,
          address: `${farmer.address.city || ''}, ${farmer.address.state || ''}`
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};