import { useCart } from "../context/CartContext";

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US").format(
    Number(value) || 0
  );

function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  // --------------------------------------------------
  // TOTAL PRICE
  // --------------------------------------------------

  const totalPrice = cart.reduce(
    (total, item) =>
      total +
      (Number(item.price) || 0) *
        item.quantity,
    0
  );

  // --------------------------------------------------
  // WHATSAPP CHECKOUT
  // --------------------------------------------------

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const message = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} - ₵${formatNumber(
            item.price
          )} x ${item.quantity}`
      )
      .join("\n");

    const phoneNumber = "233247552111";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      `Hello, I want to purchase the following vehicle(s):\n\n${message}\n\nTotal: ₵${formatNumber(
        totalPrice
      )}\n\nPlease provide me with more information about the purchase and shipping.`
    )}`;

    window.location.href = whatsappUrl;
  };

  // --------------------------------------------------
  // EMPTY CART
  // --------------------------------------------------

  if (cart.length === 0) {
    return (
      <div className="min-h-screen p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Shopping Cart
        </h1>

        <div className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-lg text-center">
          <p className="text-gray-600">
            Your cart is empty.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // CART
  // --------------------------------------------------

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Shopping Cart
      </h1>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">

        {/* CART ITEMS */}

        <div className="divide-y divide-gray-200">
          {cart.map((item) => {
            const image =
              item.main_image ||
              item.images?.[0] ||
              item.image ||
              "";

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 py-5"
              >

                {/* IMAGE */}

                <div className="w-full sm:w-24 h-20 shrink-0">
                  {image ? (
                    <img
                      src={image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* DETAILS */}

                <div className="flex-grow">
                  <h2 className="text-lg font-bold text-gray-800">
                    {item.name}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    Buying and Shipping - ₵
                    {formatNumber(item.price)}
                  </p>

                  {/* QUANTITY */}

                  <div className="flex items-center mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, -1)
                      }
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-l"
                    >
                      -
                    </button>

                    <span className="px-4 py-1 border-t border-b border-gray-200">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, 1)
                      }
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ITEM TOTAL */}

                <div className="text-left sm:text-right">
                  <p className="font-semibold text-gray-800">
                    ₵
                    {formatNumber(
                      (Number(item.price) || 0) *
                        item.quantity
                    )}
                  </p>

                  <button
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    className="text-red-600 hover:text-red-700 text-sm mt-2"
                  >
                    Remove
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* SUMMARY */}

        <div className="border-t border-gray-200 mt-5 pt-5">

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-700">
              Total
            </span>

            <span className="text-2xl font-bold text-gray-900">
              ₵{formatNumber(totalPrice)}
            </span>
          </div>

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-3 mt-5">

            <button
              onClick={clearCart}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Clear Cart
            </button>

            <button
              onClick={handleCheckout}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
            >
              Proceed to Checkout via WhatsApp
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;