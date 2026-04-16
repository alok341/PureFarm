"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/slices/productSlice";
import { getAllFarmers } from "../redux/slices/farmerSlice";
import { getCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/ProductCard";
import FarmerCard from "../components/FarmerCard";
import Loader from "../components/Loader";
import { FaLeaf, FaUsers, FaShoppingBasket, FaHandshake, FaArrowRight, FaStore, FaTag, FaBrain } from "react-icons/fa";

const HomePage = () => {
  const dispatch = useDispatch();

  const { products, loading: productLoading } = useSelector(
    (state) => state.products
  );
  const { farmers, loading: farmerLoading } = useSelector(
    (state) => state.farmers
  );
  const { categories, loading: categoryLoading } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(getProducts({ limit: 8 }));
    dispatch(getAllFarmers());
    dispatch(getCategories());
  }, [dispatch]);

  const safeProducts = Array.isArray(products) ? products : [];
  const safeFarmers = Array.isArray(farmers) ? farmers : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="space-y-28">

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-3 rounded-2xl">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white">
                  <img
                    src="/logo.png"
                    alt="PureFarm Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Fresh From Farm <br /> 
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              To Your Door
            </span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Discover fresh produce directly from trusted farmers. No middlemen,
            just quality food and fair prices.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/products"
              className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Explore Products
            </Link>
            <Link
              to="/farmers"
              className="border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-teal-50 transition-all duration-300 hover:-translate-y-1"
            >
              View Farmers
            </Link>
          </div>
        </div>
      </section>

      {/* PUREFARM INSIGHTS SECTION */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
              <FaBrain className="text-white text-lg" />
              <span className="text-sm font-semibold">PureFarm Insights</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Smart Farming, Better Results
            </h2>
            <p className="text-teal-100 text-lg max-w-2xl mx-auto mb-8">
              Get predictions on demand, freshness scores, and price optimization to maximize your farm's potential.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl mb-2">📊</div>
                <p className="font-semibold">Demand Prediction</p>
                <p className="text-sm text-teal-100">Know what sells</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl mb-2">🥬</div>
                <p className="font-semibold">Freshness Score</p>
                <p className="text-sm text-teal-100">Quality guaranteed</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl mb-2">💰</div>
                <p className="font-semibold">Price Optimization</p>
                <p className="text-sm text-teal-100">Maximize profits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[ 
            { icon: <FaLeaf />, title: "Fresh Produce", desc: "Harvested and delivered quickly to preserve nutrients and flavor." },
            { icon: <FaUsers />, title: "Support Farmers", desc: "Empower local communities and sustainable agriculture." },
            { icon: <FaShoppingBasket />, title: "Wide Variety", desc: "Seasonal & organic options from trusted local growers." },
            { icon: <FaHandshake />, title: "Direct Connect", desc: "No middlemen involved, ensuring fair prices for all." }
          ].map((item, i) => (
            <div key={i} className="group p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <div className="text-white text-2xl">
                  {item.icon}
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Products</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 mt-2 rounded-full"></div>
            </div>
            <Link to="/products" className="group inline-flex items-center text-teal-600 font-semibold hover:text-teal-700 transition-colors">
              View All
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader />
              </div>
            ) : safeProducts.length > 0 ? (
              safeProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingBasket className="text-teal-600 text-2xl" />
                </div>
                <p className="text-gray-500">No products available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <FaTag className="text-teal-600 text-xl" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Browse Categories</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 mx-auto mt-2 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categoryLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader />
              </div>
            ) : safeCategories.length > 0 ? (
              safeCategories.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="group bg-white p-6 rounded-2xl border border-gray-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white text-xl">
                      {category.icon || <FaStore />}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-teal-600 transition-colors">{category.name}</p>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No categories available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FARMERS SECTION */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Meet Our Farmers</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 mt-2 rounded-full"></div>
            </div>
            <Link to="/farmers" className="group inline-flex items-center text-teal-600 font-semibold hover:text-teal-700 transition-colors">
              View All
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmerLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader />
              </div>
            ) : safeFarmers.length > 0 ? (
              safeFarmers.slice(0, 3).map((farmer) => (
                <FarmerCard key={farmer._id} farmer={farmer} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-teal-600 text-2xl" />
                </div>
                <p className="text-gray-500">No farmers available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-20 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Fresh Journey Today
          </h2>
          <p className="mb-8 text-lg text-teal-50">
            Join PureFarm and experience fresh, direct-from-farm produce like never before.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;