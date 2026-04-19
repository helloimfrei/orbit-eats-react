import { useState, useEffect } from "react";

import "./styles/global.css";
import "./styles/checkout.css";
import "./styles/review-order.css";

export default function ReviewOrder() {
  const order = {
    address: "123 Main St, Hoboken, NJ",
    payment: "Visa ending in 1234",
    items: [
      { name: "Burger", price: 10, quantity: 2 },
      { name: "Fries", price: 5, quantity: 1 },
    ],
    tax: 2,
    serviceFee: 1,
    deliveryFee: 3,
    tip: 2,
  };

  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sub = order.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    setSubtotal(sub);

    const finalTotal =
      sub +
      order.tax +
      order.serviceFee +
      order.deliveryFee +
      order.tip;

    setTotal(finalTotal);
  }, []);

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <h1 className="checkout-page-title">Review Order</h1>
      </header>

      <section className="checkout-content">
        <div className="checkout-grid">

          {/* LEFT SIDE */}
          <div className="checkout-main">

            <section className="checkout-card">
              <h2 className="checkout-card-title">Delivery</h2>
              <div className="address-block">
                <label className="field-label">Delivery address</label>
                <div className="address-text">{order.address}</div>
              </div>
            </section>

            <section className="checkout-card">
              <h2 className="checkout-card-title">Payment</h2>
              <div className="address-block">
                <label className="field-label">Payment method</label>
                <div className="address-text">{order.payment}</div>
              </div>
            </section>

          </div>

          {/* RIGHT SIDE */}
          <aside className="checkout-aside">
            <section className="checkout-card">

              <h2 className="checkout-card-title">Order summary</h2>

              {/* ✅ ITEMS (LEFT + RIGHT ALIGN) */}
              <ul className="order-lines">
                {order.items.map((item, index) => (
                  <li key={index}>
                    <span>{item.name} x{item.quantity}</span>
                    <span>${item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>

              {/* ✅ SUMMARY ROWS (LEFT + RIGHT ALIGN) */}
              <div className="summary-rows">

                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>${subtotal}</strong>
                </div>

                <div className="summary-row">
                  <span>Sales tax</span>
                  <strong>${order.tax}</strong>
                </div>

                <div className="summary-row">
                  <span>Service fee</span>
                  <strong>${order.serviceFee}</strong>
                </div>

                <div className="summary-row">
                  <span>Delivery fee</span>
                  <strong>${order.deliveryFee}</strong>
                </div>

                <div className="summary-row">
                  <span>Tip</span>
                  <strong>${order.tip}</strong>
                </div>

                <div className="summary-row summary-row-total">
                  <span>Total</span>
                  <strong>${total}</strong>
                </div>

              </div>

              <div className="checkout-place-order-wrap">
                <button
                  className="checkout-btn-secondary"
                  style={{ display: "block", marginBottom: "10px" }}
                >
                  Back to checkout
                </button>

                <button
                  className="checkout-btn-primary"
                  onClick={() => alert("Order confirmed!")}
                >
                  Confirm order
                </button>
              </div>

            </section>
          </aside>

        </div>
      </section>
    </main>
  );
}