import React,{useEffect} from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';


const whyChooseUs = [
    {
      title: "Wide Selection of Vehicles",
      description:
        "We offer a diverse range of cars to suit every lifestyle and budget. From fuel-efficient, city rides, commercial to luxury SUVs.",
      icon: "/images/traffic-jam.png",
      alt: "car",
      bgColor: "bg-red-50",
      borderAccent: "border-r-4 border-b-4 border-red-500",
    },
    {
      title: "Fast & Reliable Shipping",
      description:
        "We ensure your car arrive safely and on time. Track your shipment every step of the way for a worry-free delivery experience.",
      icon: "/images/cargo-ship.png",
      alt: "shippment",
      bgColor: "bg-yellow-50",
      borderAccent: "border-t-4 border-r-4 border-yellow-500",
    },
    {
      title: "Trusted Quality",
      description:
        "When you buy from us, you’re investing in a car that’s safe, dependable, and road-ready.",
      icon: "/images/authenticity.png",
      alt: "authenticity",
      bgColor: "bg-green-50",
      borderAccent: "border-b-4 border-r-4 border-green-500",
    },
  ];
  
  function WhyChooseUs() {
        useEffect(() => {
          AOS.init({
            duration: 1000, // animation duration in ms
            once: false,
          });
        }, []);


    return (
      <div>
        {/* Why Choose Us Section */}
        <section className="bg-white py-12 px-6 md:px-12">
          <h2 data-aos="zoom-in"
          className="text-3xl font-bold text-center text-gray-800 mb-10">
            Why Choose Us
          </h2>
  
          <div className="grid gap-8 md:grid-cols-3 text-center">
            {whyChooseUs.map((item, index) => (
              <div
                data-aos="fade-up"
                key={index}
                className={`p-6 ${item.bgColor}  ${item.borderAccent} bg-gray-50 rounded-lg shadow hover:shadow-md transition`}
              >
                <img
                  src={item.icon}
                  alt={item.alt}
                  className="w-16 h-16 mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }
  
  export default WhyChooseUs;
  