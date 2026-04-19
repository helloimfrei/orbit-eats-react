import { Link } from 'react-router-dom'
import '../styles/about.css'

const stats = [
  { number: '4,200+', label: 'Restaurant Partners' },
  { number: '17',     label: 'Galaxies Served' },
  { number: '2.1M',   label: 'Deliveries per Sol' },
  { number: '<30 min',label: 'Avg Delivery Time' },
]

const values = [
  { icon: '🚀', title: 'Speed Without Compromise',  body: 'FSPS-certified routing ensures your food travels faster than light and arrives fresher than if it had been cooked next door.' },
  { icon: '🌌', title: 'Galactic Inclusivity',       body: 'Every menu is reviewed for cross-species dietary compatibility. We tag allergens, atmosphere requirements, and temperature tolerances.' },
  { icon: '🤝', title: 'Partner First',              body: 'We take the lowest commission in the sector because restaurant partners deserve fair compensation. We grow only when they grow.' },
  { icon: '♻️', title: 'Zero-Emission Transit',      body: 'Every FSPS pod runs on dark-matter recapture energy. Our carbon footprint is certified neutral across all known dimensions.' },
]

const team = [
  { name: 'Zara Okonkwo',     role: 'Co-Founder & CEO',                  bio: 'Former FSPS logistics engineer who drew her first delivery route map on a napkin aboard ISS-Proxima.', color: 'linear-gradient(135deg,#b44dff,#00f0b5)' },
  { name: 'Kel-7 Vanthorpe',  role: 'Co-Founder & CTO',                  bio: 'Quantum routing specialist. Built the first sub-light food relay algorithm while studying wormhole physics at Titan University.', color: 'linear-gradient(135deg,#4a7fb5,#b44dff)' },
  { name: 'Priya Nair-Singh',  role: 'Head of Restaurant Partnerships',   bio: 'Spent a decade tasting her way through 9 galaxies before joining Orbit Eats to help other beings do the same.', color: 'linear-gradient(135deg,#00f0b5,#e8e830)' },
  { name: 'Marcus Delacroix', role: 'Head of Delivery Operations',        bio: 'Oversees a fleet of 80,000 FSPS pods. If your order is late, he already knows about it.', color: 'linear-gradient(135deg,#e8e830,#4a7fb5)' },
]

export default function About() {
  return (
    <div className="about">

      {/* Hero */}
      <section className="about-hero">
        <span className="about-badge">Est. 2047 · Milky Way HQ</span>
        <h1 className="about-hero-title">Feeding the Universe,<br />One Delivery at a Time</h1>
        <p className="about-hero-sub">We started with a simple question: why should great food be limited to one planet?</p>
      </section>

      {/* Mission */}
      <section className="about-section">
        <div className="about-inner">
          <div className="about-label">Our Mission</div>
          <h2 className="about-section-title">Making Cosmic Cuisine Accessible to All Species</h2>
          <p className="about-body">
            Orbit Eats was born in a small lunar kitchen in 2047 when our founders realized the universe's most incredible
            meals were locked behind light-years of distance. Powered by the Faster-than-light Space Parcel Service (FSPS),
            we connect hungry beings across every galaxy with the restaurants that define their local flavour.
          </p>
          <p className="about-body">
            Today we serve over 4,200 restaurants across 17 galaxies, with delivery times measured in minutes rather than
            millennia. Whether you're craving a Nebula Noodle Bowl from Andromeda or a Quantum Cheese Melt from the
            Sombrero Galaxy, Orbit Eats gets it to your airlock still hot.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        {stats.map(s => (
          <div className="about-stat" key={s.label}>
            <span className="about-stat-number">{s.number}</span>
            <span className="about-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Values */}
      <section className="about-section about-section--alt">
        <div className="about-inner">
          <div className="about-label">Our Values</div>
          <h2 className="about-section-title">What Keeps Us in Orbit</h2>
          <div className="values-grid">
            {values.map(v => (
              <div className="value-card" key={v.title}>
                <div className="value-icon">{v.icon}</div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-body">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-section">
        <div className="about-inner">
          <div className="about-label">The Crew</div>
          <h2 className="about-section-title">Meet the Beings Behind Orbit Eats</h2>
          <div className="team-grid">
            {team.map(m => (
              <div className="team-card" key={m.name}>
                <div className="team-avatar" style={{ background: m.color }} />
                <h3 className="team-name">{m.name}</h3>
                <span className="team-role">{m.role}</span>
                <p className="team-bio">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2 className="about-cta-title">Ready to Explore the Menu?</h2>
        <p className="about-cta-sub">Thousands of restaurants. Every galaxy. One app.</p>
        <Link to="/contact" className="about-cta-btn">Get in Touch &rarr;</Link>
      </section>

    </div>
  )
}
