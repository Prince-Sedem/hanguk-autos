
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X, ImagePlus, Trash2 } from "lucide-react";
import { supabase } from "../supabase";

function EditCar() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    year: "",
    price: "",
    display_price: "",
    transmission: "",
    fuel: "",
    engine: "",
    category: "",
    status: "Available",
    description: "",
    featured: false,
    popular: false,
  });

  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  /*
   * Market Price Data
   *
   * Stored in Supabase as JSONB.
   *
   * Example:
   * [
   *   { month: "January", price: 120000 },
   *   { month: "February", price: 125000 },
   *   { month: "March", price: 130000 }
   * ]
   */
  const [marketPriceData, setMarketPriceData] = useState([]);

  const [marketPriceInput, setMarketPriceInput] = useState({
    month: "",
    price: "",
  });

  // --------------------------------------------------
  // LOAD CAR
  // --------------------------------------------------

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error loading car:", error);
        alert("Unable to load this vehicle.");
        navigate("/admin");
        return;
      }

      setFormData({
        name: data.name || "",
        brand: data.brand || "",
        year: data.year || "",
        price: data.price || "",
        display_price: data.display_price || "",
        transmission: data.transmission || "",
        fuel: data.fuel || "",
        engine: data.engine || "",
        category: data.category || "",
        status: data.status || "Available",
        description: data.description || "",
        featured: data.featured || false,
        popular: data.popular || false,
      });

      setFeatures(Array.isArray(data.features) ? data.features : []);

      setExistingImages(
        Array.isArray(data.images) ? data.images : []
      );

      /*
       * Load JSONB market price data
       */
      if (Array.isArray(data.market_price_data)) {
        setMarketPriceData(data.market_price_data);
      } else {
        setMarketPriceData([]);
      }

      setLoading(false);
    };

    fetchCar();
  }, [id, navigate]);

  // --------------------------------------------------
  // FORM CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --------------------------------------------------
  // NEW IMAGE SELECTION
  // --------------------------------------------------

  const handleImageSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (validFiles.length !== selectedFiles.length) {
      alert("Only JPG, PNG and WEBP images are allowed.");
    }

    setNewImages((prev) => [...prev, ...validFiles]);

    e.target.value = "";
  };

  // --------------------------------------------------
  // REMOVE EXISTING IMAGE
  // --------------------------------------------------

  const removeExistingImage = (index) => {
    setExistingImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // --------------------------------------------------
  // REMOVE NEW IMAGE
  // --------------------------------------------------

  const removeNewImage = (index) => {
    setNewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // --------------------------------------------------
  // FEATURES
  // --------------------------------------------------

  const addFeature = () => {
    const feature = featureInput.trim();

    if (!feature) return;

    setFeatures((prev) => [...prev, feature]);

    setFeatureInput("");
  };

  const removeFeature = (index) => {
    setFeatures((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // --------------------------------------------------
  // MARKET PRICE
  // --------------------------------------------------

  const handleMarketPriceInputChange = (e) => {
    const { name, value } = e.target;

    setMarketPriceInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addMarketPrice = () => {
    const month = marketPriceInput.month.trim();
    const price = Number(marketPriceInput.price);

    if (!month) {
      alert("Please enter a month.");
      return;
    }

    if (!price || price <= 0) {
      alert("Please enter a valid market price.");
      return;
    }

    setMarketPriceData((prev) => [
      ...prev,
      {
        month,
        price,
      },
    ]);

    setMarketPriceInput({
      month: "",
      price: "",
    });
  };

  const removeMarketPrice = (index) => {
    setMarketPriceData((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // --------------------------------------------------
  // SAVE
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      // ----------------------------------------------
      // 1. Upload new images
      // ----------------------------------------------

      const uploadedImageUrls = [];

      for (const image of newImages) {
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}-${image.name}`;

        const filePath = `cars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(filePath, image);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("car-images")
          .getPublicUrl(filePath);

        uploadedImageUrls.push(publicUrlData.publicUrl);
      }

      // ----------------------------------------------
      // 2. Combine images
      // ----------------------------------------------

      const allImages = [
        ...existingImages,
        ...uploadedImageUrls,
      ];

      const mainImage = allImages[0] || "";

      // ----------------------------------------------
      // 3. Update car
      // ----------------------------------------------

      const { error: updateError } = await supabase
        .from("cars")
        .update({
          name: formData.name,
          brand: formData.brand,
          year: Number(formData.year),
          price: Number(formData.price),
          display_price: formData.display_price,
          transmission: formData.transmission,
          fuel: formData.fuel,
          engine: formData.engine,
          category: formData.category,
          status: formData.status,
          description: formData.description,
          featured: formData.featured,
          popular: formData.popular,
          features: features,
          main_image: mainImage,
          images: allImages,

          /*
           * JSONB market price data
           */
          market_price_data: marketPriceData,
        })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      alert("Vehicle updated successfully!");

      navigate("/admin");
    } catch (error) {
      console.error("Error updating vehicle:", error);

      alert(
        error.message ||
          "Something went wrong while updating the vehicle."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">
          Loading vehicle...
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hanguk Autos
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Edit Vehicle
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

        </div>
      </header>

      {/* MAIN */}

      <main className="max-w-5xl mx-auto px-6 py-8">

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-900">
            Edit Vehicle
          </h2>

          <p className="text-gray-500 mt-2">
            Update the details of this vehicle.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* BASIC INFORMATION */}

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="md:col-span-2">

                <label className="label">
                  Vehicle Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                />

              </div>

              <div>

                <label className="label">
                  Brand
                </label>

                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="input"
                />

              </div>

              <div>

                <label className="label">
                  Year
                </label>

                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1900"
                  max="2100"
                  required
                  className="input"
                />

              </div>

              <div>

                <label className="label">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                  className="input"
                />

              </div>

              <div>

                <label className="label">
                  Display Price
                </label>

                <input
                  type="text"
                  name="display_price"
                  value={formData.display_price}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. Buying and Shipping - ₵108,000"
                />

              </div>

            </div>

          </section>

          {/* SPECIFICATIONS */}

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Vehicle Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>

                <label className="label">
                  Transmission
                </label>

                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">
                    Select transmission
                  </option>

                  <option value="Automatic">
                    Automatic
                  </option>

                  <option value="Manual">
                    Manual
                  </option>

                  <option value="CVT">
                    CVT
                  </option>
                </select>

              </div>

              <div>

                <label className="label">
                  Fuel Type
                </label>

                <select
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">
                    Select fuel
                  </option>

                  <option value="Petrol">
                    Petrol
                  </option>

                  <option value="Diesel">
                    Diesel
                  </option>

                  <option value="Hybrid">
                    Hybrid
                  </option>

                  <option value="Electric">
                    Electric
                  </option>
                </select>

              </div>

              <div>

                <label className="label">
                  Engine
                </label>

                <input
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleChange}
                  className="input"
                />

              </div>

              <div>

                <label className="label">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">
                    Select category
                  </option>

                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Van">Van</option>
                  <option value="Truck">Truck</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Electric">Electric</option>
                </select>

              </div>

              <div>

                <label className="label">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="Available">
                    Available
                  </option>

                  <option value="Sold">
                    Sold
                  </option>

                  <option value="Reserved">
                    Reserved
                  </option>
                </select>

              </div>

            </div>

          </section>

          {/* IMAGES */}

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            <div className="flex items-center justify-between mb-2">

              <div>

                <h3 className="text-xl font-bold text-gray-900">
                  Vehicle Images
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Manage existing images or upload new ones.
                </p>

              </div>

              <ImagePlus
                className="text-red-600"
                size={24}
              />

            </div>

            {existingImages.length > 0 && (

              <div className="mt-6">

                <h4 className="font-semibold text-gray-900 mb-3">
                  Existing Images
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

                  {existingImages.map((image, index) => (

                    <div
                      key={`${image}-${index}`}
                      className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
                    >

                      <img
                        src={image}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
                          Main Image
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removeExistingImage(index)
                        }
                        className="absolute top-2 right-2 bg-white/90 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  ))}

                </div>

              </div>

            )}

            <label className="mt-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-red-400 hover:bg-red-50/30 transition">

              <ImagePlus
                size={40}
                className="text-gray-400 mb-3"
              />

              <p className="font-semibold text-gray-700">
                Click to upload new images
              </p>

              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG or WEBP
              </p>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />

            </label>

            {newImages.length > 0 && (

              <div className="mt-6">

                <h4 className="font-semibold text-gray-900 mb-3">
                  New Images
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

                  {newImages.map((image, index) => (

                    <div
                      key={`${image.name}-${index}`}
                      className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
                    >

                      <img
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeNewImage(index)
                        }
                        className="absolute top-2 right-2 bg-white/90 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  ))}

                </div>

              </div>

            )}

          </section>

          {/* DESCRIPTION */}

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Description
            </h3>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="input resize-none"
            />

          </section>

          {/* FEATURES */}

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Features
            </h3>

            <p className="text-sm text-gray-500 mb-5">
              Add or remove vehicle features.
            </p>

            <div className="flex gap-3">

              <input
                type="text"
                value={featureInput}
                onChange={(e) =>
                  setFeatureInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                placeholder="e.g. Leather Seats"
                className="input flex-1"
              />

              <button
                type="button"
                onClick={addFeature}
                className="px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
              >
                <Plus size={18} />
                Add
              </button>

            </div>

            {features.length > 0 && (

              <div className="flex flex-wrap gap-2 mt-5">

                {features.map((feature, index) => (

                  <div
                    key={`${feature}-${index}`}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm"
                  >

                    <span>
                      {feature}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        removeFeature(index)
                      }
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>

                  </div>

                ))}

              </div>

            )}

          </section>

          {/* WEBSITE PLACEMENT */}

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Website Placement
            </h3>

            <div className="space-y-4">

              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5"
                />

                <div>

                  <p className="font-medium text-gray-900">
                    Featured Vehicle
                  </p>

                  <p className="text-sm text-gray-500">
                    Show this vehicle in the featured section.
                  </p>

                </div>

              </label>

              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  name="popular"
                  checked={formData.popular}
                  onChange={handleChange}
                  className="w-5 h-5"
                />

                <div>

                  <p className="font-medium text-gray-900">
                    Popular Vehicle
                  </p>

                  <p className="text-sm text-gray-500">
                    Show this vehicle in the popular section.
                  </p>

                </div>

              </label>

            </div>

          </section>

          {/* MARKET PRICE */}

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Market Price Data
            </h3>

            <p className="text-sm text-gray-500 mb-6">
              Add monthly market prices. These values will appear as a
              chart on the vehicle details page.
            </p>

            {/* ADD MARKET PRICE */}

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">

              <input
                type="text"
                name="month"
                value={marketPriceInput.month}
                onChange={handleMarketPriceInputChange}
                placeholder="Month e.g. January"
                className="input"
              />

              <input
                type="number"
                name="price"
                value={marketPriceInput.price}
                onChange={handleMarketPriceInputChange}
                placeholder="Market price"
                min="0"
                className="input"
              />

              <button
                type="button"
                onClick={addMarketPrice}
                className="px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add
              </button>

            </div>

            {/* MARKET PRICE LIST */}

            {marketPriceData.length > 0 ? (

              <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">

                <div className="grid grid-cols-[1fr_1fr_auto] bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600">
                  <span>Month</span>
                  <span>Market Price</span>
                  <span></span>
                </div>

                {marketPriceData.map((item, index) => (

                  <div
                    key={`${item.month}-${index}`}
                    className="grid grid-cols-[1fr_1fr_auto] items-center px-4 py-3 border-t border-gray-100"
                  >

                    <span className="text-gray-800">
                      {item.month}
                    </span>

                    <span className="font-semibold text-gray-800">
                      ₵{Number(item.price).toLocaleString()}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        removeMarketPrice(index)
                      }
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                ))}

              </div>

            ) : (

              <div className="mt-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500">
                No market price data added yet.
              </div>

            )}

          </section>

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-4 justify-end">

            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-7 py-3 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold transition"
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </main>

      <style>{`
        .label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          background-color: white;
          color: #111827;
          outline: none;
          transition: 0.2s;
        }

        .input:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
        }
      `}</style>

    </div>
  );
}

export default EditCar;

