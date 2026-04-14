const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const AIPrediction = require("../models/AIPredictionModel");

// Helper functions
const getSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "monsoon";
  return "winter";
};

const getPeakDay = (season) => {
  const days = {
    summer: "Saturday",
    winter: "Sunday",
    monsoon: "Wednesday",
    spring: "Friday",
  };
  return days[season] || "Weekend";
};

// Seasonal demand patterns
const seasonalDemand = {
  summer: ["tomato", "cucumber", "lettuce", "pepper", "watermelon"],
  winter: ["carrot", "potato", "onion", "spinach", "cauliflower"],
  monsoon: ["spinach", "lettuce", "cucumber", "radish"],
  spring: ["tomato", "pepper", "lettuce", "strawberry"],
};

// @desc    Predict harvest date for a product
// @route   POST /api/ai/predict-harvest
// @access  Private (Farmer only)
exports.predictHarvestDate = async (req, res) => {
  try {
    const { productId, plantingDate } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Growth duration in days for different crops (simplified)
    const growthDuration = {
      tomato: 65,
      lettuce: 45,
      carrot: 70,
      potato: 90,
      onion: 100,
      spinach: 40,
      cucumber: 55,
      pepper: 70,
      default: 60,
    };

    const cropName = product.name.toLowerCase();
    let daysToGrow = growthDuration.default;

    for (const [crop, days] of Object.entries(growthDuration)) {
      if (cropName.includes(crop)) {
        daysToGrow = days;
        break;
      }
    }

    const planting = new Date(plantingDate);
    const predictedHarvest = new Date(planting);
    predictedHarvest.setDate(planting.getDate() + daysToGrow);

    // Adjust based on season
    const season = getSeason();
    if (season === "winter") {
      predictedHarvest.setDate(predictedHarvest.getDate() + 7);
    } else if (season === "summer") {
      predictedHarvest.setDate(predictedHarvest.getDate() - 5);
    }

    const confidence = Math.floor(Math.random() * 20 + 75);
    const daysRemaining = Math.ceil((predictedHarvest - new Date()) / (1000 * 60 * 60 * 24));

    // Save prediction
    await AIPrediction.create({
      product: productId,
      farmer: req.user._id,
      predictionType: "harvest",
      predictedDate: predictedHarvest,
      confidence,
    });

    res.json({
      success: true,
      data: {
        predictedHarvest,
        confidence,
        daysRemaining,
        recommendation: daysRemaining < 7 
          ? "Harvest soon! Product reaching peak freshness."
          : daysRemaining < 14
          ? "Monitor closely. Optimal harvest window approaching."
          : "Product growing well. Continue regular monitoring.",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Predict demand for a product
// @route   GET /api/ai/predict-demand/:productId
// @access  Private (Farmer only)
exports.predictDemand = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const season = getSeason();
    const cropName = product.name.toLowerCase();
    const isInSeason = seasonalDemand[season]?.some(crop => cropName.includes(crop));

    // Analyze historical orders for this product
    const historicalOrders = await Order.find({
      "items.product": product._id,
      status: "completed",
    });

    const orderCount = historicalOrders.length;
    const averageQuantity = historicalOrders.reduce((sum, order) => {
      const item = order.items.find(i => i.product.toString() === product._id.toString());
      return sum + (item?.quantity || 0);
    }, 0) / (orderCount || 1);

    // Calculate demand score
    let baseDemand = isInSeason ? 85 : 45;
    baseDemand += Math.min(30, orderCount * 2);
    baseDemand += Math.min(20, averageQuantity * 5);
    const predictedDemand = Math.min(100, Math.max(0, baseDemand + (Math.random() * 20 - 10)));

    const result = {
      demandScore: Math.round(predictedDemand),
      demandLevel: predictedDemand > 70 ? "High" : predictedDemand > 40 ? "Medium" : "Low",
      peakDay: getPeakDay(season),
      historicalOrders: orderCount,
      averageOrderQuantity: Math.round(averageQuantity),
      recommendation: predictedDemand > 70 
        ? "Increase stock - high demand expected this week!"
        : predictedDemand > 40 
        ? "Maintain current stock levels. Steady demand."
        : "Consider promotional pricing to boost demand.",
    };

    // Save prediction
    await AIPrediction.create({
      product: product._id,
      farmer: req.user._id,
      predictionType: "demand",
      predictedDemand: {
        score: result.demandScore,
        level: result.demandLevel,
        peakDay: result.peakDay,
      },
      confidence: Math.floor(Math.random() * 20 + 70),
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Calculate freshness score for a product
// @route   GET /api/ai/freshness/:productId
// @access  Public
exports.calculateFreshness = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let freshnessScore = 85;
    let daysSinceHarvest = null;

    if (product.harvestDate) {
      const harvest = new Date(product.harvestDate);
      const now = new Date();
      daysSinceHarvest = Math.floor((now - harvest) / (1000 * 60 * 60 * 24));

      if (daysSinceHarvest <= 1) freshnessScore = 98;
      else if (daysSinceHarvest <= 3) freshnessScore = 90;
      else if (daysSinceHarvest <= 5) freshnessScore = 80;
      else if (daysSinceHarvest <= 7) freshnessScore = 65;
      else if (daysSinceHarvest <= 10) freshnessScore = 45;
      else freshnessScore = 25;
    }

    const freshnessLabel = freshnessScore > 85 ? "Freshly Harvested" :
                           freshnessScore > 70 ? "Very Fresh" :
                           freshnessScore > 50 ? "Fresh" :
                           freshnessScore > 30 ? "Good" : "Use Soon";

    const result = {
      score: freshnessScore,
      label: freshnessLabel,
      daysSinceHarvest,
      color: freshnessScore > 85 ? "emerald" :
             freshnessScore > 70 ? "teal" :
             freshnessScore > 50 ? "yellow" : "orange",
      recommendation: freshnessScore > 70 
        ? "Best quality! Perfect for immediate consumption."
        : freshnessScore > 50
        ? "Still fresh. Best consumed within 2-3 days."
        : "Consume soon for best taste and nutrition.",
    };

    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Suggest optimal price for a product
// @route   POST /api/ai/suggest-price
// @access  Private (Farmer only)
exports.suggestPrice = async (req, res) => {
  try {
    const { productId, demandScore } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Get competitor prices (simplified - in production, would query similar products)
    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: productId },
      isActive: true,
    }).limit(5);

    const avgCompetitorPrice = similarProducts.reduce((sum, p) => sum + p.price, 0) / (similarProducts.length || 1);

    let multiplier = 1;
    if (demandScore > 80) multiplier = 1.15;
    else if (demandScore > 60) multiplier = 1.05;
    else if (demandScore > 40) multiplier = 0.95;
    else multiplier = 0.85;

    let suggestedPrice = product.price * multiplier;

    // Adjust based on competitor pricing
    if (avgCompetitorPrice && avgCompetitorPrice < suggestedPrice) {
      suggestedPrice = (suggestedPrice + avgCompetitorPrice) / 2;
    }

    const change = ((suggestedPrice - product.price) / product.price) * 100;

    const result = {
      originalPrice: product.price,
      suggestedPrice: Math.round(suggestedPrice * 100) / 100,
      change: Math.round(change),
      competitorAveragePrice: avgCompetitorPrice ? Math.round(avgCompetitorPrice * 100) / 100 : null,
      recommendation: change > 5 
        ? "📈 High demand! You can increase price slightly."
        : change < -5
        ? "📉 Consider discount to boost sales."
        : "💰 Current pricing is optimal. Maintain price.",
    };

    // Save prediction
    await AIPrediction.create({
      product: productId,
      farmer: req.user._id,
      predictionType: "price",
      predictedPrice: {
        originalPrice: product.price,
        suggestedPrice: result.suggestedPrice,
        changePercentage: result.change,
      },
      confidence: Math.floor(Math.random() * 20 + 70),
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get farmer dashboard insights
// @route   GET /api/ai/farmer-insights
// @access  Private (Farmer only)
exports.getFarmerInsights = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id });
    
    const insights = await Promise.all(products.map(async (product) => {
      const demandPrediction = await this.predictDemandInternal(product._id);
      const freshness = await this.calculateFreshnessInternal(product._id);
      
      return {
        productId: product._id,
        productName: product.name,
        demandScore: demandPrediction?.demandScore || 50,
        demandLevel: demandPrediction?.demandLevel || "Medium",
        freshnessScore: freshness?.score || 85,
        freshnessLabel: freshness?.label || "Fresh",
        price: product.price,
        stock: product.quantityAvailable,
        actionNeeded: product.quantityAvailable < 10 ? "Low Stock Alert" :
                      demandPrediction?.demandScore > 80 ? "Increase Stock" :
                      freshness?.score < 50 ? "Clearance Recommended" : "All Good",
      };
    }));

    // Calculate overall farm health score
    const avgDemand = insights.reduce((sum, i) => sum + i.demandScore, 0) / (insights.length || 1);
    const avgFreshness = insights.reduce((sum, i) => sum + i.freshnessScore, 0) / (insights.length || 1);
    const lowStockCount = insights.filter(i => i.stock < 10).length;

    res.json({
      success: true,
      data: {
        insights,
        farmHealth: {
          score: Math.round((avgDemand + avgFreshness) / 2),
          level: (avgDemand + avgFreshness) / 2 > 70 ? "Excellent" : 
                 (avgDemand + avgFreshness) / 2 > 50 ? "Good" : "Needs Attention",
          lowStockCount,
          totalProducts: products.length,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Internal helper functions
exports.predictDemandInternal = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) return null;

  const season = getSeason();
  const cropName = product.name.toLowerCase();
  const isInSeason = seasonalDemand[season]?.some(crop => cropName.includes(crop));

  const historicalOrders = await Order.find({
    "items.product": productId,
    status: "completed",
  });

  let baseDemand = isInSeason ? 85 : 45;
  baseDemand += Math.min(30, historicalOrders.length * 2);
  const predictedDemand = Math.min(100, Math.max(0, baseDemand + (Math.random() * 20 - 10)));

  return {
    demandScore: Math.round(predictedDemand),
    demandLevel: predictedDemand > 70 ? "High" : predictedDemand > 40 ? "Medium" : "Low",
    peakDay: getPeakDay(season),
  };
};

exports.calculateFreshnessInternal = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) return null;

  let freshnessScore = 85;
  if (product.harvestDate) {
    const harvest = new Date(product.harvestDate);
    const now = new Date();
    const daysSinceHarvest = Math.floor((now - harvest) / (1000 * 60 * 60 * 24));

    if (daysSinceHarvest <= 1) freshnessScore = 98;
    else if (daysSinceHarvest <= 3) freshnessScore = 90;
    else if (daysSinceHarvest <= 5) freshnessScore = 80;
    else if (daysSinceHarvest <= 7) freshnessScore = 65;
    else if (daysSinceHarvest <= 10) freshnessScore = 45;
    else freshnessScore = 25;
  }

  return {
    score: freshnessScore,
    label: freshnessScore > 85 ? "Freshly Harvested" :
           freshnessScore > 70 ? "Very Fresh" :
           freshnessScore > 50 ? "Fresh" :
           freshnessScore > 30 ? "Good" : "Use Soon",
  };
};