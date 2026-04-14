"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  resetProductSuccess,
} from "../../redux/slices/productSlice";
import { getCategories } from "../../redux/slices/categorySlice";
import Loader from "../../components/Loader";
import { 
  FaArrowLeft, 
  FaUpload, 
  FaTimes, 
  FaLeaf, 
  FaTag, 
  FaBoxes, 
  FaCalendarAlt,
  FaDollarSign,
  FaWeightHanging,
  FaCheckCircle
} from "react-icons/fa";

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success } = useSelector((state) => state.products);
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    unit: "lb",
    quantityAvailable: "",
    images: [],
    isOrganic: false,
    harvestDate: "",
    availableUntil: "",
    isActive: true,
  });

  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(resetProductSuccess());
      navigate("/farmer/products");
    }
  }, [success, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    
    const newImagePreviewUrls = files.map((file) => URL.createObjectURL(file));

    setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviewUrls]);
    setFormData({
      ...formData,
      images: [...formData.images, ...newImagePreviewUrls],
    });
  };

  const removeImage = (index) => {
    const newImagePreviewUrls = [...imagePreviewUrls];
    const newImages = [...formData.images];

    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(newImagePreviewUrls[index]);
    
    newImagePreviewUrls.splice(index, 1);
    newImages.splice(index, 1);

    setImagePreviewUrls(newImagePreviewUrls);
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.unit.trim()) newErrors.unit = "Unit is required";
    if (!formData.quantityAvailable || formData.quantityAvailable < 0)
      newErrors.quantityAvailable = "Valid quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(createProduct(formData));
    }
  };

  if (loading || categoriesLoading) {
    return <Loader />;
  }

  const units = [
    { value: "lb", label: "Pound (lb)" },
    { value: "kg", label: "Kilogram (kg)" },
    { value: "oz", label: "Ounce (oz)" },
    { value: "g", label: "Gram (g)" },
    { value: "each", label: "Each" },
    { value: "bunch", label: "Bunch" },
    { value: "dozen", label: "Dozen" },
    { value: "pint", label: "Pint" },
    { value: "quart", label: "Quart" },
    { value: "gallon", label: "Gallon" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/farmer/products"
          className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6 transition-colors duration-200 group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <FaLeaf className="text-2xl" />
              Add New Product
            </h1>
            <p className="text-teal-100 text-sm mt-1">List your fresh produce for customers</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaTag className="text-teal-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.name ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="e.g., Organic Tomatoes"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.category ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                  errors.description ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Describe your product, including flavor, texture, and how it's grown..."
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            {/* Pricing & Inventory */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaDollarSign className="text-teal-600" />
                Pricing & Inventory
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-semibold">₨</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full pl-8 pr-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                        errors.price ? "border-red-500" : "border-gray-200"
                      }`}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="unit" className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaWeightHanging className="inline mr-1 text-teal-500" />
                    Unit *
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.unit ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    {units.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="text-red-500 text-xs mt-1">{errors.unit}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="quantityAvailable" className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaBoxes className="inline mr-1 text-teal-500" />
                    Quantity Available *
                  </label>
                  <input
                    type="number"
                    id="quantityAvailable"
                    name="quantityAvailable"
                    value={formData.quantityAvailable}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.quantityAvailable ? "border-red-500" : "border-gray-200"
                    }`}
                    min="0"
                    placeholder="0"
                  />
                  {errors.quantityAvailable && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.quantityAvailable}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Dates & Status */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-teal-600" />
                Availability & Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="harvestDate" className="block text-sm font-semibold text-gray-700 mb-2">
                    Harvest Date
                  </label>
                  <input
                    type="date"
                    id="harvestDate"
                    name="harvestDate"
                    value={formData.harvestDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="availableUntil" className="block text-sm font-semibold text-gray-700 mb-2">
                    Available Until
                  </label>
                  <input
                    type="date"
                    id="availableUntil"
                    name="availableUntil"
                    value={formData.availableUntil}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mt-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="isOrganic"
                    name="isOrganic"
                    checked={formData.isOrganic}
                    onChange={handleChange}
                    className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                    <FaLeaf className="text-teal-500" />
                    Organic
                  </span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                    <FaCheckCircle className="text-teal-500" />
                    Active (Visible to customers)
                  </span>
                </label>
              </div>
            </div>

            {/* Images */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Images
              </label>
              <div className="flex items-center gap-4 mb-4">
                <label className="cursor-pointer bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2">
                  <FaUpload className="text-sm" />
                  <span>Upload Images</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <span className="text-sm text-gray-500">
                  {formData.images.length}/5 images uploaded
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Upload high-quality images of your product (max 5 images)
              </p>

              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all duration-200 hover:scale-110 opacity-90 hover:opacity-100"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <Link
                to="/farmer/products"
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;