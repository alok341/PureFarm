"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getFarmerProducts,
  deleteProduct,
} from "../../redux/slices/productSlice";
import Loader from "../../components/Loader";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaBox,
  FaEye,
  FaLeaf,
  FaTag,
  FaDollarSign,
  FaWeightHanging,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { farmerProducts, loading } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(getFarmerProducts());
  }, [dispatch]);

  useEffect(() => {
    if (farmerProducts) {
      setFilteredProducts(
        farmerProducts.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [farmerProducts, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      setIsDeleting(true);
      await dispatch(deleteProduct(productToDelete._id));
      setIsDeleting(false);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return { text: "Out of Stock", color: "bg-red-100 text-red-700", icon: FaExclamationTriangle };
    } else if (quantity < 5) {
      return { text: "Low Stock", color: "bg-orange-100 text-orange-700", icon: FaExclamationTriangle };
    } else {
      return { text: "In Stock", color: "bg-green-100 text-green-700", icon: FaCheckCircle };
    }
  };

  if (loading && farmerProducts.length === 0) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <FaBox className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Products</h1>
                <p className="text-gray-600 mt-1">Manage your product inventory</p>
              </div>
            </div>
            <div className="w-20 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full mt-2"></div>
          </div>
          <Link
            to="/farmer/products/add"
            className="mt-4 md:mt-0 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
          >
            <FaPlus className="text-sm" />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Stats Summary */}
        {farmerProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{farmerProducts.length}</p>
                </div>
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <FaBox className="text-teal-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Products</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {farmerProducts.filter(p => p.isActive).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <FaCheckCircle className="text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Low Stock Items</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {farmerProducts.filter(p => p.quantityAvailable > 0 && p.quantityAvailable < 5).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FaExclamationTriangle className="text-orange-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">
                    {farmerProducts.filter(p => p.quantityAvailable === 0).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaExclamationTriangle className="text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search products by name..."
              className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Products Table */}
        {filteredProducts.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.quantityAvailable);
                    const StockIcon = stockStatus.icon;
                    return (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0] || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FaLeaf className="text-teal-500" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {product.name}
                              </div>
                              {product.isOrganic && (
                                <div className="flex items-center gap-1 mt-1">
                                  <FaLeaf className="text-teal-500 text-xs" />
                                  <span className="text-xs text-teal-600">Organic</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1">
                            <FaDollarSign className="text-gray-400 text-xs" />
                            <span className="font-semibold text-gray-900">
                              {product.price.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              /{product.unit}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <FaWeightHanging className="text-gray-400 text-xs" />
                            <span className={`font-medium ${stockStatus.color.split(' ')[0] === 'bg-red-100' ? 'text-red-600' : stockStatus.color.split(' ')[0] === 'bg-orange-100' ? 'text-orange-600' : 'text-gray-900'}`}>
                              {product.quantityAvailable} {product.unit}
                            </span>
                          </div>
                          <div className="mt-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                              <StockIcon className="text-xs" />
                              {stockStatus.text}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1">
                            <FaTag className="text-gray-400 text-xs" />
                            <span className="text-sm text-gray-700">
                              {product.category?.name || "General"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              product.isActive
                                ? "bg-teal-100 text-teal-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {product.isActive ? (
                              <FaCheckCircle className="text-xs" />
                            ) : (
                              <FaExclamationTriangle className="text-xs" />
                            )}
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-3">
                            <Link
                              to={`/products/${product._id}`}
                              className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                              title="View Product"
                            >
                              <FaEye className="text-lg" />
                            </Link>
                            <Link
                              to={`/farmer/products/edit/${product._id}`}
                              className="text-teal-600 hover:text-teal-700 transition-colors p-1"
                              title="Edit Product"
                            >
                              <FaEdit className="text-lg" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                              title="Delete Product"
                            >
                              <FaTrash className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg text-center py-16 px-4">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBox className="text-teal-600 text-4xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {searchTerm ? "No Products Found" : "No Products Yet"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchTerm
                ? "No products match your search criteria. Try adjusting your search term."
                : "You haven't added any products yet. Start by adding your first product to showcase to customers."}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Clear Search
              </button>
            ) : (
              <Link
                to="/farmer/products/add"
                className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                <FaPlus className="mr-2 text-sm" />
                Add Your First Product
              </Link>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && productToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Confirm Delete</h3>
                <p className="text-red-100 text-sm mt-1">This action cannot be undone</p>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4 p-3 bg-red-50 rounded-xl">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <FaTrash className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Product to delete</p>
                    <p className="font-semibold text-gray-900">{productToDelete.name}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete <span className="font-semibold">{productToDelete.name}</span>? 
                  This action cannot be undone and will remove this product from your store.
                </p>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                      isDeleting
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    {isDeleting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      "Delete Product"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;