import React, { useState } from "react";
import { LucideShoppingCart } from "lucide-react";

function Navbar({ setSearchTerm, onCartClick }) {
  const [inputValue, setInputValue] = useState("");
  

  
  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchTerm(value); 
  };

  
  const handleSearch = () => {
    setSearchTerm(inputValue.trim());
  };

  return (
    <nav className="navbar">

      <p>ShopEasy</p>
      <p>BuyNow</p>
      <p>Digital Mall</p>
      <LucideShoppingCart className="cart-icon" onClick={onCartClick}/>

      <input
        type="text"
        placeholder="Search products..."
        value={inputValue}
        onChange={handleChange}
      />
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
      <button className="logout-button" onClick={() => {
  localStorage.removeItem("token");
  window.location.reload(); // simple way to reset
}}>
  Logout
</button>

    </nav>
  );
}

export default Navbar;