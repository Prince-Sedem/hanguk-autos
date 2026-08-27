import { useParams, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { supabase } from "../supabase";

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US").format(Number(value) || 0);

function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [popularCars, setPopularCars] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [popularLoading, setPopularLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD VEHICLE
  // --------------------------------------------------

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error loading vehicle:", error);
        setError("Unable to load this vehicle.");
        setProduct(null);
        setLoading(false);
        return;
      }

      setProduct(data);

      const firstImage =
        location.state?.initialImage ||
        data.images?.[0] ||
        data.main_image ||
        "";

      setActiveImage(firstImage);

      setLoading(false);
    };

    fetchProduct();
  }, [id, location.state]);

  // --------------------------------------------------
  // LOAD POPULAR CARS FROM SUPABASE
  // --------------------------------------------------

  useEffect(() => {
    const fetchPopularCars = async () => {
      setPopularLoading(true);

      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("popular", true)
        .neq("id", id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading popular cars:", error);
        setPopularCars([]);
      } else {
        setPopularCars(data || []);
      }

      setPopularLoading(false);
    };

    fetchPopularCars();
  }, [id]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="text-gray-600 mt-4">Loading vehicle...</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR / NOT FOUND
  // --------------------------------------------------

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Product Not Found
          </h2>

          <p className="text-gray-500 mt-2">
            {error || "This vehicle could not be found."}
          </p>

          <Link
            to="/shop"
            className="inline-block mt-5 px-6 py-3 bg-black text-white rounded-lg"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // IMAGES
  // --------------------------------------------------

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.main_image
        ? [product.main_image]
        : [];

  // --------------------------------------------------
  // MARKET PRICE DATA
  // --------------------------------------------------

  let marketPriceData = [];

  if (Array.isArray(product.market_price_data)) {
    marketPriceData = product.market_price_data;
  }

  // --------------------------------------------------
  // DISPLAY PRICE
  // --------------------------------------------------

  const displayPrice =
    product.display_price ||
    `Buying and Shipping - ₵${formatNumber(product.price)}`;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-9xl mx-auto bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
        {/* ==================================================
            LEFT COLUMN
        ================================================== */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          {/* MAIN IMAGE */}

          <div className="w-full flex items-center justify-center mt-5">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="w-full max-h-[500px] object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">No image available</p>
              </div>
            )}
          </div>

          {/* THUMBNAILS */}

          {images.length > 1 && (
            <div className="flex gap-3 justify-center flex-wrap mt-4 mb-8">
              {images.map((img, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`border rounded-lg p-1 transition-all ${
                    activeImage === img
                      ? "border-blue-600 ring-2 ring-blue-300"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
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

          {/* ==================================================
              VEHICLE SPECS
          ================================================== */}

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Vehicle Specifications
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">Transmission</p>

                <p className="font-semibold text-gray-800 mt-1">
                  {product.transmission || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">Engine</p>

                <p className="font-semibold text-gray-800 mt-1">
                  {product.engine || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">Fuel</p>

                <p className="font-semibold text-gray-800 mt-1">
                  {product.fuel || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">Year</p>

                <p className="font-semibold text-gray-800 mt-1">
                  {product.year || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================
              POPULAR CARS
          ================================================== */}

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Popular Cars</h2>

            {popularLoading ? (
              <div className="text-sm text-gray-500">
                Loading popular cars...
              </div>
            ) : popularCars.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-3">
                {popularCars.map((car) => {
                  const carImage = car.images?.[0] || car.main_image || "";

                  const carPrice =
                    car.display_price ||
                    `Buying and Shipping - ₵${formatNumber(car.price)}`;

                  return (
                    <Link
                      to={`/product/${car.id}`}
                      state={{
                        initialImage: carImage,
                      }}
                      key={car.id}
                      className="w-1/3 min-w-[180px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
                    >
                      {/* IMAGE */}

                      <div className="w-full h-32 bg-gray-100 overflow-hidden">
                        {carImage ? (
                          <img
                            src={carImage}
                            alt={car.name}
                            className="w-full h-full object-cover hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No image
                          </div>
                        )}
                      </div>

                      {/* DETAILS */}

                      <div className="p-3">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {car.name}
                        </p>

                        <p className="text-sm text-blue-600 font-medium mt-1">
                          {carPrice}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <p className="text-sm text-gray-500">
                  No popular vehicles have been selected yet.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ==================================================
            RIGHT COLUMN
        ================================================== */}

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col"
        >
          {/* NAME */}

          <h1 className="text-3xl font-bold mt-7">{product.name}</h1>

          {/* BRAND */}

          <p className="text-gray-500 mt-2">
            {product.brand} • {product.category}
          </p>

          {/* PRICE */}

          <p className="text-xl font-semibold text-blue-600 mb-4">
            Buying and Shipping - ₵{formatNumber(product.price)}
          </p>
          {/* STATUS */}

          <div className="mb-5">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                product.status?.toLowerCase() === "available"
                  ? "bg-green-100 text-green-700"
                  : product.status?.toLowerCase() === "reserved"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {product.status || "Available"}
            </span>
          </div>

          {/* DESCRIPTION */}

          {product.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>

              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* FEATURES */}

          {product.features?.length > 0 ? (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Features</h2>

              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {product.features.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* ADD TO CART */}

          <button
            onClick={() => addToCart(product)}
            className="w-full mb-3 px-6 py-3 bg-gradient-to-r from-black to-blue-600 text-white rounded-bl-xl rounded-tr-xl shadow-md hover:opacity-90"
          >
            Add to Cart
          </button>

          {/* BACK */}

          <Link
            to="/shop"
            className="w-full text-center px-6 py-3 bg-gray-200 text-gray-800 rounded-bl-xl rounded-tr-xl hover:bg-gray-300"
          >
            Back to Shop
          </Link>

          {/* ==================================================
              MARKET PRICE
          ================================================== */}

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">
              Market Price Statistics
            </h2>

            {marketPriceData.length > 0 ? (
              <div className="bg-gradient-to-r from-blue-200 to-white rounded-lg p-4 shadow-inner">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={marketPriceData}>
                    <XAxis dataKey="month" />

                    <YAxis
                      tickFormatter={(value) => `₵${formatNumber(value)}`}
                    />

                    <Tooltip
                      formatter={(value) => [
                        `₵${formatNumber(value)}`,
                        "Price",
                      ]}
                    />

                    <Line
                      type="monotone"
                      dataKey="price"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                <p className="text-sm text-gray-500 mt-3">
                  Average market price trend over the last 6 months
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <p className="text-sm text-gray-500">
                  Market price data is not available for this vehicle.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProductDetail;
