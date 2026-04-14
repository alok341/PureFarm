import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import { FaLeaf } from "react-icons/fa";

const PrivateRoute = () => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />;
  }

  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  }

  if (!isAuthenticated) {
    // Optional: Show a nice message before redirecting
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="text-center max-w-md animate-fadeIn">
          <div className="w-24 h-24 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaLeaf className="text-white text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access this page. You will be redirected to the login page.
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 mx-auto rounded-full"></div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default PrivateRoute;