import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Cog, Gauge, Fuel, Calendar } from "lucide-react";
import { supabase } from "../supabase";

// Fade Up Motion
const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

function FeaturedCars() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  // --------------------------------------------------
  // LOAD FEATURED CARS FROM SUPABASE
  // --------------------------------------------------

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("featured", true)
        .eq("status", "Available")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading featured cars:", error);
        setFeaturedCars([]);
      } else {
        setFeaturedCars(data || []);
      }

      setLoading(false);
    };

    fetchFeaturedCars();
  }, []);

  return (
    <div className="py-10 px-6">
      {/* Heading */}
      <h2
        data-aos="zoom-in"
        className="text-3xl font-bold text-gray-800 text-center mb-6"
      >
        Featured Cars
      </h2>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 py-10">
          Loading featured cars...
        </div>
      )}

      {/* No Featured Cars */}
      {!loading && featuredCars.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No featured cars available at the moment.
        </div>
      )}

      {/* Cars */}
      {!loading && featuredCars.length > 0 && (
        <div
          data-aos="fade-up"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuredCars.map((car) => {
            // Create the same specs structure
            // used by your old cards
            const specs = [
              {
                icon: Cog,
                value: car.transmission || "N/A",
              },
              {
                icon: Gauge,
                value: car.engine || "N/A",
              },
              {
                icon: Fuel,
                value: car.fuel || "N/A",
              },
              {
                icon: Calendar,
                value: car.year || "N/A",
              },
            ];

            return (
              <motion.div
                key={car.id}
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: false,
                  amount: 0.2,
                }}
                transition={{
                  duration: 1.0,
                  ease: "easeOut",
                }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-4 rounded-lg shadow-2xl hover:shadow-xl transition"
              >
                {/* Image */}
                <img
                  src={car.main_image}
                  alt={car.name}
                  className="rounded-md mb-3 w-100 h-50 object-cover"
                />

                {/* Name */}
                <h3 className="text-lg font-bold text-gray-800">{car.name}</h3>

                {/* Price */}
                <p className="text-gray-600">
                  Buying and Shipping - ₵
                  {Number(car.price || 0).toLocaleString()}
                </p>

                {/* Specs Section */}
                <div className="flex justify-between mt-3">
                  {specs.map((spec, index) => {
                    const Icon = spec.icon;

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center text-gray-600 text-sm"
                      >
                        <Icon className="w-5 h-5 mb-1" />

                        <span>{spec.value}</span>
                      </div>
                    );
                  })}
                </div>

                {/* View Details */}
                <Link to={`/product/${car.id}`}>
                  <button className="mt-2 px-4 py-2 w-full bg-gradient-to-r from-black to-blue-600 text-white rounded-bl-xl rounded-tr-xl shadow-md hover:bg-blue-700">
                    View Details
                  </button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FeaturedCars;
