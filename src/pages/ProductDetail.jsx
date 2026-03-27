import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext"; 
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,} from "recharts";
import { products } from "../data/products";







// Market Price Data
const formatNumber = (value) =>
  new Intl.NumberFormat("en-US").format(value);



function ProductDetail() {
  const { id } = useParams();
const location = useLocation();

// Add to Cart
const { addToCart } = useCart();

// Find the product by id
const product = products.find((p) => p.id === parseInt(id));
if (!product) return <p className="text-center">Product Not Found</p>;

// State for main image
const [activeImage, setActiveImage] = useState(
  location.state?.initialImage || product.images?.[0] || product.image
);

// ✅ Reset activeImage when URL or location changes
useEffect(() => {
  setActiveImage(location.state?.initialImage || product.images?.[0] || product.image);
}, [id, location.state, product.images]);

  if (!product) return <p className="text-center">Product Not Found</p>;

  return (
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-9xl mx-auto bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">

      {/* LEFT COLUMN: Gallery + Similar Cars */}
<motion.div
  initial={{ opacity: 0, x: -40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  className="w-full"
>
  {/* MAIN IMAGE */}
  <div className="w-full flex items-center justify-center mt-5">
    <img
      src={activeImage}
      alt={product.name}
      className="w-full max-h-[500px] object-contain rounded-lg transition-all duration-300"
    />
  </div>

  {/* THUMBNAILS */}
  {product.images?.length > 1 && (
    <div className="flex gap-3 justify-center mb-8">
      {product.images.map((img, index) => (
        <button
          key={index}
          onClick={() => setActiveImage(img)}
          className={`border rounded-lg p-1 transition-all
            ${
              activeImage === img
                ? "border-blue-600 ring-2 ring-blue-300"
                : "border-gray-300 hover:border-blue-400"
            }
          `}
        >
          <img
            src={img}
            alt={`${product.name} ${index + 1}`}
            className="w-20 h-20 object-contain rounded-md"
          />
        </button>
      ))}
    </div>
  )}

  {/* POPULAR CARS */}
  <div className="mt-8">
    <h2 className="text-xl font-semibold mb-4">Popular Cars</h2>
    <div className="flex gap-4 overflow-x-auto">
      {products
        .filter((p) => [3, 1, 4].includes(p.id)) // pick 3 popular cars by ID
        .map((p) => (
          <Link
            to={`/product/${p.id}`}
            state={{ initialImage: p.images?.[0] || p.image }} // ✅ Pass clicked image
            key={p.id}
            className="w-1/3 min-w-[120px] "
          >
            <img
              src={p.images?.[0] || p.image}
              alt={p.name}
              className="w-full h-32 object-cover rounded-lg shadow-md"
            />
            <p className="text-sm mt-1 text-center font-medium">{p.name}</p>
            <p className="text-sm text-gray-600 text-center">
              {p.displayPrice ?? `₵${p.price}`}
            </p>
          </Link>
        ))}
    </div>
  </div>
</motion.div>




      {/* RIGHT: Details */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col"
      >
        <h1 className="text-3xl font-bold mt-7">{product.name}</h1>
        <p className="text-xl font-semibold text-blue-600 mb-4">
          ₵{product.displayPrice}
        </p>

        {/* List of items / details */}
        {product.features?.length ? (
  <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
    {product.features.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
) : (
  <p className="text-gray-500 mb-6">
    No additional product details available.
  </p>
)}


        {/* Buttons under the list */}
        <button
          onClick={() => addToCart(product)}
          className="w-full mb-3 px-6 py-3 bg-gradient-to-r from-black to-blue-600 text-white rounded-bl-xl rounded-tr-xl shadow-md hover:opacity-90"
        >
          Add to Cart
        </button>

        <Link
          to="/shop"
          className="w-full text-center px-6 py-3 bg-gray-200 text-gray-800 rounded-bl-xl rounded-tr-xl hover:bg-gray-300"
        >
          Back to Shop
        </Link>
        {/* Market Price Statistics */}
<div className="mt-8">
  <h2 className="text-lg font-semibold mb-3">
    Market Price Statistics
  </h2>

  <div className="bg-gradient-to-r from-blue-200 to-white rounded-lg p-4 shadow-inner">
<ResponsiveContainer width="100%" height={200}>
  <LineChart data={product.marketPriceData}>
    <XAxis dataKey="month" />
    <YAxis tickFormatter={(value) => `₵${formatNumber(value)}`} />
    <Tooltip formatter={(value) => [`₵${formatNumber(value)}`, "Price"]} />
    <Line type="monotone" dataKey="price" strokeWidth={2} dot={{ r: 4 }} />
  </LineChart>
</ResponsiveContainer>




    <p className="text-sm text-gray-500 mt-3">
      Average market price trend over the last 6 months
    </p>
  </div>
</div>

      </motion.div>

      

    </div>
  </div>
);

}

export default ProductDetail;
