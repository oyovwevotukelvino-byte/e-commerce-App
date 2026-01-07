import { useState } from "react";
import Navbar from "./components/Navbar";
import Products from "./components/Products";
import Footer from "./components/Footer";
import Login from "./components/Login";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [showCart, setShowCart] = useState(false); // ✅ new state

  if (!token) {
    return (
      <Login
        onLogin={(tok) => {
          setToken(tok);
          localStorage.setItem("token", tok);
        }}
      />
    );
  }

  return (
    <div className="App">
      <Navbar
        setSearchTerm={setSearchTerm}
        onCartClick={() => setShowCart(!showCart)} // ✅ toggle cart
      />

      {showCart ? (
        <div className="cart">
          <h2>Your Cart</h2>
          <p>Cart items will be displayed here...</p>
        </div>
      ) : (
        <Products searchTerm={searchTerm} />
      )}

      <Footer />
    </div>
  );
}

export default App;