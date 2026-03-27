import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Sample images for the slider
const images = [
  "/images/pexels-spencer-4400407 - Edited.jpg",
  "/images/pexels-fbo-media-535159577-18252366.jpg",
  "/images/pexels-anderson-wei-2151965849-33473263.jpg",
];

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-red-200 flex items-center justify-center">
      {/* Slider Container */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[currentIndex]}
            src={images[currentIndex]}
            alt="Slider"
            className="absolute w-full h-full object-cover mt-16"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 2 }}
          />
        </AnimatePresence>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white">
        <motion.h1
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Hanguk Autos
        </motion.h1>
        <motion.p
          className="text-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Get your dream car.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/shop" className="px-6 py-3 bg-gradient-to-r from-black to-blue-600 text-white rounded-bl-xl rounded-tr-xl shadow-lg hover:bg-blue-700">
            Shop Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
}


export default Home;





