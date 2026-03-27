import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Testimonials data (CAR RELATED)
const testimonials = [
  {
    id: 1,
    name: "Ama Serwaa",
    title: "Accra, Ghana",
    quote:
      "I bought my car from them and the condition was exactly as advertised. Smooth engine and very clean interior!",
    image: "/images/pf2.png",
  },
  {
    id: 2,
    name: "Kwame Asante",
    title: "Kumasi, Ghana",
    quote:
      "Very reliable dealership. The vehicle passed all inspections and the delivery process was fast and stress-free.",
    image: "/images/pf1.png",
  },
  {
    id: 3,
    name: "Akua Boateng",
    title: "Takoradi, Ghana",
    quote:
      "Quality-tested cars just as promised. I've been driving mine for months with zero issues. Highly recommended!",
    image: "/images/pf3.png",
  },
];

function Testimonial() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <section className="bg-gradient-to-br from-gray-100 to-gray-200 py-14 px-6 md:px-12">
      <h2
        data-aos="zoom-in"
        className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
      >
        What Our Customers Say
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            data-aos="fade-up"
            className="group relative p-[1px]
              bg-gradient-to-br from-red-500/40 via-transparent to-gray-900/40
              hover:from-red-500/70 hover:to-gray-900/70
              transition-all duration-500
              [clip-path:polygon(0_0,calc(100%-32px)_0,100%_32px,100%_100%,32px_100%,0_calc(100%-32px))]"
          >
            {/* Glass card */}
            <div
              className="bg-white/80 backdrop-blur-md p-6 h-full
                shadow-lg group-hover:shadow-2xl
                transform group-hover:-translate-y-2
                transition-all duration-500
                [clip-path:polygon(0_0,calc(100%-32px)_0,100%_32px,100%_100%,32px_100%,0_calc(100%-32px))]"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover ring-2 ring-red-500/40"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {testimonial.title}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 italic leading-relaxed">
                “{testimonial.quote}”
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonial;
