import { Navigate, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import Home from "./pages/Home.tsx";
import Restaurants from "./pages/Restaurants.tsx";
import RestaurantDetail from "./pages/RestaurantDetail.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import ReviewOrder from "./ReviewOrder.tsx";
import Auth from "./pages/Auth.tsx";
import OrderSubmitted from "./pages/OrderSubmitted.tsx";
import Game from "./pages/Game.tsx";
import "./styles/global.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/review-order" element={<ReviewOrder />} />
        <Route path="/checkout" element={<Navigate to="/review-order" replace />} />
        <Route path="/order-submitted" element={<OrderSubmitted />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/game" element={<Game />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
