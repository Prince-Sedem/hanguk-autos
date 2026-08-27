import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Cog,
  Gauge,
  Fuel,
  Calendar,
} from "lucide-react";
import { supabase } from "../supabase";

function Shop() {
  const [cars, setCars] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // LOAD CARS FROM SUPABASE
  // --------------------------------------------------

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("status", "Available")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching cars:", error);
        setCars([]);
      } else {
        setCars(data || []);
      }

      setLoading(false);
    };

    fetchCars();
  }, []);

  // --------------------------------------------------
  // AOS
  // --------------------------------------------------

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  // --------------------------------------------------
  // CATEGORY FILTER
  // --------------------------------------------------

  const categories = [
    "All",
    "Kia",
    "Toyota",
    "Chevrolet",
    "Honda",
    "Hyundai",
  ];

  const filteredCars =
    selectedCategory === "All"
      ? cars
      : cars.filter(
          (car) =>
            car.brand?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">

        <motion.h1
          className="text-3xl font-bold text-center text-gray-800 mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Shop Our Collection
        </motion.h1>

        <div className="flex justify-center items-center py-20">
          <div className="text-gray-500">
            Loading vehicles...
          </div>
        </div>

      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* PAGE TITLE */}

      <motion.h1
        className="text-3xl font-bold text-center text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Shop Our Collection
      </motion.h1>

      {/* FILTER BUTTONS */}

      <div className="flex flex-wrap justify-center gap-3 mb-6 px-2">

        {categories.map((category) => (

          <button
            key={category}
            onClick={() =>
              setSelectedCategory(category)
            }
            className={`px-4 py-2 rounded-lg shadow-md text-sm sm:text-base text-gray-700 ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-white"
            } transition duration-300`}
          >
            {category}
          </button>

        ))}

      </div>

      {/* VEHICLE COUNT */}

      <p className="text-center text-sm text-gray-500 mb-6">
        {filteredCars.length} vehicle
        {filteredCars.length !== 1 ? "s" : ""} available
      </p>

      {/* NO CARS */}

      {filteredCars.length === 0 ? (

        <div className="text-center py-20">

          <h2 className="text-xl font-semibold text-gray-700">
            No vehicles available
          </h2>

          <p className="text-gray-500 mt-2">
            There are currently no vehicles in this category.
          </p>

        </div>

      ) : (

        /* PRODUCT GRID */

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >

          {filteredCars.map((car, index) => {

            const mainImage =
              car.main_image ||
              car.images?.[0] ||
              "";

            return (

              <Link
                key={car.id}
                to={`/product/${car.id}`}
                className="block h-full"
              >

                <motion.div
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="flex flex-col h-full bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition"
                  whileHover={{ scale: 1.05 }}
                >

                  {/* IMAGE */}

                  <div className="h-48 w-full mb-3 overflow-hidden">

                    {mainImage ? (

                      <img
                        src={mainImage}
                        alt={car.name}
                        className="h-full w-full object-cover rounded-md"
                      />

                    ) : (

                      <div className="h-full w-full bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                        No Image
                      </div>

                    )}

                  </div>

                  {/* NAME */}

                  <div className="flex-grow">

                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                      {car.name}
                    </h2>

                    {/* PRICE */}

                    <p className="text-gray-600">
                      Buying and Shipping - ₵
                      {Number(
                        car.price || 0
                      ).toLocaleString()}
                    </p>

                  </div>

                  {/* SPECS */}

                  <div className="grid grid-cols-4 gap-2 mt-4 mb-2">

                    {/* TRANSMISSION */}

                    <div className="flex flex-col items-center text-gray-600 text-sm">

                      <Cog className="w-5 h-5 mb-1" />

                      <span className="text-center">
                        {car.transmission || "N/A"}
                      </span>

                    </div>

                    {/* ENGINE */}

                    <div className="flex flex-col items-center text-gray-600 text-sm">

                      <Gauge className="w-5 h-5 mb-1" />

                      <span className="text-center">
                        {car.engine || "N/A"}
                      </span>

                    </div>

                    {/* FUEL */}

                    <div className="flex flex-col items-center text-gray-600 text-sm">

                      <Fuel className="w-5 h-5 mb-1" />

                      <span className="text-center">
                        {car.fuel || "N/A"}
                      </span>

                    </div>

                    {/* YEAR */}

                    <div className="flex flex-col items-center text-gray-600 text-sm">

                      <Calendar className="w-5 h-5 mb-1" />

                      <span className="text-center">
                        {car.year || "N/A"}
                      </span>

                    </div>

                  </div>

                  {/* VIEW DETAILS */}

                  <button
                    type="button"
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-black to-blue-600 text-white rounded-bl-xl rounded-tr-xl shadow-md hover:bg-blue-700"
                  >
                    View Details
                  </button>

                </motion.div>

              </Link>

            );
          })}

        </motion.div>

      )}

    </div>
  );
}

export default Shop;