import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSampleOrder, getStoredUser, submitOrder, type SampleOrder } from "./api";
import {
  CART_EVENT,
  clearCart,
  getCart,
  updateCartItemQuantity,
  type Cart,
} from "./cart";
import "./styles/checkout.css";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

const fallbackOrder: SampleOrder = {
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
  savings: 0,
};

export default function ReviewOrder() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [cart, setCart] = useState<Cart | null>(() => getCart());
  const [order, setOrder] = useState<SampleOrder>(fallbackOrder);
  const [customerName, setCustomerName] = useState(user?.name || "Guest Customer");
  const [email, setEmail] = useState(user?.email || "guest@orbiteats.local");
  const [phone, setPhone] = useState("(281) 555-4821");
  const [address, setAddress] = useState(fallbackOrder.address);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardName, setCardName] = useState(user?.name || "Guest Customer");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [deliveryOption, setDeliveryOption] = useState<"standard" | "express">("standard");
  const [tip, setTip] = useState(5);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    if (cart) {
      return undefined;
    }

    fetchSampleOrder()
      .then((sampleOrder) => {
        if (!active) return;
        setOrder(sampleOrder);
        setAddress(sampleOrder.address);
        setPhone(sampleOrder.phone);
      })
      .catch(() => {
        if (active) setStatus("Using the local sample order until the API is available.");
      });

    return () => {
      active = false;
    };
  }, [cart]);

  useEffect(() => {
    const syncCart = () => setCart(getCart());

    window.addEventListener("storage", syncCart);
    window.addEventListener(CART_EVENT, syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener(CART_EVENT, syncCart);
    };
  }, []);

  const activeOrder = useMemo(() => {
    if (!cart) return order;

    return {
      ...order,
      store: cart.restaurantName,
      deliveryFee: cart.deliveryFee,
      items: cart.items,
    };
  }, [cart, order]);

  const subtotal = useMemo(
    () => activeOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [activeOrder.items]
  );
  const tax = Number((subtotal * 0.0825).toFixed(2));
  const serviceFee = activeOrder.serviceFee;
  const deliveryFee = activeOrder.deliveryFee + (deliveryOption === "express" ? 2.99 : 0);
  const totalBeforeTip = subtotal + tax + serviceFee + deliveryFee;
  const total = totalBeforeTip + tip;

  const changeQuantity = (itemName: string, quantity: number) => {
    updateCartItemQuantity(itemName, quantity);
  };

  const placeOrder = async () => {
    setIsSubmitting(true);
    setStatus("");

    try {
      const result = await submitOrder({
        customerName,
        email,
        phone,
        deliveryAddress: address,
        paymentMethod,
        deliveryFee,
        tip,
        items: activeOrder.items,
      });
      if (cart) {
        clearCart();
      }
      navigate("/order-submitted", {
        state: {
          orderId: result.orderId,
          total: result.total,
          store: activeOrder.store,
          email,
        },
      });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <h1 className="checkout-page-title">Review Order</h1>
      </header>

      <div className="checkout-grid">
        <div className="checkout-main">
          <section className="checkout-card">
            <div className="card-header">
              <h2>Deliver to</h2>
              <span className="link">Pickup instead</span>
            </div>

            <div className="map-placeholder">Map Preview</div>

            <div className="field-row field-row-2">
              <label className="field-group">
                <span className="field-label">Name</span>
                <input
                  className="field-input"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                />
              </label>
              <label className="field-group">
                <span className="field-label">Phone</span>
                <input
                  className="field-input"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </label>
            </div>

            <label className="field-group">
              <span className="field-label">Email</span>
              <input
                className="field-input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="field-group">
              <span className="field-label">Delivery address</span>
              <input
                className="field-input"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </label>
          </section>

          <section className="checkout-card">
            <h2 className="checkout-card-title">Delivery time</h2>
            <label
              className={`delivery-option${deliveryOption === "standard" ? " selected" : ""}`}
            >
              <div>
                <strong>Standard</strong>
                <p>25-40 min</p>
              </div>
              <input
                type="radio"
                name="deliveryOption"
                value="standard"
                checked={deliveryOption === "standard"}
                onChange={() => setDeliveryOption("standard")}
              />
            </label>

            <label
              className={`delivery-option${deliveryOption === "express" ? " selected" : ""}`}
            >
              <div>
                <strong>Express</strong>
                <p>20-35 min, +$2.99</p>
              </div>
              <input
                type="radio"
                name="deliveryOption"
                value="express"
                checked={deliveryOption === "express"}
                onChange={() => setDeliveryOption("express")}
              />
            </label>
          </section>

          <section className="checkout-card">
            <h2 className="checkout-card-title">Payment</h2>
            <div className="payment-methods">
              {[
                ["card", "Credit Card"],
                ["applepay", "Apple Pay"],
                ["cash", "Cash at delivery"],
              ].map(([value, label]) => (
                <label
                  className={`payment-method${paymentMethod === value ? " is-selected" : ""}`}
                  key={value}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={paymentMethod === value}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                  />
                  <span className="payment-method-label">{label}</span>
                </label>
              ))}
            </div>

            {paymentMethod === "card" && (
              <div className="fake-card-fields">
                <label className="field-group">
                  <span className="field-label">Name on card</span>
                  <input
                    className="field-input"
                    value={cardName}
                    onChange={(event) => setCardName(event.target.value)}
                    placeholder="Jamie Parker"
                  />
                </label>
                <label className="field-group">
                  <span className="field-label">Card number</span>
                  <input
                    className="field-input"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(event) => setCardNumber(event.target.value)}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                  />
                </label>
                <div className="field-row field-row-2">
                  <label className="field-group">
                    <span className="field-label">Expiry</span>
                    <input
                      className="field-input"
                      value={cardExpiry}
                      onChange={(event) => setCardExpiry(event.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </label>
                  <label className="field-group">
                    <span className="field-label">CVC</span>
                    <input
                      className="field-input"
                      inputMode="numeric"
                      value={cardCvc}
                      onChange={(event) => setCardCvc(event.target.value)}
                      placeholder="123"
                      maxLength={4}
                    />
                  </label>
                </div>
                <p className="fake-card-note">Demo only. No payment is processed.</p>
              </div>
            )}
          </section>
        </div>

        <aside className="checkout-aside">
          <section className="checkout-card">
            <div className="store-header">
              <p className="sub">Your cart from</p>
              <h3>{activeOrder.store}</h3>
            </div>

            <div className="cart-items-right">
              {activeOrder.items.map((item) => (
                <div key={item.name} className="cart-item-row">
                  <div>
                    <span>{item.name}</span>
                    <strong>{formatCurrency(item.price * item.quantity)}</strong>
                  </div>
                  {cart ? (
                    <div className="cart-quantity-controls">
                      <button
                        type="button"
                        aria-label={`Remove one ${item.name}`}
                        onClick={() => changeQuantity(item.name, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Add one ${item.name}`}
                        onClick={() => changeQuantity(item.name, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <span className="cart-static-quantity">x{item.quantity}</span>
                  )}
                </div>
              ))}
            </div>

            {cart && (
              <button type="button" className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
            )}

            <div className="promo-banner">Add $5.25 to save with deals</div>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div className="summary-row">
                <span>Delivery fee</span>
                <strong>{formatCurrency(deliveryFee)}</strong>
              </div>
              <div className="summary-row">
                <span>Service fee</span>
                <strong>{formatCurrency(serviceFee)}</strong>
              </div>
              <div className="summary-row">
                <span>Estimated tax</span>
                <strong>{formatCurrency(tax)}</strong>
              </div>
              <div className="summary-row total">
                <span>Total before tip</span>
                <strong>{formatCurrency(totalBeforeTip)}</strong>
              </div>
            </div>

            <div className="tip-section">
              <h4>Courier Tip</h4>
              <div className="tip-options">
                {[3, 4, 5, 6].map((value) => (
                  <button
                    type="button"
                    key={value}
                    className={tip === value ? "active" : ""}
                    onClick={() => setTip(value)}
                  >
                    {formatCurrency(value)}
                  </button>
                ))}
              </div>
            </div>

            <div className="savings-banner">
              Saving {formatCurrency(activeOrder.savings)} with Deals
            </div>

            {status && <p className="checkout-status">{status}</p>}

            <button
              className="place-order-btn"
              type="button"
              disabled={isSubmitting}
              onClick={placeOrder}
            >
              {isSubmitting ? "Placing Order..." : `Place Order - ${formatCurrency(total)}`}
            </button>
          </section>
        </aside>
      </div>
    </main>
  );
}
