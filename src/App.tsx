import './style.css'
import { GameCanvas } from './components/GameCanvas'

export function App() {
  return (
    <div className="shell">
      <div className="topbar">
        <div className="title">Orbit Eats Delivery Traffic</div>
        <div className="hint">
          <span className="kbd">A</span>/<span className="kbd">D</span> or <span className="kbd">←</span>/
          <span className="kbd">→</span> • <span className="kbd">Space</span> shoot • <span className="kbd">P</span>{' '}
          pause • <span className="kbd">R</span> restart
        </div>
      </div>
      <div className="stage">
        <GameCanvas />
      </div>
      <div className="footer">
        <div>
          <strong>Story</strong>: there is a ton of intergalactic traffic—get past it as quickly as possible so you
          arrive at your destination on time.
        </div>
        <div>
          <strong>Mobile</strong>: drag to move • tap to shoot • double-tap to restart.
        </div>
      </div>
    </div>
  )
}
