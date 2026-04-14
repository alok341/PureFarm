const mongoose = require("mongoose");

const AIPredictionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    predictionType: {
      type: String,
      enum: ["harvest", "demand", "price", "freshness"],
      required: true,
    },
    predictedDate: Date,
    predictedDemand: {
      score: Number,
      level: String,
      peakDay: String,
    },
    predictedPrice: {
      originalPrice: Number,
      suggestedPrice: Number,
      changePercentage: Number,
    },
    freshnessScore: {
      score: Number,
      label: String,
      daysUntilExpiry: Number,
    },
    confidence: Number,
    isActive: {
      type: Boolean,
      default: true,
    },
    actualOutcome: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AIPrediction", AIPredictionSchema);