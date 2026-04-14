import { Link } from "react-router-dom";
import { placeholder } from "../assets";
import { FaLeaf, FaTag, FaEye, FaLocationArrow } from "react-icons/fa";

const ProductCard = ({ product, showDistance = false, distance = null }) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50">
            <FaLeaf className="text-teal-300 text-4xl" />
          </div>
        )}
        
        {/* Organic Badge */}
        {product.isOrganic && (
          <span className="absolute top-3 right-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
            <FaLeaf className="text-xs" />
            Organic
          </span>
        )}
        
        {/* Price Tag */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-md">
          <span className="text-teal-600 font-bold text-sm">
            ₨{product.price.toFixed(2)}
          </span>
          <span className="text-gray-500 text-xs ml-1">/{product.unit}</span>
        </div>

        {/* Distance Badge */}
        {showDistance && (distance || product.distance) && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
            <div className="flex items-center gap-1 text-white text-xs">
              <FaLocationArrow className="text-xs" />
              <span>{distance || product.distance} km away</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-teal-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FaTag className="text-gray-400 text-xs" />
            <span>{product.category?.name || "General"}</span>
          </div>
        </div>
        
        {/* Farmer Name (for nearby products) */}
        {showDistance && product.farmerName && (
          <div className="text-xs text-gray-500 mb-2">
            From: {product.farmerName}
          </div>
        )}
        
        {/* Action Button */}
        <Link
          to={`/products/${product._id}`}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 group"
        >
          <FaEye className="text-sm group-hover:translate-x-0.5 transition-transform" />
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;