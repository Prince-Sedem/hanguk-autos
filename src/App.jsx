import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomeList from "./components/HomeList";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import GalleryList from "./components/GalleryList";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AddCar from "./admin/AddCar";
import EditCar from "./admin/EditCar";
import ProtectedRoute from "./admin/ProtectedRoute";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Public website */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <HomeList />
                <Footer />
              </>
            }
          />

          <Route
            path="/shop"
            element={
              <>
                <Navbar />
                <Shop />
                <Footer />
              </>
            }
          />

          <Route
            path="/product/:id"
            element={
              <>
                <Navbar />
                <ProductDetail />
                <Footer />
              </>
            }
          />

          <Route
            path="/cart"
            element={
              <>
                <Navbar />
                <Cart />
                <Footer />
              </>
            }
          />

          <Route
            path="/gallery"
            element={
              <>
                <Navbar />
                <GalleryList />
                <Footer />
              </>
            }
          />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/cars/new"
            element={
              <ProtectedRoute>
                <AddCar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/cars/edit/:id"
            element={
              <ProtectedRoute>
                <EditCar />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
