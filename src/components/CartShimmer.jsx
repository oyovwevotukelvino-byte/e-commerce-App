import { Skeleton } from 'primereact/skeleton'; // fallback CSS shimmer in App.css

const CartShimmer = () => (
  <div className="cart-item-card shimmer">
    <div className="cart-item-image">
      <div className="skeleton-image"></div>
    </div>
    <div className="cart-item-details">
      <div className="skeleton-title"></div>
      <div className="skeleton-price"></div>
      <div className="quantity-controls">
        <div className="skeleton-qty-btn"></div>
        <div className="skeleton-qty"></div>
        <div className="skeleton-qty-btn"></div>
      </div>
    </div>
    <div className="skeleton-total"></div>
  </div>
);

export default CartShimmer;

