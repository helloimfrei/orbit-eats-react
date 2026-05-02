import { Link, useLocation } from "react-router-dom";
import "../styles/order-submitted.css";

type OrderSubmittedState = {
  orderId?: number;
  total?: number;
  store?: string;
  email?: string;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function OrderSubmitted() {
  const location = useLocation();
  const state = (location.state || {}) as OrderSubmittedState;

  return (
    <main className="order-submitted-page">
      <section className="order-submitted-panel">
        <div className="order-submitted-mark">✓</div>
        <h1>Order Submitted</h1>
        <p>
          {state.store
            ? `Your order from ${state.store} is in the kitchen.`
            : "Your order is in the kitchen."}
        </p>

        <div className="order-submitted-summary">
          <div>
            <span>Order</span>
            <strong>{state.orderId ? `#${state.orderId}` : "Pending"}</strong>
          </div>
          <div>
            <span>Total</span>
            <strong>{formatCurrency(state.total || 0)}</strong>
          </div>
          <div>
            <span>Receipt</span>
            <strong>{state.email || "guest@orbiteats.local"}</strong>
          </div>
        </div>

        <div className="order-submitted-actions">
          <Link to="/restaurants">Browse More Food</Link>
          <Link to="/">Home</Link>
        </div>
      </section>
    </main>
  );
}
