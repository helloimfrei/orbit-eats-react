import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";

const ORDER_ITEMS = [
  { id: 1, name: "Galactic Burger", quantity: 2, price: 11.5 },
  { id: 2, name: "Moon Fries", quantity: 1, price: 4.5 },
  { id: 3, name: "Nebula Soda", quantity: 2, price: 3.25 },
];

const TIP_OPTIONS = [0, 0.1, 0.15, 0.2];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function SectionCard({ title, children }) {
  return (
    <section className="checkout-card">
      <h2 className="checkout-card-title">{title}</h2>
      {children}
    </section>
  );
}

function TextField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div className="field-group">
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        className="field-input"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
      />
    </div>
  );
}

function AddressSection({ title, data, prefix, onFieldChange }) {
  return (
    <div className="address-block">
      <h3 className="checkout-card-subtitle">{title}</h3>
      <TextField
        label="Street Address"
        name={`${prefix}.street`}
        value={data.street}
        onChange={onFieldChange}
        placeholder="123 Orbit Ave"
        required
      />
      <TextField
        label="Apartment / Unit"
        name={`${prefix}.line2`}
        value={data.line2}
        onChange={onFieldChange}
        placeholder="Suite 8"
      />
      <div className="field-row field-row-3">
        <TextField
          label="City"
          name={`${prefix}.city`}
          value={data.city}
          onChange={onFieldChange}
          placeholder="Houston"
          required
        />
        <TextField
          label="State"
          name={`${prefix}.state`}
          value={data.state}
          onChange={onFieldChange}
          placeholder="TX"
          required
        />
        <TextField
          label="ZIP"
          name={`${prefix}.zip`}
          value={data.zip}
          onChange={onFieldChange}
          placeholder="77002"
          required
        />
      </div>
    </div>
  );
}

