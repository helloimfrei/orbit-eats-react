import { Link } from "react-router-dom";
import { type Restaurant } from "../data/restaurants";

type Props = {
  restaurant: Restaurant;
  variant?: "featured";
};

export default function RestaurantCard({ restaurant, variant }: Props) {
  if (variant === "featured") {
    return (
      <div className="restaurant-card">
        <img
          className="restaurant-card-image"
          src={restaurant.image}
          alt={`${restaurant.name} restaurant interior`}
        />
        <div className="restaurant-card-info">
          <h3 className="restaurant-card-name">{restaurant.name}</h3>
          <p className="restaurant-card-meta">
            {restaurant.galaxy} &middot; {restaurant.distance} &middot;{" "}
            {restaurant.deliveryTime}
          </p>
          <span className="restaurant-card-tag">{restaurant.tag}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-card">
      <img
        className="restaurant-card-image"
        src={restaurant.image}
        alt={`${restaurant.name} restaurant interior`}
      />
      <div className="restaurant-card-body">
        <h3 className="restaurant-card-name">{restaurant.name}</h3>
        <p className="restaurant-card-cuisine">
          {restaurant.galaxy} &middot; {restaurant.cuisine}
        </p>
        <div className="restaurant-card-tags">
          <span className="restaurant-card-tag">{restaurant.distance}</span>
          <span className="restaurant-card-tag">{restaurant.deliveryTime}</span>
        </div>
        <Link to="#" className="restaurant-card-btn">
          View Menu
        </Link>
      </div>
    </div>
  );
}
