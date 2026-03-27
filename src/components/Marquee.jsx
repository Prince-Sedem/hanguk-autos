

const rowOneImages = [
  { image: "/images/Benz.png", name: "Mercedes-Benz" },
  { image: "/images/BMW (1).png", name: "BMW" },
  { image: "/images/Lambo (1).png", name: "Lamborghini" },
  { image: "/images/Honda.png", name: "Honda" },
  { image: "/images/chevrolet-logo.png", name: "Chevrolet" },
  { image: "/images/Ferrari (1).png", name: "Ferrari" },
  { image: "/images/Audi (1).png", name: "Audi" },
  { image: "/images/Ford (1).png", name: "Ford" },
];

const rowTwoImages = [
  { image: "/images/Kia.png", name: "Kia" },
  { image: "/images/Infiniti (1).png", name: "Infiniti" },
  { image: "/images/Mitsubishi-Logo (1).png", name: "Mitsubishi" },
  { image: "/images/Jaguar (1).png", name: "Jaguar" },
  { image: "/images/Hyundai (1).png", name: "Hyundai" },
  { image: "/images/Haima (1).png", name: "Haima" },
  { image: "/images/lexus (1).png", name: "Lexus" },
  { image: "/images/nissan (1).png", name: "Nissan" },
];


const MarqueeRow = ({ images, reverse = false }) => {
  return (
    
    <div className="overflow-hidden w-full">
      <div
        className={`flex w-max gap-10 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {[...images, ...images].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-shrink-0"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-32 h-32 object-contain"
            />

            <span className="mt-2 text-sm font-medium text-gray-700">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default function MarqueeSection() {
  return (
    <section className="w-full py-14 bg-white">
      {/* Header */}
      <div data-aos="zoom-in" className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Our Trusted Brands
        </h2>
      </div>

      {/* Marquee */}
      <div className="space-y-8">
        <MarqueeRow images={rowOneImages} />
        <MarqueeRow images={rowTwoImages} reverse />
      </div>
    </section>
  );
}
