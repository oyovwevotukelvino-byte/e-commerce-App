import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../App.css";

// Helper function to get category color
const getCategoryColor = (category) => {
  const colors = {
    smartphones: "#3498db",
    laptops: "#e74c3c",
    fragrances: "#9b59b6",
    skincare: "#e91e63",
    groceries: "#2ecc71",
    "home-decoration": "#ff9800",
    furniture: "#795548",
    tops: "#00bcd4",
    sunglasses: "#607d8b",
    automotive: "#9c27b0",
  };
  return colors[category] || "#34495e";
};

// Star Rating Component
const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<span key={i} className="star filled">★</span>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<span key={i} className="star half">★</span>);
    } else {
      stars.push(<span key={i} className="star">★</span>);
    }
  }
  return <div className="rating">{stars}</div>;
};

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="product-skeleton">
    <div className="skeleton-image"></div>
    <div className="skeleton-title"></div>
    <div className="skeleton-price"></div>
    <div className="skeleton-button"></div>
  </div>
);

function Products({ searchTerm }) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const productsPerPage = 8;
  const { addToCart } = useContext(CartContext);

  // Fetch categories on mount
  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  // Fetch products based on filters
  useEffect(() => {
    setLoading(true);
    
    let apiUrl = "https://dummyjson.com/products";
    
    // Apply category filter
    if (selectedCategory !== "all") {
      apiUrl = `https://dummyjson.com/products/category/${selectedCategory}`;
    }
    
    // Apply search
    if (searchTerm) {
      apiUrl = `https://dummyjson.com/products/search?q=${searchTerm}&limit=100`;
    }
    
    // Add limit for pagination
    apiUrl += `?limit=100`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        let fetchedProducts = data.products || [];
        
        // Apply sorting
        fetchedProducts = fetchedProducts.sort((a, b) => {
          if (sortOrder === "asc") {
            return a.price - b.price;
          } else {
            return b.price - a.price;
          }
        });
        
        setProducts(fetchedProducts);
        setTotalProducts(fetchedProducts.length);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [selectedCategory, searchTerm, sortOrder]);

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="products-container">
      {/* Category Filter */}
      <div className="products-filter">
        <div className="category-filter">
          <button 
            className={`category-btn ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => handleCategoryChange("all")}
          >
            All
          </button>
          {categories.slice(0, 6).map((category) => (
            <button
              key={category.slug}
              className={`category-btn ${selectedCategory === category.slug ? "active" : ""}`}
              onClick={() => handleCategoryChange(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="sort-filter">
          <label htmlFor="sort">Sort by:</label>
          <select id="sort" value={sortOrder} onChange={handleSortChange}>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="products-grid">
          {[...Array(8)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : currentProducts.length === 0 ? (
        <div className="no-results">
          <h2>No products found</h2>
          <p>Try adjusting your search term or category</p>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {currentProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <span 
                    className="category-badge" 
                    style={{ backgroundColor: getCategoryColor(product.category) }}
                  >
                    {product.category}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="discount-badge">
                      -{Math.round(product.discountPercentage)}%
                    </span>
                  )}
                  <img 
                    src={product.thumbnail} 
                    alt={product.title} 
                    className="product-image"
                  />
                </div>
                <div className="product-content">
                  <p className="product-brand">{product.brand}</p>
                  <h3 className="product-title">{product.title}</h3>
                  <div className="product-rating">
                    <StarRating rating={product.rating || 0} />
                    <span className="rating-count">({product.reviews?.length || 0})</span>
                  </div>
                  <p className="product-description">
                    {product.description && product.description.length > 80 
                      ? product.description.substring(0, 80) + "..." 
                      : product.description}
                  </p>
                  <div className="product-footer">
                    <div className="price-container">
                      <p className="product-price">
                        <span className="currency">$</span>
                        {product.price.toFixed(2)}
                      </p>
                      {product.originalPrice && (
                        <p className="original-price">
                          ${product.originalPrice?.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="stock-info">
                      {product.stock > 0 ? (
                        <span className="in-stock">In Stock ({product.stock})</span>
                      ) : (
                        <span className="out-of-stock">Out of Stock</span>
                      )}
                    </div>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <span className="cart-icon">🛒</span>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="pagination-dots">...</span>;
                }
                return null;
              })}
              
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
          
          <div className="products-count">
            Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)} of {products.length} products
          </div>
        </>
      )}
    </div>
  );
}

export default Products;

