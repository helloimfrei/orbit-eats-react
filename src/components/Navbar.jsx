import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <Link to="/restaurants" onClick={() => setOpen(false)}>Restaurants</Link>
        <Link to="/about" onClick={() => setOpen(false)}>About</Link>
        <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
        <Link to="/review-order" onClick={() => setOpen(false)}>Review Order</Link>
        <Link to="/checkout" onClick={() => setOpen(false)}>Checkout</Link>
      </div>

      <Link to="#" className="navbar-auth-btn">
        Sign Up / Log In
      </Link>
    </nav>
  );
}
