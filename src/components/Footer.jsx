import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok, FaSnapchat } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold">Hanguk Autos</h2>
          <p className="text-gray-400 mt-2">Get Your Dream Car.</p>
        </div>
        
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
            <li><Link to="/shop" className="text-gray-400 hover:text-white">Shop</Link></li>
            <li><Link to="/cart" className="text-gray-400 hover:text-white">Cart</Link></li>
            <li><Link to="/gallery" className="text-gray-400 hover:text-white">Gallery</Link></li>
          </ul>
        </div>
        
        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <p className="text-gray-400 mt-2">Phone: +233 24 633 1519</p>
          <p className="text-gray-400">Email: support@hangukautos.com</p>
        </div>

        {/* Follow Us Section */}
        <div>
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-6 mt-2">
            <a href="https://snapchat.com/t/4bDP0q87" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition duration-300">
              <FaSnapchat size={24} />
            </a>
            <a href="https://www.instagram.com/hangukautos?igsh=am55Znp3emFyMHk1&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition duration-300">
              <FaInstagram size={24} />
            </a>
            <a href="https://x.com/hangukautos?s=21" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition duration-300">
              <FaXTwitter size={24} />
            </a>
            <a href="https://www.tiktok.com/@hangukautos" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition duration-300">
              <FaTiktok size={24} />
            </a>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 mt-6 border-t border-gray-700 pt-4 space-y-2 md:space-y-0">
        <p>&copy; {new Date().getFullYear()} Hanguk Autos. All rights reserved.</p>
        <p>
          <span className="font-bold">Developed by</span> <a href="mailto:princesedem@yahoo.com" className="underline hover:text-white">Prince Sedem</a>
        </p>
      </div>

    </footer>
  );
}

export default Footer;
