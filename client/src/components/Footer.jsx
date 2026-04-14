import { Link } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 - Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaLeaf className="text-teal-500 text-xl" />
              <h3 className="text-xl font-bold">PureFarm</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Connecting farmers directly with consumers.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/farmers" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Farmers
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-teal-400 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>support@purefarm.com</li>
              <li>College Project</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} PureFarm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;