import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { CreditCard, Lock, CheckCircle, ShoppingBag } from "lucide-react";
import "../App.css";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

const handleCheckout = async () => {
  if (!email || !name) {
    alert("Please enter your email and name");
    return;
  }

  setLoading(true);

  try {
    const healthCheck = await fetch("/api/health");
    if (!healthCheck.ok) throw new Error("Server is not responding");

    const response = await fetch("/api/payment/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, amount: total, name }),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    const data = await response.json();
    console.log("Payment initialization response:", data);

    if (!window.PaystackPop) {
      alert("Payment system failed to load. Please refresh.");
      setLoading(false);
      return;
    }

    const handler = window.PaystackPop.setup({
      key: "pk_test_b0f1eeeeb674e53a61ff042c77e5127b5ff6626d", // public key
      email,
      amount: Math.round(total * 100), // convert to kobo
      currency: "NGN",
      ref: data.data.reference, // ensure backend returns this

      callback: function(response) {
        (async () => {
          try {
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: response.reference }),
            });
            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              setPaymentSuccess(true);
              clearCart();
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Verification failed.");
          }
          setLoading(false);
        })();
      },

      onClose: function() {
        setLoading(false);
        alert("Payment window closed.");
      },
    });

    handler.openIframe();
  } catch (error) {
    console.error("Payment error:", error);
    alert("Payment failed: " + error.message);
    setLoading(false);
  }
};

  if (cart.length === 0 && !paymentSuccess) {
    return (
      <div className="checkout-empty">
        <ShoppingBag size={64} />
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart to proceed to checkout</p>
        <button className="continue-shopping-btn" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="payment-success">
        <div className="success-content">
          <CheckCircle size={80} className="success-icon" />
          <h2>Payment Successful!</h2>
          <p>Thank you for your order. Your payment has been processed successfully.</p>
          <p className="order-message">You will receive a confirmation email shortly.</p>
          <button className="continue-shopping-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h2><CreditCard size={24} /> Checkout</h2>
        
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="checkout-input"
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="checkout-input"
          />
        </div>

        <div className="secure-notice">
          <Lock size={16} />
          <span>Your payment is secured with Paystack</span>
        </div>
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <span className="item-name">{item.title.substring(0, 30)}...</span>
                <span className="item-qty">x{item.quantity}</span>
              </div>
              <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="summary-divider"></div>

        <div className="summary-row">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span>Shipping</span>
          <span className="free-shipping">FREE</span>
        </div>

        <div className="summary-divider"></div>

        <div className="summary-total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button 
          className="pay-button" 
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <span className="loading-spinner"></span>
          ) : (
            <>
              <CreditCard size={18} />
              Pay ${total.toFixed(2)}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
