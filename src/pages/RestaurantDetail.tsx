import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchRestaurant, type Restaurant } from "../api";
import { addToCart } from "../cart";
import "../styles/restaurant-detail.css";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    let active = true;

    if (!id) {
      return undefined;
    }

    fetchRestaurant(id)
      .then((data) => {
        if (!active) return;
        setRestaurant(data);
        setError("");
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : "Restaurant not found.");
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <main className="restaurant-detail-page">
        <section className="restaurant-detail-state">
          <h1>{error}</h1>
          <Link to="/restaurants">Back to restaurants</Link>
        </section>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="restaurant-detail-page">
        <section className="restaurant-detail-state">
          <h1>Loading restaurant...</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="restaurant-detail-page">
      <section className="restaurant-detail-hero">
        <img
          src={restaurant.image}
          alt={`${restaurant.name} restaurant interior`}
          className="restaurant-detail-image"
        />
        <div className="restaurant-detail-summary">
          <Link to="/restaurants" className="restaurant-detail-back">
            Back to restaurants
          </Link>
          <h1>{restaurant.name}</h1>
          <p className="restaurant-detail-description">{restaurant.description}</p>
          <div className="restaurant-detail-tags">
            <span>{restaurant.cuisine}</span>
            <span>{restaurant.galaxy}</span>
            <span>{restaurant.rating.toFixed(1)} stars</span>
            <span>{restaurant.distance}</span>
            <span>{restaurant.deliveryTime}</span>
            <span>{formatCurrency(restaurant.deliveryFee)} delivery</span>
          </div>
          <p className="restaurant-detail-address">{restaurant.address}</p>
          {cartMessage && <p className="restaurant-cart-message">{cartMessage}</p>}
          <Link to="/review-order" className="restaurant-detail-cta">
            View Cart
          </Link>
        </div>
      </section>

      <section className="restaurant-menu">
        <div className="restaurant-menu-header">
          <h2>Popular items</h2>
          <span>{restaurant.menuItems.length} items</span>
        </div>
        <div className="restaurant-menu-grid">
          {restaurant.menuItems.map((item) => (
            <article className="restaurant-menu-item" key={item.name}>
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <div className="restaurant-menu-actions">
                <strong>{formatCurrency(item.price)}</strong>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(restaurant, item);
                    setCartMessage(`${item.name} added to cart.`);
                  }}
                >
                  Add
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
