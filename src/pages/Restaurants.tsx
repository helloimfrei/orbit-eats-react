import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchRestaurantMeta, fetchRestaurants, type Restaurant, type RestaurantFilters } from "../api";
import RestaurantCard from "../components/RestaurantCard";
import "../styles/restaurants.css";

const PAGE_SIZE = 12;

type RestaurantRequestState = {
  queryKey: string | null;
  restaurants: Restaurant[];
  error: string;
};

export default function Restaurants() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const selectedGalaxy = searchParams.get("galaxy") || "";
  const selectedCuisine = searchParams.get("cuisine") || "";
  const selectedTag = searchParams.get("tag") || "";
  const selectedDistance = searchParams.get("maxDistance") || "";
  const selectedDelivery = searchParams.get("maxDelivery") || "";
  const selectedSort = searchParams.get("sort") || "recommended";
  const [requestState, setRequestState] = useState<RestaurantRequestState>({
    queryKey: null,
    restaurants: [],
    error: "",
  });
  const [filterOptions, setFilterOptions] = useState({
    galaxies: [] as string[],
    cuisines: [] as string[],
    tags: [] as string[],
  });
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const requestFilters: RestaurantFilters = useMemo(() => ({
    search: searchQuery,
    galaxy: selectedGalaxy,
    cuisine: selectedCuisine,
    tag: selectedTag,
    maxDistance: selectedDistance,
    maxDelivery: selectedDelivery,
    sort: selectedSort,
  }), [
    searchQuery,
    selectedGalaxy,
    selectedCuisine,
    selectedTag,
    selectedDistance,
    selectedDelivery,
    selectedSort,
  ]);
  const requestKey = useMemo(() => JSON.stringify(requestFilters), [requestFilters]);

  useEffect(() => {
    let active = true;

    fetchRestaurantMeta()
      .then((meta) => {
        if (active) setFilterOptions(meta);
      })
      .catch(() => {
        if (active) setFilterOptions({ galaxies: [], cuisines: [], tags: [] });
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    fetchRestaurants(requestFilters)
      .then((data) => {
        if (!active) return;
        setRequestState({ queryKey: requestKey, restaurants: data, error: "" });
      })
      .catch((requestError) => {
        if (!active) return;
        setRequestState({
          queryKey: requestKey,
          restaurants: [],
          error: requestError instanceof Error
            ? requestError.message
            : "Restaurants failed to load.",
        });
      });

    return () => {
      active = false;
    };
  }, [requestFilters, requestKey]);

  const restaurants = requestState.restaurants;
  const isLoading = requestState.queryKey !== requestKey;
  const error = requestState.error;
  const pageCount = Math.max(1, Math.ceil(restaurants.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const visibleRestaurants = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return restaurants.slice(start, start + PAGE_SIZE);
  }, [safeCurrentPage, restaurants]);

  const updateFilter = (key: string, value: string) => {
    setCurrentPage(1);
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    if (key !== "sort" && nextParams.get("sort") === "recommended") {
      nextParams.delete("sort");
    }

    setSearchParams(nextParams);
  };

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
            onChange={(e) => updateFilter("q", e.target.value)}
          />
        </div>
      </section>

      {/* Filters */}
      <section className="filters">
        <div className="filters-left">
          <span className="filters-label">Filters:</span>
          <select
            className="filter-select"
            value={selectedGalaxy}
            onChange={(event) => updateFilter("galaxy", event.target.value)}
            aria-label="Filter by galaxy"
          >
            <option value="">All galaxies</option>
            {filterOptions.galaxies.map((galaxy) => (
              <option value={galaxy} key={galaxy}>{galaxy}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={selectedCuisine}
            onChange={(event) => updateFilter("cuisine", event.target.value)}
            aria-label="Filter by cuisine"
          >
            <option value="">All cuisines</option>
            {filterOptions.cuisines.map((cuisine) => (
              <option value={cuisine} key={cuisine}>{cuisine}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={selectedTag}
            onChange={(event) => updateFilter("tag", event.target.value)}
            aria-label="Filter by tag"
          >
            <option value="">All tags</option>
            {filterOptions.tags.map((tag) => (
              <option value={tag} key={tag}>{tag}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={selectedDistance}
            onChange={(event) => updateFilter("maxDistance", event.target.value)}
            aria-label="Filter by distance"
          >
            <option value="">Any distance</option>
            <option value="1">Within 1 ly</option>
            <option value="2">Within 2 ly</option>
            <option value="3">Within 3 ly</option>
            <option value="4">Within 4 ly</option>
          </select>
          <select
            className="filter-select"
            value={selectedDelivery}
            onChange={(event) => updateFilter("maxDelivery", event.target.value)}
            aria-label="Filter by delivery time"
          >
            <option value="">Any delivery time</option>
            <option value="25">25 min or less</option>
            <option value="35">35 min or less</option>
            <option value="45">45 min or less</option>
          </select>
        </div>
        <select
          className="sort-select"
          value={selectedSort}
          onChange={(event) => updateFilter("sort", event.target.value)}
          aria-label="Sort restaurants"
        >
          <option value="recommended">Sort: Recommended</option>
          <option value="rating">Sort: Rating</option>
          <option value="deliveryFee">Sort: Delivery fee</option>
          <option value="distance">Sort: Distance</option>
          <option value="deliveryTime">Sort: Delivery time</option>
          <option value="name">Sort: Name</option>
        </select>
      </section>

      {/* Results Bar */}
      <section className="results-bar">
        <span className="results-count">
          {isLoading
            ? "Loading restaurants..."
            : `Showing ${visibleRestaurants.length} of ${restaurants.length} restaurants`}
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
        {error ? (
          <p className="restaurant-state">{error}</p>
        ) : visibleRestaurants.length > 0 ? (
          visibleRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))
        ) : (
          <p className="restaurant-state">
            {isLoading ? "Loading..." : "No restaurants matched your search."}
          </p>
        )}
      </section>

      {/* Pagination */}
      <nav className="pagination">
        <button
          className="page-btn page-arrow"
          disabled={safeCurrentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          &lsaquo;
        </button>
        {Array.from({ length: Math.min(pageCount, 5) }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            className={`page-btn${safeCurrentPage === page ? " active" : ""}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        {pageCount > 5 && <span className="page-ellipsis">&hellip;</span>}
        <button
          className="page-btn page-arrow"
          disabled={safeCurrentPage === pageCount}
          onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
        >
          &rsaquo;
        </button>
      </nav>
    </main>
  );
}
