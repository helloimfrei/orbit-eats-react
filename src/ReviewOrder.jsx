import { useState, useEffect } from "react";

import "./styles/checkout.css";
import "./styles/review-order.css";

export default function ReviewOrder() {
  const order = {
    store: "Teriyaki Madness",
    address: "221 Washington St, Hoboken, NJ 07030",
    phone: "(201) 555-0198",
    payment: "Visa ending in 8267",
    items: [{ name: "Chicken Bowl", price: 14.75, quantity: 1 }],
    tax: 3.98,
    deliveryFee: 0,
    originalDeliveryFee: 2.49,
    savings: 2.49,
  };

  const [tip, setTip] = useState(4.5);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sub = order.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    setSubtotal(sub);

    const final = sub + order.tax + order.deliveryFee + tip;
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

          {/* CART SUMMARY */}
          <section className="checkout-card">
            <h2>Cart summary</h2>

            {order.items.map((item, i) => (
              <div key={i} className="cart-line">
                <span>{item.name} ×{item.quantity}</span>
                <strong>${item.price}</strong>
              </div>
            ))}
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
                <strong>
                  <s>${order.originalDeliveryFee}</s> $0.00
                </strong>
              </div>

              <div className="summary-row">
                <span>Fees & Tax</span>
                <strong>${order.tax.toFixed(2)}</strong>
              </div>

              <div className="summary-row total">
                <span>Total before tip</span>
                <strong>${(subtotal + order.tax).toFixed(2)}</strong>
              </div>

            </div>

            {/* TIP */}
            <div className="tip-section">
              <h4>Dasher Tip</h4>

              <div className="tip-options">
                {[4, 4.5, 5].map((t) => (
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