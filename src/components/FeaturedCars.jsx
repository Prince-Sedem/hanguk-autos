import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import React,{useEffect} from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Cog, Gauge, Fuel , Calendar} from "lucide-react";



// Sample featured gifts
const featuredCars = [
  { id: 1, name: "Hyundai Tucson", price: "Buying and Shipping - ₵142,000", image: "/images/Hyundai-Tucson(gray-2020)-main.jpeg" ,
     specs: [
      { icon: Cog, value: "Automatic" },
      { icon: Gauge, value: "2.5L" },
      { icon: Fuel, value: "Diesel" },
      { icon: Calendar, value: "2020" },
    ],
  },

  { id: 25, name: "Hyundai Kona", price: "Buying and Shipping - ₵168,000", image: "/images/Hyundai-Kona(white-2022)-main.jpeg",
    specs: [
      { icon: Cog, value: "Automatic" },
      { icon: Gauge, value: "2.0L" },
      { icon: Fuel, value: "Petrol" },
      { icon: Calendar, value: "2022" },
    ],
   },

  { id: 29, name: "Toyota Camry", price: "Buying and Shipping - ₵108,000", image: "/images/Toyota-Camry(brown-2018)-main.jpeg",
         specs: [
      { icon: Cog, value: "Automatic" },
      { icon: Gauge, value: "2.0L" },
      { icon: Fuel, value: "Petrol" },
      { icon: Calendar, value: "2018" },
    ],
   },

  { id: 4, name: "Kia Morning", price: "Buying and Shipping - ₵45,000", image: "/images/kia-morning(gray-2016)-main.jpeg",
         specs: [
      { icon: Cog, value: "Automatic" },
      { icon: Gauge, value: "1.0L" },
      { icon: Fuel, value: "Petrol" },
      { icon: Calendar, value: "2016" },
    ],
   },

];

// Fade Up Motion
const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

function FeaturedCars() {
      useEffect(() => {
        AOS.init({
          duration: 1000, // animation duration in ms
          once: false,
        });
      }, []);


  return (
    <div className="py-10 px-6">
      <h2 data-aos="zoom-in"
      className="text-3xl font-bold text-gray-800 text-center mb-6">Featured Cars</h2>
      
      <div 
      data-aos="fade-up"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredCars.map((car) => (
          <motion.div
            key={car.id}
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-4 rounded-lg shadow-2xl hover:shadow-xl transition"
          >
            <img src={car.image} alt={car.name} className="rounded-md mb-3 w-100 h-50 object-cover" />
            <h3 className="text-lg font-bold text-gray-800">{car.name}</h3>
            <p className="text-gray-600">{car.price}</p>

             {/* Specs Section */}
  <div className="flex justify-between mt-3">
    {car.specs.map((spec, index) => {
      const Icon = spec.icon; // dynamically render the icon
      return (
        <div key={index} className="flex flex-col items-center text-gray-600 text-sm">
          <Icon className="w-5 h-5 mb-1" />
          <span>{spec.value}</span>
        </div>
      );
    })}
  </div>
            
            <Link to={`/product/${car.id}`}>
              <button className="mt-2 px-4 py-2 w-full bg-gradient-to-r from-black to-blue-600 text-white rounded-bl-xl rounded-tr-xl shadow-md hover:bg-blue-700">
                View Details
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedCars;
