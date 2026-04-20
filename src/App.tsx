import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Restaurants from "./pages/Restaurants.jsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import ReviewOrder from "./ReviewOrder.jsx";
import Checkout from "./pages/Checkout.jsx";
import Game from "./pages/Game.tsx";
import "./styles/global.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/review-order" element={<ReviewOrder />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/game" element={<Game />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
