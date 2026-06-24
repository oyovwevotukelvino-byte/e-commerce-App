import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Footer from "./components/Footer";
import Login from "./components/Login";

import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  // ✅ FIX: define this OUTSIDE
  const handleLogin = (tok) => {
    setToken(tok);
    localStorage.setItem("token", tok);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  // ✅ Keep login simple
  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        {/* ✅ Only ONE Navbar */}
        <Navbar 
          setSearchTerm={setSearchTerm} 
          onLogout={handleLogout} 
        />

        <div className="main-content">
          <Routes>
            {/* ✅ Fixed route */}
            <Route
              path="/"
              element={<Products searchTerm={searchTerm} />}
            />

            <Route path="/cart" element={<Cart />} />

            <Route path="/checkout" element={<Checkout />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
    
      
  );
}

export default App;


