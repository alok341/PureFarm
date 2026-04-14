const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-12 md:py-16">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                About Us
              </h1>
              <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-12 md:px-12">
            {/* Main Message */}
            <div className="text-center mb-12">
              <div className="inline-block bg-teal-50 rounded-full px-6 py-2 mb-6">
                <p className="text-teal-700 font-semibold text-sm tracking-wide">
                  Our Mission
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                PureFarm
              </h2>
              <p className="text-xl text-teal-600 font-medium mb-6">
                Connecting Farmers to Consumers
              </p>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                We're building a direct bridge between local farmers and conscious consumers, 
                ensuring fresh, sustainable produce reaches your table while supporting 
                agricultural communities.
              </p>
            </div>

            {/* Key Points Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-teal-50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Farm Fresh</h3>
                <p className="text-sm text-gray-600">Direct from local farms to your home</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-teal-50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fair Pricing</h3>
                <p className="text-sm text-gray-600">Supporting farmers with fair compensation</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-teal-50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
                <p className="text-sm text-gray-600">Hand-picked, fresh, and organic produce</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} PureFarm. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;