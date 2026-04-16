"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getFreshness, 
  getDemandPrediction, 
  getPriceSuggestion,
  clearAIState 
} from "../redux/slices/aiSlice";
import { FaBrain, FaChartLine, FaTags, FaLeaf, FaSpinner } from "react-icons/fa";

const AIInsightsCard = ({ product, type = "farmer" }) => {
  const dispatch = useDispatch();
  const { freshness, demand, price, loading, error } = useSelector((state) => state.ai);

  useEffect(() => {
    if (product) {
      dispatch(getFreshness(product._id));
      
      if (type === "farmer") {
        dispatch(getDemandPrediction(product._id));
      }
    }
    
    return () => {
      dispatch(clearAIState());
    };
  }, [dispatch, product, type]);

  useEffect(() => {
    if (type === "farmer" && demand) {
      dispatch(getPriceSuggestion({ productId: product._id, demandScore: demand.demandScore }));
    }
  }, [dispatch, demand, product, type]);

  if (loading && !freshness) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center">
        <FaSpinner className="animate-spin text-teal-600 text-2xl" />
        <span className="ml-2 text-gray-600">Loading insights...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!freshness) return null;

  const getFreshnessColorClass = (color) => {
    switch(color) {
      case 'emerald': return 'text-emerald-600 bg-emerald-500';
      case 'teal': return 'text-teal-600 bg-teal-500';
      case 'yellow': return 'text-yellow-600 bg-yellow-500';
      case 'orange': return 'text-orange-600 bg-orange-500';
      default: return 'text-teal-600 bg-teal-500';
    }
  };

  const freshnessColorClass = getFreshnessColorClass(freshness.color);

  return (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center">
          <FaBrain className="text-white text-lg" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">PureFarm Insights</h3>
        <span className="text-xs bg-white/80 px-2 py-1 rounded-full text-teal-600">Powerful Insights</span>
      </div>

      <div className="space-y-4">
        {/* Freshness Score */}
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FaLeaf className={freshnessColorClass.split(' ')[0]} />
              <span className="font-semibold text-gray-700">Freshness Score</span>
            </div>
            <span className={`text-2xl font-bold ${freshnessColorClass.split(' ')[0]}`}>
              {freshness.score}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${freshnessColorClass.split(' ')[1]} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${freshness.score}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{freshness.label}</p>
          <p className="text-xs text-gray-500 mt-1">{freshness.recommendation}</p>
        </div>

        {/* Farmer-only insights */}
        {type === "farmer" && demand && price && (
          <>
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaChartLine className="text-teal-500" />
                <span className="font-semibold text-gray-700">Demand Prediction</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Demand Score</span>
                <span className="text-xl font-bold text-teal-600">{demand.demandScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-teal-500 h-2 rounded-full"
                  style={{ width: `${demand.demandScore}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Peak Day:</span>
                <span className="font-medium text-gray-800">{demand.peakDay}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{demand.recommendation}</p>
            </div>

            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaTags className="text-teal-500" />
                <span className="font-semibold text-gray-700">Price Optimization</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Current Price</span>
                <span className="text-lg font-bold text-gray-900">₨{price.originalPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Suggested Price</span>
                <span className={`text-lg font-bold ${price.change > 0 ? 'text-emerald-600' : price.change < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  ₨{price.suggestedPrice}
                  {price.change !== 0 && (
                    <span className="text-sm ml-1">
                      ({price.change > 0 ? '+' : ''}{price.change}%)
                    </span>
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{price.recommendation}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIInsightsCard;