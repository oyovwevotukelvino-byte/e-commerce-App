import { useState, useContext } from "react";
import { ShoppingCart, Search, Package, User, Menu, X } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

import "../App.css";

function Navbar({ setSearchTerm, onLogout }) {
  const [inputValue, setInputValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  // Handle typing in search
  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchTerm(value);
  };

  // Handle search click
  const handleSearch = () => {
    setSearchTerm(inputValue.trim());
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-brand" onClick={() => navigate("/")}>
        <Package className="brand-icon" />
        <span className="brand-name">ShopEasy</span>
      </div>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Search Bar */}
      <div className={`navbar-search ${mobileMenuOpen ? "mobile-hidden" : ""}`}>
        <input
          type="text"
          placeholder="Search products..."
          value={inputValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className="search-input"
        />
        <button className="search-button" onClick={handleSearch}>
          <Search size={18} />
        </button>
      </div>

      {/* Right Actions */}
      <div className={`navbar-actions ${mobileMenuOpen ? "mobile-active" : ""}`}>
        {/* Cart */}
        <div className="cart-container" onClick={() => navigate("/cart")}>
          <ShoppingCart className="cart-icon" />
          {cart.length > 0 && (
            <span className="cart-count">{cart.length}</span>
          )}
        </div>

        {/* Logout */}
        <button className="logout-button" onClick={onLogout}>
          <User size={16} />
          <span className="logout-text">Logout</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {/* Mobile Search */}
          <div className="mobile-search">
            <input
              type="text"
              placeholder="Search products..."
              value={inputValue}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="mobile-search-input"
            />
            <button className="search-button" onClick={handleSearch}>
              <Search size={18} />
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="mobile-nav-actions">
            <div
              className="mobile-cart-container"
              onClick={() => {
                navigate("/cart");
                setMobileMenuOpen(false);
              }}
            >
              <ShoppingCart className="cart-icon" />
              <span className="mobile-cart-text">Cart</span>
              {cart.length > 0 && (
                <span className="cart-count">{cart.length}</span>
              )}
            </div>

            <button
              className="mobile-logout-button"
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
            >
              <User size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;