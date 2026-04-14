const express = require("express");
const {
  predictHarvestDate,
  predictDemand,
  calculateFreshness,
  suggestPrice,
  getFarmerInsights,
} = require("../controllers/aiController");
const { verifyToken, isFarmer } = require("../utils/authMiddleware");

const router = express.Router();

// Public routes
router.get("/freshness/:productId", calculateFreshness);

// Farmer routes
router.post("/predict-harvest", verifyToken, isFarmer, predictHarvestDate);
router.get("/predict-demand/:productId", verifyToken, isFarmer, predictDemand);
router.post("/suggest-price", verifyToken, isFarmer, suggestPrice);
router.get("/farmer-insights", verifyToken, isFarmer, getFarmerInsights);

module.exports = router;