function OrderSummary({ items, subtotal, tax, serviceFee, deliveryFee, tipAmount, total }) {
  return (
    <SectionCard title="Order summary">
      <div className="restaurant-name">Orbit Diner</div>
      <ul className="order-lines">
        {items.map((item) => (
          <li key={item.id} className="order-line">
            <span>
              {item.name} <span className="order-line-qty">x{item.quantity}</span>
            </span>
            <strong>{formatCurrency(item.price * item.quantity)}</strong>
          </li>
        ))}
      </ul>

      <div className="summary-rows">
        <div className="summary-row">
          <span>Subtotal</span>
          <strong>{formatCurrency(subtotal)}</strong>
        </div>
        <div className="summary-row">
          <span>Sales tax</span>
          <strong>{formatCurrency(tax)}</strong>
        </div>
        <div className="summary-row">
          <span>Service fee</span>
          <strong>{formatCurrency(serviceFee)}</strong>
        </div>
        <div className="summary-row">
          <span>Delivery fee</span>
          <strong>{formatCurrency(deliveryFee)}</strong>
        </div>
        <div className="summary-row">
          <span>Tip</span>
          <strong>{formatCurrency(tipAmount)}</strong>
        </div>
        <div className="summary-row summary-row-total">
          <span>Total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>
    </SectionCard>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    notes: "",
    deliveryAddress: { street: "", line2: "", city: "", state: "", zip: "" },
    billingAddress: { street: "", line2: "", city: "", state: "", zip: "" },
    deliveryTime: "asap",
    scheduledDate: "",
    scheduledSlot: "",
    paymentMethod: "card",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    billingSameAsDelivery: true,
  });
  const [tipRate, setTipRate] = useState(0.15);
  const [customTip, setCustomTip] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = useMemo(
    () => ORDER_ITEMS.reduce((sum, item) => sum + item.quantity * item.price, 0),
    []
  );
  const tax = subtotal * 0.0825;
  const serviceFee = 1.75;
  const deliveryFee = 3.49;
  const tipAmount =
    tipRate === -1
      ? Math.max(0, Number.parseFloat(customTip || "0"))
      : Number((subtotal * tipRate).toFixed(2));
  const total = subtotal + tax + serviceFee + deliveryFee + tipAmount;

  const updateRootField = (event) => {
    const { name, value, type, checked } = event.target;
    setCheckoutForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateNestedField = (event) => {
    const { name, value } = event.target;
    const [group, key] = name.split(".");

    setCheckoutForm((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: value,
      },
    }));
  };

  const handlePlaceOrder = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setOrderPlaced(true);
    }, 1200);
  };

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <h1 className="checkout-page-title">Checkout</h1>
        <button
          type="button"
          className="checkout-btn-secondary"
          onClick={() => navigate("/review-order")}
        >
          Back to Order
        </button>
      </header>

      <div className="checkout-content">
        <div className="checkout-grid">
          <form className="checkout-main" onSubmit={handlePlaceOrder}>
            <SectionCard title="Contact information">
              <div className="field-row field-row-2">
                <TextField
                  label="Full Name"
                  name="customerName"
                  value={checkoutForm.customerName}
                  onChange={updateRootField}
                  placeholder="Jamie Parker"
                  required
                />
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={checkoutForm.phone}
                  onChange={updateRootField}
                  placeholder="(555) 123-9876"
                  required
                />
              </div>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={checkoutForm.email}
                onChange={updateRootField}
                placeholder="jamie@orbitmail.com"
                required
              />
            </SectionCard>

            <SectionCard title="Delivery details">
              <div className="segmented">
                <input
                  id="asap"
                  name="deliveryTime"
                  type="radio"
                  value="asap"
                  checked={checkoutForm.deliveryTime === "asap"}
                  onChange={updateRootField}
                />
                <label htmlFor="asap">ASAP</label>

                <input
                  id="scheduled"
                  name="deliveryTime"
                  type="radio"
                  value="scheduled"
                  checked={checkoutForm.deliveryTime === "scheduled"}
                  onChange={updateRootField}
                />
                <label htmlFor="scheduled">Schedule</label>
              </div>

              <div
                className="scheduled-fields"
                hidden={checkoutForm.deliveryTime !== "scheduled"}
              >
                <div className="field-row field-row-2">
                  <TextField
                    label="Delivery date"
                    name="scheduledDate"
                    type="date"
                    value={checkoutForm.scheduledDate}
                    onChange={updateRootField}
                  />
                  <div className="field-group">
                    <label className="field-label" htmlFor="scheduledSlot">
                      Time window
                    </label>
                    <select
                      id="scheduledSlot"
                      name="scheduledSlot"
                      className="field-select"
                      value={checkoutForm.scheduledSlot}
                      onChange={updateRootField}
                    >
                      <option value="">Select a window</option>
                      <option value="12:00-12:30">12:00 - 12:30</option>
                      <option value="12:30-1:00">12:30 - 1:00</option>
                      <option value="1:00-1:30">1:00 - 1:30</option>
                    </select>
                  </div>
                </div>
              </div>

              <AddressSection
                title="Delivery Address"
                data={checkoutForm.deliveryAddress}
                prefix="deliveryAddress"
                onFieldChange={updateNestedField}
              />

              <div className="field-group">
                <label className="field-label" htmlFor="notes">
                  Delivery Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  className="field-textarea"
                  value={checkoutForm.notes}
                  onChange={updateRootField}
                  placeholder="Gate code, landmarks, or drop-off instructions..."
                />
              </div>
            </SectionCard>

            <SectionCard title="Payment">
              <div className="payment-methods">
                {[
                  ["card", "Credit / Debit Card", "Visa, MasterCard, AmEx"],
                  ["applepay", "Apple Pay", "Fast checkout"],
                  ["cash", "Cash", "Pay at the door"],
                ].map(([value, label, hint]) => (
                  <label
                    key={value}
                    className={`payment-method${
                      checkoutForm.paymentMethod === value ? " is-selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={checkoutForm.paymentMethod === value}
                      onChange={updateRootField}
                    />
                    <span className="payment-method-label">{label}</span>
                    <span className="payment-method-hint">{hint}</span>
                  </label>
                ))}
              </div>

              <div className="card-fields" hidden={checkoutForm.paymentMethod !== "card"}>
                <TextField
                  label="Name on card"
                  name="cardName"
                  value={checkoutForm.cardName}
                  onChange={updateRootField}
                  placeholder="Jamie Parker"
                />
                <div className="field-row field-row-2">
                  <TextField
                    label="Card number"
                    name="cardNumber"
                    value={checkoutForm.cardNumber}
                    onChange={updateRootField}
                    placeholder="4242 4242 4242 4242"
                  />
                  <div className="field-row field-row-2">
                    <TextField
                      label="Expiry"
                      name="expiry"
                      value={checkoutForm.expiry}
                      onChange={updateRootField}
                      placeholder="MM/YY"
                    />
                    <TextField
                      label="CVC"
                      name="cvc"
                      value={checkoutForm.cvc}
                      onChange={updateRootField}
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>

              <div className="checkbox-row">
                <input
                  id="billing-same-as-delivery"
                  type="checkbox"
                  name="billingSameAsDelivery"
                  checked={checkoutForm.billingSameAsDelivery}
                  onChange={updateRootField}
                />
                <label htmlFor="billing-same-as-delivery">
                  Billing address is the same as delivery address.
                </label>
              </div>

              <div
                id="billing-fields"
                className="billing-fields"
                hidden={checkoutForm.billingSameAsDelivery}
              >
                <AddressSection
                  title="Billing Address"
                  data={checkoutForm.billingAddress}
                  prefix="billingAddress"
                  onFieldChange={updateNestedField}
                />
              </div>
            </SectionCard>

            <SectionCard title="Tip your courier">
              <div className="tip-options">
                {TIP_OPTIONS.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    className={`tip-btn${tipRate === rate ? " is-active" : ""}`}
                    onClick={() => setTipRate(rate)}
                  >
                    {rate === 0 ? "No tip" : `${Math.round(rate * 100)}%`}
                  </button>
                ))}
                <button
                  type="button"
                  className={`tip-btn${tipRate === -1 ? " is-active" : ""}`}
                  onClick={() => setTipRate(-1)}
                >
                  Custom
                </button>
              </div>
              <div className="tip-custom" hidden={tipRate !== -1}>
                <TextField
                  label="Custom tip amount"
                  name="customTip"
                  type="number"
                  value={customTip}
                  onChange={(event) => setCustomTip(event.target.value)}
                  placeholder="0.00"
                />
              </div>
            </SectionCard>
          </form>

          <aside className="checkout-aside">
            <OrderSummary
              items={ORDER_ITEMS}
              subtotal={subtotal}
              tax={tax}
              serviceFee={serviceFee}
              deliveryFee={deliveryFee}
              tipAmount={tipAmount}
              total={total}
            />

            <section className="checkout-card">
              <div className="delivery-estimate">
                <div className="delivery-estimate-title">Estimated Arrival</div>
                <div className="delivery-estimate-time">
                  {checkoutForm.deliveryTime === "asap"
                    ? "25-35 min"
                    : checkoutForm.scheduledSlot || "Choose a time"}
                </div>
                <div className="delivery-estimate-meta">
                  Delivery from Orbit Grill to your current location.
                </div>
              </div>

              <div className="checkout-place-order-wrap">
                {orderPlaced ? (
                  <div className="checkout-inline-success" role="status" aria-live="polite">
                    <h2 className="checkout-dialog-title">Order placed successfully</h2>
                    <p>Your food is on the way. Track updates in your order history.</p>
                    <div className="checkout-dialog-actions">
                      <button
                        className="checkout-btn-ghost"
                        onClick={() => setOrderPlaced(false)}
                        type="button"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={`checkout-btn-primary${isSubmitting ? " is-loading" : ""}`}
                    disabled={isSubmitting}
                    onClick={handlePlaceOrder}
                  >
                    Place order - {formatCurrency(total)}
                  </button>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
