import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RestaurantCard from "../components/RestaurantCard";
import restaurants from "../data/restaurants";
import "../styles/home.css";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const featuredRestaurants = restaurants.slice(0, 4);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/restaurants");
  };

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <span className="hero-badge">Powered by FSPS</span>
        <div className="hero-content">
          <h1 className="hero-headline">Food Delivered at Light Speed</h1>
          <p className="hero-subheadline">Order from across the universe</p>
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              className="hero-search-input"
              placeholder="Enter your galaxy / address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="hero-search-btn">
              Find Food
            </button>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="features-item">
          <div className="features-icon"></div>
          <span className="features-label">Light-speed delivery</span>
        </div>
        <div className="features-item">
          <div className="features-icon"></div>
          <span className="features-label">Galaxies of cuisines</span>
        </div>
        <div className="features-item">
          <div className="features-icon"></div>
          <span className="features-label">Safe for all species</span>
        </div>
        <div className="features-item">
          <div className="features-icon"></div>
          <span className="features-label">FSPS-trusted infrastructure</span>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="featured">
        <div className="featured-header">
          <h2 className="featured-title">Featured Restaurants</h2>
          <Link to="/restaurants" className="featured-view-all">
            View all &rarr;
          </Link>
        </div>
        <div className="featured-grid">
          {featuredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              variant="featured"
            />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo">
        <div className="promo-text">
          <h2 className="promo-title">Promo: First Order Free</h2>
          <p className="promo-subtitle">Use code ORBIT at checkout</p>
        </div>
        <Link to="/restaurants" className="promo-btn">
          Order Now
        </Link>
      </section>
    </main>
  );
}
