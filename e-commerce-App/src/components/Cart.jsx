import { useContext, useState, useEffect, useMemo } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

function Cart() {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [taxRate] = useState(0.08);
  const [imageErrors, setImageErrors] = useState({});

  const fallbackImage = "https://via.placeholder.com/150?text=No+Image";

  // ✅ Load promo from localStorage
  useEffect(() => {
    const savedPromo = localStorage.getItem("promoDiscount");
    if (savedPromo) {
      setPromoDiscount(Number(savedPromo));
      setPromoMessage("✅ Promo restored!");
    }
  }, []);

  // ✅ Save promo
  useEffect(() => {
    if (promoDiscount > 0) {
      localStorage.setItem("promoDiscount", promoDiscount);
    }
  }, [promoDiscount]);

  // ✅ Optimized calculations
  const subtotal = useMemo(() => 
    cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
  [cart]);

  const tax = useMemo(() => subtotal * taxRate, [subtotal]);

  const discount = useMemo(() => 
    subtotal * (promoDiscount / 100),
  [subtotal, promoDiscount]);

  const grandTotal = useMemo(() => 
    subtotal + tax - discount,
  [subtotal, tax, discount]);

  // ✅ Promo logic
  const applyPromo = () => {
    if (promoDiscount > 0) return;

    if (promoCode.toUpperCase() === "SAVE10") {
      setPromoDiscount(10);
      setPromoMessage("✅ Promo applied!");
    } else {
      setPromoMessage("❌ Invalid code");
    }
  };

  const toggleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const maxStock = (item) => item.stock || 99;

  if (cart.length === 0) {
    return (
      <div className="cart-empty-enhanced">
        <div className="empty-animation">
          <ShoppingBag size={80} className="cart-empty-icon" />
        </div>
        <h2>Your cart is empty</h2>
        <p>Discover amazing products and add them to your cart!</p>

        <div className="empty-suggestions">
          <button style={{ marginRight: "10px" }}onClick={() => navigate("/")}>
            🛍️ Browse Products
          </button>
          <button onClick={() => navigate("/products")}>
            Featured Deals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container-page">
      <div className="cart-header">
        <h2>🛒 Your Shopping Cart</h2>
        <span>{cart.length} items</span>
      </div>

      <div className="cart-content">

        {/* 🛍️ ITEMS */}
        <div className="cart-items-list">
          {cart.map((item) => {
            const itemTotal = item.price * item.quantity;
            const isLowStock = item.stock && (item.stock - item.quantity <= 5);

            return (
              <div key={item.id} className="cart-item-card">

                <div className="cart-item-image">
                  <img
                    src={imageErrors[item.id] ? fallbackImage : (item.thumbnail || item.image)}
                    alt={item.title}
                    onError={() => toggleImageError(item.id)}
                  />
                  {isLowStock && <span className="low-stock-badge">Low Stock</span>}
                </div>

                <div className="cart-item-details">
                  <h3>{item.title.substring(0, 50)}...</h3>
                  <p>${Number(item.price).toFixed(2)}</p>

                  {item.stock !== undefined && (
                    <span>
                      {item.stock - item.quantity} left
                    </span>
                  )}

                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>

                      <span style={{ marginRight: "10px" }}>{item.quantity}</span>

                      <button
                        style={{ marginRight: "10px" }}
                        onClick={() => increaseQty(item.id)}
                        disabled={item.quantity >= maxStock(item)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button style={{ marginTop: "10px" }} onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  ${itemTotal.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* 🧾 SUMMARY */}
        <div className="cart-summary">
          <h3>Order Summary</h3>

          {/* Promo */}
          <div className="promo-section">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button onClick={applyPromo} disabled={promoDiscount > 0}>
              {promoDiscount > 0 ? "Applied!" : "Apply"}
            </button>
          </div>

          {promoMessage && (
            <p className="promo-message">{promoMessage}</p>
          )}

          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {promoDiscount > 0 && (
            <div className="cart-summary-row">
              <span>Discount ({promoDiscount}%)</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>FREE</span>
          </div>

          <div className="cart-summary-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <hr />

          <div className="cart-summary-total">
            <strong>Total</strong>
            <strong>${grandTotal.toFixed(2)}</strong>
          </div>

          {/* 🚚 Delivery */}
          <p className="delivery-info">
            🚚 Delivery in 2–4 days
          </p>

          <button  onClick={() => navigate("/checkout")}>
            Proceed to Checkout (${grandTotal.toFixed(2)})
          </button>

          <button style = {{ marginLeft: "10px" }}onClick={() => navigate("/")}>
            ← Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}

export default Cart;