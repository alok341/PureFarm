import { FaLeaf } from "react-icons/fa";

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center z-50">
      <div className="text-center">
        {/* Animated Spinner */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-teal-200 rounded-full animate-ping opacity-75 absolute"></div>
          <div className="w-20 h-20 border-4 border-t-teal-600 border-r-emerald-600 border-b-teal-600 border-l-emerald-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaLeaf className="text-teal-600 text-2xl animate-pulse" />
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="mt-6 space-y-2">
          <p className="text-gray-700 font-semibold text-lg">Loading</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
          <p className="text-gray-400 text-sm mt-2">Please wait while we load your content...</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;