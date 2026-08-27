import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import {
  Car,
  CheckCircle,
  XCircle,
  Plus,
  LogOut,
  RefreshCw,
  Edit,
  Trash2,
  Pencil,
  Star,
  Flame,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCars = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
    } else {
      setCars(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
      return;
    }

    navigate("/admin/login");
  };

  const handleDelete = async (car) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${car.name}? This will also delete its images.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(car.id);

      /*
       * Delete images from Storage first
       */
      if (Array.isArray(car.images) && car.images.length > 0) {
        const filePaths = car.images
          .map((url) => {
            const marker = "/car-images/";

            const index = url.indexOf(marker);

            if (index === -1) return null;

            return url.substring(index + marker.length);
          })
          .filter(Boolean);

        if (filePaths.length > 0) {
          const { error: storageError } = await supabase.storage
            .from("car-images")
            .remove(filePaths);

          if (storageError) {
            console.error("Storage delete error:", storageError);
          }
        }
      }

      /*
       * Delete vehicle from database
       */
      const { error: carError } = await supabase
        .from("cars")
        .delete()
        .eq("id", car.id);

      if (carError) {
        throw carError;
      }

      setCars((prev) => prev.filter((item) => item.id !== car.id));

      alert("Vehicle deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);

      alert(
        error.message || "Something went wrong while deleting the vehicle."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const totalCars = cars.length;

  const availableCars = cars.filter(
    (car) => car.status?.toLowerCase() === "available"
  ).length;

  const soldCars = cars.filter(
    (car) => car.status?.toLowerCase() === "sold"
  ).length;

  const reservedCars = cars.filter(
    (car) => car.status?.toLowerCase() === "reserved"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hanguk Autos
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Admin Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
          >
            <LogOut size={18} />

            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h2>

          <p className="text-gray-500 mt-2">
            Manage your vehicles and inventory.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Total */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Cars
                </p>

                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {totalCars}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Car className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          {/* Available */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Available
                </p>

                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {availableCars}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle
                  className="text-green-600"
                  size={24}
                />
              </div>
            </div>
          </div>

          {/* Sold */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Sold
                </p>

                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {soldCars}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircle
                  className="text-red-600"
                  size={24}
                />
              </div>
            </div>
          </div>

          {/* Reserved */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Reserved
                </p>

                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {reservedCars}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <RefreshCw
                  className="text-yellow-600"
                  size={24}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Vehicle Management
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Add and manage vehicles in your inventory.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={fetchCars}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-5 py-3 rounded-lg transition disabled:opacity-60"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />

                Refresh
              </button>

              <button
                onClick={() => navigate("/admin/cars/new")}
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-lg transition"
              >
                <Plus size={19} />
                Add New Car
              </button>
            </div>
          </div>
        </div>

        {/* Cars */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              Current Inventory
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {totalCars} vehicle
              {totalCars !== 1 ? "s" : ""} in your inventory
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading vehicles...
            </div>
          ) : cars.length === 0 ? (
            <div className="p-10 text-center">
              <Car
                size={45}
                className="mx-auto text-gray-300 mb-4"
              />

              <h4 className="text-lg font-semibold text-gray-700">
                No cars in Supabase yet
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                Your cars table is currently empty.
              </p>

              <button
                onClick={() => navigate("/admin/cars/new")}
                className="mt-5 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-lg transition"
              >
                <Plus size={18} />
                Add Your First Car
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Vehicle
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Brand
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Year
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Price
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Placement
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {cars.map((car) => (
                    <tr
                      key={car.id}
                      className="hover:bg-gray-50 transition"
                    >
                      {/* Vehicle */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 min-w-60">
                          <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            {car.main_image ? (
                              <img
                                src={car.main_image}
                                alt={car.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Car
                                size={24}
                                className="text-gray-300 m-auto"
                              />
                            )}
                          </div>

                          <div>
                            <div className="font-semibold text-gray-900">
                              {car.name}
                            </div>

                            <div className="text-xs text-gray-500 mt-1">
                              {car.category || "Uncategorized"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="px-6 py-4 text-gray-600">
                        {car.brand}
                      </td>

                      {/* Year */}
                      <td className="px-6 py-4 text-gray-600">
                        {car.year}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-gray-600">
                        {car.display_price ||
                          `GH₵ ${Number(car.price).toLocaleString()}`}
                      </td>

                      {/* Placement */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {car.featured && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                              <Star size={12} />
                              Featured
                            </span>
                          )}

                          {car.popular && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                              <Flame size={12} />
                              Popular
                            </span>
                          )}

                          {!car.featured && !car.popular && (
                            <span className="text-xs text-gray-400">
                              All
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            car.status?.toLowerCase() ===
                            "available"
                              ? "bg-green-100 text-green-700"
                              : car.status?.toLowerCase() ===
                                "reserved"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {car.status || "Unknown"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/cars/edit/${car.id}`
                              )
                            }
                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
                            title="Edit vehicle"
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            onClick={() => handleDelete(car)}
                            disabled={deletingId === car.id}
                            className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                            title="Delete vehicle"
                          >
                            <Trash2
                              size={17}
                              className={
                                deletingId === car.id
                                  ? "animate-pulse"
                                  : ""
                              }
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;