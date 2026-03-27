import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */ }
          <div className="w-15 h-15">
            <img src="/images/hanguk-logo.png" alt="Logo" />
          </div>
          

          <div>
            <Link to="/" className="text-xl font-bold text-gray-800">
              Hanguk Autos
            </Link>
          </div>

          {/* Desktop Menu (hidden on small screens) */}
          <div className="hidden md:flex space-x-6 items-center ml-auto mr-5">
            <Link to="/" className="text-gray-700 hover:text-blue-500">
              Home
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-blue-500">
              Shop
            </Link>
            <Link to="/gallery" className="text-gray-700 hover:text-blue-500">
              Gallery
            </Link>
          </div>

          {/* Cart always visible */}
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-blue-500 flex items-center"
            >
              🛒Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button (hamburger) */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-800 focus:outline-none text-xl"
              >
                {isOpen ? "✖" : "☰"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-md"
        >
          <div className="px-4 py-2 space-y-2">
            <Link to="/" className="block text-gray-700 hover:text-blue-500">
              Home
            </Link>
            <Link to="/shop" className="block text-gray-700 hover:text-blue-500">
              Shop
            </Link>
            <Link to="/gallery" className="block text-gray-700 hover:text-blue-500">
              Gallery
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;
