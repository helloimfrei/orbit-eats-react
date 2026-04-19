import { useState, useEffect } from "react";

import "./styles/global.css";
import "./styles/checkout.css";
import "./styles/review-order.css";

export default function ReviewOrder() {
  const order = {
    store: "Orbit Diner",
    address: "123 Orbit Ave, Houston, TX 77002",
    phone: "(281) 555-4821",
    payment: "Visa ending in 8267",
    items: [
      { name: "Galactic Burger", price: 23.0, quantity: 1 },
      { name: "Moon Fries", price: 6.5, quantity: 1 },
      { name: "Nebula Soda", price: 4.5, quantity: 1 },
    ],
    tax: 2.81,
    serviceFee: 1.75,
    deliveryFee: 3.49,
    originalDeliveryFee: 3.49,
    savings: 0,
  };

  const [tip, setTip] = useState(5.1);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sub = order.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    setSubtotal(sub);

    const final =
      sub +
      order.tax +
      order.serviceFee +
      order.deliveryFee +
      tip;

    setTotal(final);
  }, [tip]);

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <h1 className="checkout-page-title">Review Order</h1>
      </header>

      <div className="checkout-grid">

        {/* LEFT SIDE */}
        <div className="checkout-main">

          {/* DELIVER TO */}
          <section className="checkout-card">
            <div className="card-header">
              <h2>Deliver to</h2>
              <span className="link">Pickup instead</span>
            </div>

            <div className="map-placeholder">📍 Map Preview</div>

            <div className="delivery-info">
              <p>{order.address}</p>
              <p className="sub">{order.phone}</p>
            </div>
          </section>

          {/* DELIVERY TIME */}
          <section className="checkout-card">
            <h2>Delivery time</h2>

            <div className="delivery-option selected">
              <div>
                <strong>Standard</strong>
                <p>25–40 min</p>
              </div>
              <input type="radio" checked readOnly />
            </div>

            <div className="delivery-option">
              <div>
                <strong>Express</strong>
                <p>20–35 min • +$2.99</p>
              </div>
              <input type="radio" />
            </div>
          </section>

          {/* PAYMENT */}
          <section className="checkout-card">
            <h2>Payment and credits</h2>
            <div className="payment-box">
              {order.payment}
            </div>
          </section>

        </div>

        {/* RIGHT SIDE */}
        <aside className="checkout-aside">

          <section className="checkout-card">

            <div className="store-header">
              <p className="sub">Your cart from</p>
              <h3>{order.store}</h3>
            </div>

            {/* ✅ ITEMS (NOW IN RIGHT PANEL) */}
            <div className="cart-items-right">
              {order.items.map((item, i) => (
                <div key={i} className="summary-row">
                  <span>{item.name}</span>
                  <strong>${item.price.toFixed(2)}</strong>
                </div>
              ))}
            </div>

            {/* PROMO */}
            <div className="promo-banner">
              🏷 Add $5.25 to save with deals →
            </div>

            {/* SUMMARY */}
            <div className="summary-rows">

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>

              <div className="summary-row">
                <span>Delivery Fee</span>
                <strong>${order.deliveryFee.toFixed(2)}</strong>
              </div>

              <div className="summary-row">
                <span>Service fee</span>
                <strong>${order.serviceFee.toFixed(2)}</strong>
              </div>

              <div className="summary-row">
                <span>Fees & Estimated Tax</span>
                <strong>${order.tax.toFixed(2)}</strong>
              </div>

              <div className="summary-row total">
                <span>Total before tip</span>
                <strong>
                  ${(subtotal + order.tax + order.serviceFee + order.deliveryFee).toFixed(2)}
                </strong>
              </div>

            </div>

            {/* TIP */}
            <div className="tip-section">
              <h4>Dasher Tip</h4>

              <div className="tip-options">
                {[4.0, 4.5, 5.0].map((t) => (
                  <button
                    key={t}
                    className={tip === t ? "active" : ""}
                    onClick={() => setTip(t)}
                  >
                    ${t.toFixed(2)}
                  </button>
                ))}
                <button>Other</button>
              </div>
            </div>

            {/* SAVINGS */}
            <div className="savings-banner">
              Saving ${order.savings.toFixed(2)} with Deals
            </div>

            {/* CTA */}
            <button className="place-order-btn">
              Place Order • ${total.toFixed(2)}
            </button>

          </section>

        </aside>

      </div>
    </main>
  );
}