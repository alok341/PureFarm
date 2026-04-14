const express = require("express");
const {
  getNearbyFarmers,
  getNearbyProducts,
  updateUserLocation,
  getDistanceToFarmer
} = require("../controllers/hyperlocalController");
const { verifyToken, isConsumer } = require("../utils/authMiddleware");

const router = express.Router();

// All routes require authentication and consumer role
router.use(verifyToken, isConsumer);

router.get("/nearby-farmers", getNearbyFarmers);
router.get("/nearby-products", getNearbyProducts);
router.put("/update-location", updateUserLocation);
router.get("/distance-to-farmer/:farmerId", getDistanceToFarmer);

module.exports = router;