import React,{useEffect} from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { products } from "../data/carData";

// Sample product data


  

function Shop() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      once: false,
    });
  }, []);


  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filtered products based on category
  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  return (
    <div 
    className="min-h-screen bg-gray-100 p-6">
      {/* Page Title */}
      <motion.h1
        className="text-3xl font-bold text-center text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Shop Our Collection
      </motion.h1>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6 px-2">
        {["All", "Kia", "Toyota", "Chevrolet", "Honda", "Hyundai"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg  shadow-md text-sm sm:text-base text-gray-700 ${
              selectedCategory === category ? "bg-blue-600 text-white" : "bg-white"
            } transition duration-300`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {filteredProducts.map((product, index) => (
          <Link to={`/product/${product.id}`} className="block h-full">
            <motion.div
              data-aos="fade-up"
              data-aos-delay={index * 100}
              key={product.id}
              className="flex flex-col h-full bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-48 w-full mb-3 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-[450px] object-cover rounded-md"
                />
              </div>
              <div className="flex-grow">
                <h2 className="text-lg font-bold text-gray-800 mb-3">{product.name}</h2>
                <p className="text-gray-600">₵{product.price}</p>
              </div>

              {/* SPECS GRID */}
{product.specs?.length > 0 && (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-2">
    {product.specs.map((spec, index) => {
      const Icon = spec.icon;
      return (
        <div key={index} className="flex flex-col items-center text-gray-600 text-sm mt-4">
          <Icon className="w-5 h-5 mb-1" />
          <span>{spec.value}</span>
        </div>
      );
    })}
  </div>
)}

              <button className="mt-4 px-4 py-2 bg-gradient-to-r from-black to-blue-600 text-white rounded-bl-xl rounded-tr-xl shadow-md hover:bg-blue-700">
                View Details
              </button>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}

export default Shop;
