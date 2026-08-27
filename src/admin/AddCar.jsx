import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X, ImagePlus, Trash2 } from "lucide-react";
import { supabase } from "../supabase";

function AddCar() {
  const navigate = useNavigate();

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
    market_price_data: "",
  });

  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");

  const [images, setImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  {
    /* Handle Select */
  }

  const handleImageSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    );

    if (validFiles.length !== selectedFiles.length) {
      alert("Only JPG, PNG and WEBP images are allowed.");
    }

    setImages((prev) => [...prev, ...validFiles]);

    // Allow selecting the same file again later
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    const feature = featureInput.trim();

    if (!feature) return;

    setFeatures((prev) => [...prev, feature]);
    setFeatureInput("");
  };

  const removeFeature = (index) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  {
    /* Handle Submit */
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please upload at least one vehicle image.");
      return;
    }

    try {
      setUploadingImages(true);

      // Check that the admin is logged in
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Your session has expired. Please log in again.");
        navigate("/admin/login");
        return;
      }

      // Generate a unique folder for this vehicle
      const carFolder = `${Date.now()}-${crypto.randomUUID()}`;

      const uploadedImageUrls = [];

      // Upload every selected image
      for (const image of images) {
        const fileExtension = image.name.split(".").pop().toLowerCase();

        const fileName = `${crypto.randomUUID()}.${fileExtension}`;

        const filePath = `${carFolder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(filePath, image, {
            cacheControl: "3600",
            upsert: false,
            contentType: image.type,
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("car-images").getPublicUrl(filePath);

        uploadedImageUrls.push(publicUrl);
      }

      // Save vehicle information to the cars table
      const { error: carError } = await supabase.from("cars").insert([
        {
          name: formData.name,
          brand: formData.brand,
          year: Number(formData.year),
          price: Number(formData.price),
          display_price: formData.display_price,
          transmission: formData.transmission,
          fuel: formData.fuel,
          engine: formData.engine,
          category: formData.category,
          main_image: uploadedImageUrls[0],
          images: uploadedImageUrls,
          features: features,
          featured: formData.featured,
          popular: formData.popular,
          status: formData.status,
          description: formData.description,
          market_price_data: formData.market_price_data,
        },
      ]);

      if (carError) {
        throw carError;
      }

      alert("Vehicle added successfully!");

      navigate("/admin");
    } catch (error) {
      console.error("Error adding vehicle:", error);

      alert(error.message || "Something went wrong while adding the vehicle.");
    } finally {
      setUploadingImages(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hanguk Autos</h1>

            <p className="text-sm text-gray-500 mt-1">Add New Vehicle</p>
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

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Add New Car</h2>

          <p className="text-gray-500 mt-2">
            Enter the details of the new vehicle.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="label">Vehicle Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Toyota Camry 2022"
                  required
                  className="input"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="label">Brand</label>

                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Toyota"
                  required
                  className="input"
                />
              </div>

              {/* Year */}
              <div>
                <label className="label">Year</label>

                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="2022"
                  min="1900"
                  max="2100"
                  required
                  className="input"
                />
              </div>

              {/* Price */}
              <div>
                <label className="label">Price</label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="250000"
                  min="0"
                  required
                  className="input"
                />
              </div>

              {/* Display Price */}
              <div>
                <label className="label">Display Price</label>

                <input
                  type="text"
                  name="display_price"
                  value={formData.display_price}
                  onChange={handleChange}
                  placeholder="GH₵ 250,000"
                  className="input"
                />
              </div>
            </div>
          </section>

          {/* Vehicle Specifications */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Vehicle Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Transmission */}
              <div>
                <label className="label">Transmission</label>

                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>

              {/* Fuel */}
              <div>
                <label className="label">Fuel Type</label>

                <select
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select fuel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              {/* Engine */}
              <div>
                <label className="label">Engine</label>

                <input
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleChange}
                  placeholder="e.g. 2.5L"
                  className="input"
                />
              </div>

              {/* Category */}
              <div>
                <label className="label">Category</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select category</option>
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

              {/* Status */}
              <div>
                <label className="label">Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="Available">Available</option>

                  <option value="Sold">Sold</option>

                  <option value="Reserved">Reserved</option>
                </select>
              </div>
            </div>
          </section>

          {/* Vehicle Images */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Vehicle Images
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Upload clear photos of the vehicle.
                </p>
              </div>

              <ImagePlus className="text-red-600" size={24} />
            </div>

            {/* Upload */}
            <label className="mt-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-red-400 hover:bg-red-50/30 transition">
              <ImagePlus size={40} className="text-gray-400 mb-3" />

              <p className="font-semibold text-gray-700">
                Click to upload images
              </p>

              <p className="text-sm text-gray-500 mt-1">JPG, PNG or WEBP</p>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>

            {/* Selected Images */}
            {images.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">
                    Selected Images
                  </h4>

                  <span className="text-sm text-gray-500">
                    {images.length} image
                    {images.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={`${image.name}-${index}`}
                      className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />

                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
                          Main Image
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-white/90 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  The first image will automatically be used as the main vehicle
                  image.
                </p>
              </div>
            )}
          </section>

          {/* Description */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Description
            </h3>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="Describe the vehicle..."
              className="input resize-none"
            />
          </section>

          {/* Features */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Features</h3>

            <p className="text-sm text-gray-500 mb-5">
              Add the main features of this vehicle.
            </p>

            <div className="flex gap-3">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
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
                    <span>{feature}</span>

                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Featured / Popular */}
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
                  <p className="font-medium text-gray-900">Featured Vehicle</p>

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
                  <p className="font-medium text-gray-900">Popular Vehicle</p>

                  <p className="text-sm text-gray-500">
                    Show this vehicle in the popular section.
                  </p>
                </div>
              </label>
            </div>
          </section>

          {/* Market Price Data */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Market Price Data
            </h3>

            <p className="text-sm text-gray-500 mb-5">
              Optional information about the vehicle's market price.
            </p>

            <textarea
              name="market_price_data"
              value={formData.market_price_data}
              onChange={handleChange}
              rows="4"
              placeholder="Enter market price information..."
              className="input resize-none"
            />
          </section>

          {/* Submit */}
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
              disabled={uploadingImages}
              className="px-7 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploadingImages ? "Saving Vehicle..." : "Save Vehicle"}
            </button>
          </div>
        </form>
      </main>

      {/* Local styles */}
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

export default AddCar;
