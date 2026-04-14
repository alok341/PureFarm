"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import {
  FaLeaf,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaStore,
  FaTractor,
  FaInfoCircle,
  FaChevronDown,
} from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home", icon: FaHome },
    { to: "/products", label: "Products", icon: FaStore },
    { to: "/farmers", label: "Farmers", icon: FaTractor },
    { to: "/about", label: "About", icon: FaInfoCircle },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="PureFarm Logo"
                className="w-10 h-10 object-contain rounded-full shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              PureFarm
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-1 text-gray-600 hover:text-teal-600 transition-all duration-200 font-medium hover:scale-105"
              >
                <link.icon className="text-sm" />
                <span>{link.label}</span>
              </Link>
            ))}

            {/* Cart Icon for Consumers */}
            {isAuthenticated && user?.role === "consumer" && (
              <Link to="/checkout" className="relative group">
                <div className="p-2 rounded-full hover:bg-teal-50 transition-all duration-200">
                  <FaShoppingCart className="text-gray-600 group-hover:text-teal-600 text-xl transition-colors" />
                </div>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}

            {/* User Section */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-teal-50 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-teal-600">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <FaChevronDown className={`text-gray-400 text-xs transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 z-10 border border-gray-100 animate-fade-in-up">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    {/* Admin Dashboard & Messages */}
                    {user?.role === "admin" && (
                      <>
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FaUser className="text-sm" />
                          <span>Admin Dashboard</span>
                        </Link>
                        <Link
                          to="/admin/messages"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>Messages</span>
                        </Link>
                      </>
                    )}

                    {/* Farmer Dashboard */}
                    {user?.role === "farmer" && (
                      <Link
                        to="/farmer/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FaTractor className="text-sm" />
                        <span>Farmer Dashboard</span>
                      </Link>
                    )}

                    {/* Consumer Links */}
                    {user?.role !== "admin" && (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FaUser className="text-sm" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/orders"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FaShoppingCart className="text-sm" />
                          <span>My Orders</span>
                        </Link>

                        <Link
                          to="/messages"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>Messages</span>
                        </Link>
                      </>
                    )}

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <FaSignOutAlt className="text-sm" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-xl text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-all duration-200"
            >
              {isMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 animate-slide-down">
            <div className="flex flex-col space-y-3 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors py-2"
                  onClick={toggleMenu}
                >
                  <link.icon className="text-sm" />
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Cart for Mobile */}
              {isAuthenticated && user?.role === "consumer" && (
                <Link
                  to="/checkout"
                  className="flex items-center justify-between text-gray-600 hover:text-teal-600 transition-colors py-2"
                  onClick={toggleMenu}
                >
                  <div className="flex items-center space-x-2">
                    <FaShoppingCart />
                    <span>Cart</span>
                  </div>
                  {cartItems.length > 0 && (
                    <span className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  {user?.role === "admin" && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors py-2"
                        onClick={toggleMenu}
                      >
                        <FaUser className="text-sm" />
                        <span>Admin Dashboard</span>
                      </Link>
                      <Link
                        to="/admin/messages"
                        className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors py-2"
                        onClick={toggleMenu}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Messages</span>
                      </Link>
                    </>
                  )}

                  {user?.role === "farmer" && (
                    <Link
                      to="/farmer/dashboard"
                      className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors py-2"
                      onClick={toggleMenu}
                    >
                      <FaTractor className="text-sm" />
                      <span>Farmer Dashboard</span>
                    </Link>
                  )}

                  {user?.role !== "admin" && (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors py-2"
                        onClick={toggleMenu}
                      >
                        <FaUser className="text-sm" />
                        <span>Profile</span>
                      </Link>

                      <Link
                        to="/orders"
                        className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors py-2"
                        onClick={toggleMenu}
                      >
                        <FaShoppingCart className="text-sm" />
                        <span>Orders</span>
                      </Link>

                      <Link
                        to="/messages"
                        className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors py-2"
                        onClick={toggleMenu}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Messages</span>
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:bg-red-50 transition-colors py-2 px-3 rounded-lg"
                  >
                    <FaSignOutAlt className="text-sm" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-2">
                  <Link
                    to="/login"
                    className="text-center px-4 py-2 text-teal-600 font-semibold border border-teal-600 rounded-xl hover:bg-teal-50 transition-colors"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-center px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;