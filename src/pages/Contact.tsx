import { useState, type FormEvent } from 'react'
import './Contact.css'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <div className="contact">

      {/* Hero */}
      <section className="contact-hero">
        <h1 className="contact-hero-title">Get in Touch</h1>
        <p className="contact-hero-sub">Our support crew operates across all time zones — and most time dimensions.</p>
      </section>

      <div className="contact-layout">

        {/* Form */}
        <section className="contact-form-card">
          <h2 className="contact-form-title">Send Us a Message</h2>
          <p className="contact-form-subtitle">Average response time: under 2 parsecs.</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">First Name</label>
                <input className="form-input" type="text" id="firstName" placeholder="Zara" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Last Name</label>
                <input className="form-input" type="text" id="lastName" placeholder="Okonkwo" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input className="form-input" type="email" id="email" placeholder="you@galaxy.space" required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="subject">Subject</label>
              <select className="form-input form-select" id="subject" defaultValue="">
                <option value="" disabled>Select a topic...</option>
                <option value="order">Order Issue</option>
                <option value="delivery">Delivery Problem</option>
                <option value="restaurant">Restaurant Partnership</option>
                <option value="account">Account &amp; Billing</option>
                <option value="other">Something Else</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="message">Message</label>
              <textarea className="form-input form-textarea" id="message" placeholder="Tell us what's on your mind..." required />
            </div>

            <button type="submit" className="form-submit">Send Message</button>

            {submitted && (
              <p className="form-success">✔ Message received! We'll be in touch faster than light-speed.</p>
            )}
          </form>
        </section>

        {/* Aside */}
        <aside className="contact-aside">
          <div className="contact-info-card">
            <h3 className="contact-info-title">Support Channels</h3>
            <ul className="contact-info-list">
              <li className="contact-info-item">
                <span className="contact-info-icon">📡</span>
                <div>
                  <span className="contact-info-label">Live Quantum Chat</span>
                  <span className="contact-info-value">Available 24/7</span>
                </div>
              </li>
              <li className="contact-info-item">
                <span className="contact-info-icon">✉️</span>
                <div>
                  <span className="contact-info-label">Email</span>
                  <span className="contact-info-value">hello@orbiteats.space</span>
                </div>
              </li>
              <li className="contact-info-item">
                <span className="contact-info-icon">☎️</span>
                <div>
                  <span className="contact-info-label">Subspace Comm Line</span>
                  <span className="contact-info-value">+1-800-ORBIT-42</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="contact-info-card">
            <h3 className="contact-info-title">Headquarters</h3>
            <p className="contact-info-address">
              Orbit Eats HQ<br />
              Level 47, Lunar Trade Tower<br />
              Sea of Tranquility, Luna<br />
              Sol System · Milky Way
            </p>
          </div>

          <div className="contact-info-card contact-info-card--highlight">
            <h3 className="contact-info-title">Restaurant Partners</h3>
            <p className="contact-info-body">Want to list your restaurant on Orbit Eats? We'd love to have you in our constellation.</p>
            <a href="mailto:partners@orbiteats.space" className="contact-partner-btn">Apply to Partner &rarr;</a>
          </div>
        </aside>

      </div>
    </div>
  )
}
