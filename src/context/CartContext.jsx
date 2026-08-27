import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const CartContext = createContext();

// Custom Hook
export const useCart = () => useContext(CartContext);

// Provider Component
export const CartProvider = ({ children }) => {
  // Load cart from localStorage when the app starts
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("hanguk-cart");

      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  });

  // Save cart whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("hanguk-cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [cart]);

  // --------------------------------------------------
  // ADD TO CART
  // --------------------------------------------------

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,

          // Make sure price remains a number
          price: Number(product.price) || 0,

          quantity: 1,
        },
      ];
    });
  };

  // --------------------------------------------------
  // REMOVE FROM CART
  // --------------------------------------------------

  const removeFromCart = (id) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== id)
    );
  };

  // --------------------------------------------------
  // UPDATE QUANTITY
  // --------------------------------------------------

  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                item.quantity + amount
              ),
            }
          : item
      )
    );
  };

  // --------------------------------------------------
  // CLEAR CART
  // --------------------------------------------------

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};