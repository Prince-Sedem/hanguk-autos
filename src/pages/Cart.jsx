import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Generate WhatsApp message
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Format cart items into a message
    const message = cart
      .map((item, index) => `${index + 1}. ${item.name} - ₵${item.price} x ${item.quantity}`)
      .join("\n");

    // WhatsApp number (Replace with actual WhatsApp number)
    const phoneNumber = "+233247552111";

    // Full WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      `Hello, I want to purchase:\n\n${message}\n\nTotal: ₵${totalPrice}`
    )}`;

    // Redirect to WhatsApp
    window.location.href = whatsappUrl;
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b py-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
              <div>
                <h2 className="text-lg font-bold">{item.name}</h2>
                <p className="text-gray-600">₵{item.price} x {item.quantity}</p>
                <div className="flex mt-2">
                  <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 bg-gray-300 rounded-l">-</button>
                  <span className="px-4">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 bg-gray-300 rounded-r">+</button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-600">Remove</button>
            </div>
          ))}

          <div className="text-right mt-4">
            <h2 className="text-xl font-bold">Total: ₵{totalPrice}</h2>
            <button
              onClick={handleCheckout}
              className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;