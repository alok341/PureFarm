import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaTractor, FaLocationArrow } from "react-icons/fa";

const FarmerCard = ({ farmer, showDistance = false }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <FaTractor className="text-white text-2xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
              {farmer.name}
            </h3>
            {farmer.address && (
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <FaMapMarkerAlt className="mr-1 text-teal-500 text-xs" />
                <span>
                  {farmer.address.city}, {farmer.address.state}
                </span>
              </div>
            )}
            {showDistance && farmer.distance && (
              <div className="flex items-center text-teal-600 text-xs mt-1">
                <FaLocationArrow className="mr-1 text-xs" />
                <span>{farmer.distance} {farmer.distanceUnit} away</span>
              </div>
            )}
          </div>
        </div>

        <Link
          to={`/farmers/${farmer._id}`}
          className="block w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-center py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          View Farm
        </Link>
      </div>
    </div>
  );
};

export default FarmerCard;