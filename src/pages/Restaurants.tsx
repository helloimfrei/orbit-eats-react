import { useState } from "react";
import RestaurantCard from "../components/RestaurantCard";
import restaurants from "../data/restaurants";
import "../styles/restaurants.css";

export default function Restaurants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.galaxy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main>
      {/* Browse Header */}
      <section className="browse-header">
        <h1 className="browse-title">Browse Restaurants</h1>
        <div className="browse-search">
          <span className="browse-search-icon">&#9906;</span>
          <input
            type="text"
            className="browse-search-input"
            placeholder="Search restaurants, cuisines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Filters */}
      <section className="filters">
        <div className="filters-left">
          <span className="filters-label">Filters:</span>
          <button className="filter-btn">
            Solar System <span className="filter-arrow">&#9662;</span>
          </button>
          <button className="filter-btn">
            Galaxy <span className="filter-arrow">&#9662;</span>
          </button>
          <button className="filter-btn">
            Distance (light-yrs) <span className="filter-arrow">&#9662;</span>
          </button>
          <button className="filter-btn">
            Delivery Time <span className="filter-arrow">&#9662;</span>
          </button>
          <button className="filter-btn">
            Cuisine Type <span className="filter-arrow">&#9662;</span>
          </button>
        </div>
        <button className="sort-btn">
          Sort: Recommended <span className="filter-arrow">&#9662;</span>
        </button>
      </section>

      {/* Results Bar */}
      <section className="results-bar">
        <span className="results-count">
          Showing {filteredRestaurants.length} restaurants
        </span>
        <div className="view-toggle">
          <button
            className={`view-btn${viewMode === "grid" ? " active" : ""}`}
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            &#9638;&#9638;
          </button>
          <button
            className={`view-btn${viewMode === "list" ? " active" : ""}`}
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            &#9776;
          </button>
        </div>
      </section>

      {/* Restaurant Grid */}
      <section
        className={`restaurant-grid${viewMode === "list" ? " list-view" : ""}`}
      >
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </section>

      {/* Pagination */}
      <nav className="pagination">
        <button
          className="page-btn page-arrow"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          &lsaquo;
        </button>
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            className={`page-btn${currentPage === page ? " active" : ""}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <span className="page-ellipsis">&hellip;</span>
        <button
          className={`page-btn${currentPage === 12 ? " active" : ""}`}
          onClick={() => setCurrentPage(12)}
        >
          12
        </button>
        <button
          className="page-btn page-arrow"
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          &rsaquo;
        </button>
      </nav>
    </main>
  );
}
