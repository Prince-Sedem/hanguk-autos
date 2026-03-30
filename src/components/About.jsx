import React,{useEffect} from "react";
import { motion } from "framer-motion";
import AOS from 'aos';
import 'aos/dist/aos.css';

function About() {
    useEffect(() => {
      AOS.init({
        duration: 1000, // animation duration in ms
        once: false,
      });
    }, []);


  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Overlapping Images */}
<motion.div
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
  className="relative w-full h-[420px]"
>
  {/* Main image */}
  
    <img data-aos="zoom-in"
      src="/images/pexels-fbo-media-535159577-18252366.jpg"
      alt="About Us"
      className="absolute bottom-0 left-0 w-[60%] h-[80%] object-cover rounded-2xl shadow-xl"
    />
     {/* Stats card */}
    <div className="bg-gradient-to-r from-blue-500 to-white absolute bottom-1 right-4 bg-white rounded-xl shadow-lg px-20 py-1 flex flex-col">
      <span className="text-2xl font-bold text-gray-900">100+</span>
      <span className="text-sm text-gray-600 leading-tight">
        Car Sales
      </span>
    </div>
    {/* Overlapping image */}
    <img data-aos="zoom-out"
      src="/images/pexels-spencer-4400407 - Edited.jpg"
      alt="Team"
      className="absolute top-0 right-0 w-[60%] h-[80%] object-cover rounded-2xl shadow-2xl border-4 border-white"
    />
</motion.div>


        {/* Right: Text */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div data-aos="fade-up">  
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About Us</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                <span className="font-semibold text-blue-600">Hanguk Autos</span> is a trusted car sales company committed to delivering quality imported vehicles and a seamless buying experience. We specialize in carefully sourced, imported cars that undergo thorough inspection and certification, ensuring they meet high standards of performance, reliability, and value.
              </p>
              <p className="text-gray-600 text-lg mt-4 leading-relaxed">
              We believe buying a car should be simple, transparent, and stress-free. From first contact to final delivery, our team provides honest guidance, clear information, and personalized support tailored to each customer’s needs. Whether you’re purchasing your first car or upgrading to something better, we’re here to make the process smooth and rewarding.
              </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default About;
