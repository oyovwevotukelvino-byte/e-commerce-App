import React, { useState, useEffect } from "react";
import "../App.css";

function Products({ searchTerm }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Dynamic addToCart
  const addToCart = (productId) => {
    const token = localStorage.getItem("token");

    fetch("https://fakestoreapi.com/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: 1, // test user
        date: new Date(),
        products: [{ productId, quantity: 1 }], // ✅ use clicked productId
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Cart updated:", data);
        alert(`Product ${productId} added to cart!`);
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="products">
      {filteredProducts.map((product) => (
        <div key={product.id} className="product">
          <h2>{product.title}</h2>
          <img src={product.image} alt={product.title} />
          <p>{product.description}</p>
          <p><strong>${product.price}</strong></p>
          {/* ✅ Add to Cart button */}
          <button onClick={() => addToCart(product.id)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default Products;