import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clearAuth, getStoredUser, type AuthUser } from "../api";
import { CART_EVENT, getCartItemCount } from "../cart";
import "../styles/navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [cartCount, setCartCount] = useState(() => getCartItemCount());

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());

    window.addEventListener("storage", syncUser);
    window.addEventListener("orbit-auth-change", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("orbit-auth-change", syncUser);
    };
  }, []);

  useEffect(() => {
    const syncCart = () => setCartCount(getCartItemCount());

    window.addEventListener("storage", syncCart);
    window.addEventListener(CART_EVENT, syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener(CART_EVENT, syncCart);
    };
  }, []);

  const closeMenu = () => setOpen(false);
  const handleLogout = () => {
    clearAuth();
    closeMenu();
  };

  return (
    <nav className={`navbar${open ? " open" : ""}`}>
      <Link to="/" className="navbar-logo">
        ORBIT EATS
      </Link>

      <button
        className="navbar-toggle"
        aria-label="Toggle menu"
        onClick={() => setOpen(!open)}
      >
        &#9776;
      </button>

      <div className="navbar-links">
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/restaurants" onClick={closeMenu}>Restaurants</Link>
        <Link to="/about" onClick={closeMenu}>About</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>
        <Link to="/review-order" onClick={closeMenu}>
          Cart{cartCount > 0 ? ` (${cartCount})` : ""}
        </Link>
        <Link to="/game" onClick={closeMenu}>Game</Link>
      </div>

      {user ? (
        <button className="navbar-auth-btn" type="button" onClick={handleLogout}>
          {user.name} / Log Out
        </button>
      ) : (
        <Link to="/auth" className="navbar-auth-btn" onClick={closeMenu}>
          Sign Up / Log In
        </Link>
      )}
    </nav>
  );
}
