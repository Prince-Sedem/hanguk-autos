import { useState } from "react";
import React,{useEffect} from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';


const galleryData = {
  Port: [
    "/images/portday-1.jpeg",
    "/images/portday-2.jpeg",
    "/images/portday-3.jpeg",
    "/images/portday-4.jpeg",
    "/images/portday-5.jpeg",
    "/images/portday-6.jpg",
    "/images/portday-7.jpg",
    "/images/portday-8.jpg",
    "/images/portday-9.jpg",
    "/images/portday-10.jpg",
    "/images/portday-11.jpg",
    "/images/portday-12.jpg",
    "/images/portday-13.jpg",
  ],

  Testimonials: [
    "/images/birthday1.png",
    "/images/birthday2.png",
    "/images/birthday3.png",
  ],
};

function Gallery() {
          useEffect(() => {
            AOS.init({
              duration: 1000, // animation duration in ms
              once: false,
            });
          }, []);    
    

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section className="py-12 px-6 bg-gray-100">
      <h2 
      data-aos="zoom-in"
      className="text-3xl font-bold text-center text-gray-800 mt-10">Gallery</h2>

      {Object.entries(galleryData).map(([category, images]) => (
        <div 
        data-aos="fade-up"
        key={category} 
        className="mb-10"
        
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-4">{category}</h3>
          <div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${category} ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg shadow cursor-pointer hover:scale-105 transition"
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Enlarged"
            className="max-w-full max-h-[80%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </section>
  );
}

export default Gallery;
