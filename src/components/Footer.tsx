import { Link } from "react-router-dom";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <span className="footer-brand">ORBIT EATS</span>
      <div className="footer-links">
        <Link to="/about">About</Link>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <Link to="/contact">Contact</Link>
      </div>
    </footer>
  );
}
