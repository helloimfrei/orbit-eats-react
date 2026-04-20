export type Vec2 = { x: number; y: number }
export type Rect = { x: number; y: number; w: number; h: number }

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function rectsOverlap(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

export function nowMs() {
  return performance.now()
}

export class Input {
  left = false
  right = false
  shootHeld = false
  shootPressed = false
  restartPressed = false
  pausePressed = false

  private lastTouchX: number | null = null
  private lastTouchTs = 0

  attach(target: HTMLElement): () => void {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.left = true
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.right = true
      if (e.code === 'Space' || e.code === 'Enter') {
        if (!this.shootHeld) this.shootPressed = true
        this.shootHeld = true
      }
      if (e.code === 'KeyR') this.restartPressed = true
      if (e.code === 'KeyP') this.pausePressed = true
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.left = false
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.right = false
      if (e.code === 'Space' || e.code === 'Enter') this.shootHeld = false
    }

    const onPointerDown = (clientX: number) => {
      const t = nowMs()
      if (t - this.lastTouchTs < 260) {
        this.restartPressed = true
      } else {
        this.shootPressed = true
      }
      this.lastTouchTs = t
      this.lastTouchX = clientX
    }

    const onPointerMove = (clientX: number) => {
      if (this.lastTouchX == null) return
      const dx = clientX - this.lastTouchX
      this.lastTouchX = clientX
      if (dx < -2) {
        this.left = true
        this.right = false
      } else if (dx > 2) {
        this.right = true
        this.left = false
      }
    }

    const onPointerUp = () => {
      this.lastTouchX = null
      this.left = false
      this.right = false
    }

    const onCanvasPointerDown = (e: PointerEvent) => {
      target.setPointerCapture(e.pointerId)
      onPointerDown(e.clientX)
    }
    const onCanvasPointerMove = (e: PointerEvent) => onPointerMove(e.clientX)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    target.addEventListener('pointerdown', onCanvasPointerDown)
    target.addEventListener('pointermove', onCanvasPointerMove)
    target.addEventListener('pointerup', onPointerUp)
    target.addEventListener('pointercancel', onPointerUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      target.removeEventListener('pointerdown', onCanvasPointerDown)
      target.removeEventListener('pointermove', onCanvasPointerMove)
      target.removeEventListener('pointerup', onPointerUp)
      target.removeEventListener('pointercancel', onPointerUp)
    }
  }

  consumeFrameEdges() {
    this.shootPressed = false
    this.restartPressed = false
    this.pausePressed = false
  }
}

type Bullet = {
  pos: Vec2
  vel: Vec2
  r: number
  from: 'player' | 'invader'
}

type Invader = {
  pos: Vec2
  w: number
  h: number
  hp: 1
  value: number
}

type Star = { x: number; y: number; z: number }

type GameState = 'title' | 'playing' | 'paused' | 'gameover' | 'win'

export type Config = {
  worldW: number
  worldH: number
  dprMax: number
}

const PLAYER_BAG_W = 32
const PLAYER_BAG_H = 16
// Where the projectile should visually exit the bag (relative to player center).
const PLAYER_BAG_NOZZLE_OFF_Y = -PLAYER_BAG_H / 2 + 2

export class Game {
  readonly cfg: Config
  state: GameState = 'title'
  score = 0
  hiScore = 0
  lives = 3
  level = 1

  player = {
    pos: { x: 0, y: 0 } as Vec2,
    w: 44,
    h: 16,
    speed: 340,
    cooldownMs: 220,
    lastShotMs: -1e9,
    invulnMs: 900,
    lastHitMs: -1e9
  }

  bullets: Bullet[] = []
  invaders: Invader[] = []
  invaderDir = 1
  invaderSpeed = 32
  invaderStepDown = 16
  invaderShootMs = 850
  invaderLastShotMs = -1e9
  invaderBoundsPad = 36

  stars: Star[] = []

  constructor(cfg: Config) {
    this.cfg = cfg
    this.resetAll()
  }

  resetAll() {
    this.score = 0
    this.lives = 3
    this.level = 1
    this.resetLevel()
  }

  resetLevel() {
    const { worldW, worldH } = this.cfg

    this.bullets = []
    this.invaderDir = 1
    this.invaderSpeed = 26 + (this.level - 1) * 4
    this.invaderShootMs = clamp(900 - (this.level - 1) * 70, 340, 900)
    this.invaderLastShotMs = -1e9
    this.player.pos = { x: worldW * 0.5, y: worldH - 54 }
    this.player.lastShotMs = -1e9
    this.player.lastHitMs = -1e9

    this.invaders = []
    const rows = 5
    const cols = 10
    const padX = 10
    const padY = 10
    const invW = 26
    const invH = 18
    const totalW = cols * invW + (cols - 1) * padX
    const startX = (worldW - totalW) / 2
    const startY = 70

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const value = (rows - r) * 10
        this.invaders.push({
          pos: { x: startX + c * (invW + padX), y: startY + r * (invH + padY) },
          w: invW,
          h: invH,
          hp: 1,
          value
        })
      }
    }

    this.ensureStars()
  }

  ensureStars() {
    if (this.stars.length) return
    const n = 110
    for (let i = 0; i < n; i++) {
      this.stars.push({
        x: Math.random() * this.cfg.worldW,
        y: Math.random() * this.cfg.worldH,
        z: Math.random()
      })
    }
  }

  start() {
    this.state = 'playing'
  }

  restart() {
    this.state = 'title'
    this.resetAll()
  }

  togglePause() {
    if (this.state === 'playing') this.state = 'paused'
    else if (this.state === 'paused') this.state = 'playing'
  }

  update(dt: number, input: Input, tMs: number) {
    this.hiScore = Math.max(this.hiScore, this.score)

    if (input.pausePressed && (this.state === 'playing' || this.state === 'paused')) {
      this.togglePause()
    }

    if (input.restartPressed && (this.state === 'gameover' || this.state === 'win' || this.state === 'title')) {
      this.restart()
      input.consumeFrameEdges()
      return
    }

    if (this.state === 'title') {
      if (input.shootPressed) this.start()
      input.consumeFrameEdges()
      return
    }

    if (this.state === 'paused') {
      input.consumeFrameEdges()
      return
    }

    if (this.state === 'gameover' || this.state === 'win') {
      input.consumeFrameEdges()
      return
    }

    // stars
    for (const s of this.stars) {
      s.y += (40 + 80 * s.z) * dt
      if (s.y > this.cfg.worldH + 10) {
        s.y = -10
        s.x = Math.random() * this.cfg.worldW
        s.z = Math.random()
      }
    }

    // player move
    const move = (input.right ? 1 : 0) - (input.left ? 1 : 0)
    this.player.pos.x += move * this.player.speed * dt
    const halfW = this.player.w / 2
    this.player.pos.x = clamp(this.player.pos.x, halfW + 10, this.cfg.worldW - halfW - 10)

    // shooting
    const canShoot = tMs - this.player.lastShotMs >= this.player.cooldownMs
    if (input.shootPressed && canShoot) {
      this.player.lastShotMs = tMs
      this.bullets.push({
        // Spawn from the bag nozzle so it looks like it comes out of it.
        pos: { x: this.player.pos.x, y: this.player.pos.y + PLAYER_BAG_NOZZLE_OFF_Y },
        vel: { x: 0, y: -560 },
        r: 3.2,
        from: 'player'
      })
    }

    // invaders move
    let minX = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    for (const inv of this.invaders) {
      minX = Math.min(minX, inv.pos.x)
      maxX = Math.max(maxX, inv.pos.x + inv.w)
      maxY = Math.max(maxY, inv.pos.y + inv.h)
    }

    const hitLeft = minX <= this.invaderBoundsPad
    const hitRight = maxX >= this.cfg.worldW - this.invaderBoundsPad
    if ((hitLeft && this.invaderDir < 0) || (hitRight && this.invaderDir > 0)) {
      this.invaderDir *= -1
      for (const inv of this.invaders) inv.pos.y += this.invaderStepDown
    }
    for (const inv of this.invaders) inv.pos.x += this.invaderDir * this.invaderSpeed * dt * (1 + this.level * 0.05)

    // invader shooting
    if (this.invaders.length && tMs - this.invaderLastShotMs >= this.invaderShootMs) {
      this.invaderLastShotMs = tMs
      const shooters = this.pickShooterCandidates()
      const inv = shooters[Math.floor(Math.random() * shooters.length)]
      const x = inv.pos.x + inv.w / 2
      const y = inv.pos.y + inv.h + 6
      this.bullets.push({
        pos: { x, y },
        vel: { x: (Math.random() - 0.5) * 70, y: 280 + this.level * 16 },
        r: 3.3,
        from: 'invader'
      })
    }

    // bullets update
    for (const b of this.bullets) {
      b.pos.x += b.vel.x * dt
      b.pos.y += b.vel.y * dt
    }
    this.bullets = this.bullets.filter((b) => b.pos.y > -30 && b.pos.y < this.cfg.worldH + 30)

    // collisions: player bullets vs invaders
    const remainingInv: Invader[] = []
    const invRects = new Map<Invader, Rect>()
    for (const inv of this.invaders) invRects.set(inv, { x: inv.pos.x, y: inv.pos.y, w: inv.w, h: inv.h })

    for (const inv of this.invaders) {
      let dead = false
      for (const b of this.bullets) {
        if (b.from !== 'player') continue
        const br: Rect = { x: b.pos.x - b.r, y: b.pos.y - b.r, w: b.r * 2, h: b.r * 2 }
        const ir = invRects.get(inv)!
        if (rectsOverlap(br, ir)) {
          dead = true
          b.pos.y = -9999
          this.score += inv.value
          break
        }
      }
      if (!dead) remainingInv.push(inv)
    }
    this.invaders = remainingInv
    this.bullets = this.bullets.filter((b) => b.pos.y > -9000)

    // collisions: invader bullets vs player
    const playerRect: Rect = {
      x: this.player.pos.x - this.player.w / 2,
      y: this.player.pos.y - this.player.h / 2,
      w: this.player.w,
      h: this.player.h
    }
    const invulnerable = tMs - this.player.lastHitMs < this.player.invulnMs
    if (!invulnerable) {
      for (const b of this.bullets) {
        if (b.from !== 'invader') continue
        const br: Rect = { x: b.pos.x - b.r, y: b.pos.y - b.r, w: b.r * 2, h: b.r * 2 }
        if (rectsOverlap(br, playerRect)) {
          b.pos.y = 99999
          this.player.lastHitMs = tMs
          this.lives -= 1
          break
        }
      }
      this.bullets = this.bullets.filter((b) => b.pos.y < 90000)
    }

    // lose if invaders reach player zone
    if (maxY >= this.player.pos.y - 40) {
      this.lives = 0
    }

    if (this.lives <= 0) {
      this.state = 'gameover'
      input.consumeFrameEdges()
      return
    }

    if (this.invaders.length === 0) {
      this.level += 1
      if (this.level > 6) {
        this.state = 'win'
      } else {
        this.resetLevel()
      }
    }

    input.consumeFrameEdges()
  }

  private pickShooterCandidates() {
    // pick bottom-most invaders per column (classic)
    const byCol = new Map<number, Invader>()
    for (const inv of this.invaders) {
      const col = Math.round(inv.pos.x / 30)
      const current = byCol.get(col)
      if (!current || inv.pos.y > current.pos.y) byCol.set(col, inv)
    }
    const candidates = [...byCol.values()]
    return candidates.length ? candidates : this.invaders
  }
}

export class Renderer {
  private ctx: CanvasRenderingContext2D
  private dpr = 1
  private canvas: HTMLCanvasElement
  private cfg: Config

  constructor(canvas: HTMLCanvasElement, cfg: Config) {
    this.canvas = canvas
    this.cfg = cfg
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D not supported')
    this.ctx = ctx
  }

  resizeToContainer() {
    const rect = this.canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, this.cfg.dprMax)
    const w = Math.max(320, Math.floor(rect.width))
    const h = Math.floor((w * this.cfg.worldH) / this.cfg.worldW)
    this.dpr = dpr
    this.canvas.width = Math.floor(w * dpr)
    this.canvas.height = Math.floor(h * dpr)
    this.canvas.style.height = `${h}px`
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  render(game: Game, tMs: number) {
    const ctx = this.ctx
    const w = this.canvas.width / this.dpr
    const h = this.canvas.height / this.dpr

    ctx.clearRect(0, 0, w, h)

    // background vignette
    const grad = ctx.createRadialGradient(w * 0.5, h * 0.35, 40, w * 0.5, h * 0.35, h * 0.85)
    grad.addColorStop(0, 'rgba(124, 58, 237, 0.14)')
    grad.addColorStop(1, 'rgba(0,0,0,0.55)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // stars
    for (const s of game.stars) {
      const a = 0.18 + 0.6 * s.z
      ctx.fillStyle = `rgba(255,255,255,${a})`
      const r = 0.8 + 1.7 * s.z
      ctx.beginPath()
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // invaders
    for (const inv of game.invaders) {
      const phase = Math.sin((tMs / 170) + inv.pos.x * 0.03) * 0.5 + 0.5
      ctx.fillStyle = `rgba(34,197,94,${0.65 + 0.25 * phase})`
      ctx.fillRect(inv.pos.x, inv.pos.y, inv.w, inv.h)
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      ctx.fillRect(inv.pos.x + 2, inv.pos.y + 2, inv.w - 4, 3)
    }

    // bullets
    for (const b of game.bullets) {
      ctx.fillStyle = b.from === 'player' ? 'rgba(96, 165, 250, 0.95)' : 'rgba(251, 113, 133, 0.9)'
      ctx.beginPath()
      ctx.arc(b.pos.x, b.pos.y, b.r, 0, Math.PI * 2)
      ctx.fill()
    }

    // player
    const invuln = tMs - game.player.lastHitMs < game.player.invulnMs
    const blink = invuln ? (Math.floor(tMs / 70) % 2 === 0) : true
    if (blink) {
      const px = 2 // 8-bit pixel size (drawn in world units)
      const rows = Math.floor(PLAYER_BAG_H / px)

      const left = game.player.pos.x - PLAYER_BAG_W / 2
      const top = game.player.pos.y - PLAYER_BAG_H / 2

      const bag = '#f59e0b'
      const bagDark = '#b45309'
      const outline = '#7c2d12'
      const flap = '#fb923c'
      const slot = '#0b1220'
      const slotHi = '#fde68a'

      const put = (xi: number, yi: number, color: string, a = 1) => {
        ctx.globalAlpha = a
        ctx.fillStyle = color
        ctx.fillRect(left + xi * px, top + yi * px, px, px)
      }

      // Bag body shape (a simple pixelated trapezoid)
      for (let yi = 0; yi < rows; yi++) {
        const t = yi <= 3 ? yi : rows - 1 - yi
        const start = 6 - t
        const end = 9 + t

        for (let xi = start; xi <= end; xi++) {
          const isEdge = xi === start || xi === end
          const isShadow = yi >= 4 && (xi === start + 1 || xi === end - 1)
          const color = isEdge ? outline : isShadow ? bagDark : bag
          put(xi, yi, color)
        }
      }

      // Flap + string
      for (let xi = 6; xi <= 9; xi++) put(xi, 0, flap)
      put(7, 0, outline)
      put(8, 0, outline)
      put(7, -1, bagDark) // small "string" pixel just above the bag top
      put(8, -1, bagDark)

      // Slot where projectiles come out
      put(7, 1, slot)
      put(8, 1, slot)
      put(7, 2, slotHi, 0.95)
      put(8, 2, slotHi, 0.95)

      ctx.globalAlpha = 1
    }

    // HUD
    ctx.fillStyle = 'rgba(255,255,255,0.88)'
    ctx.font = '600 13px ui-monospace, Consolas, monospace'
    ctx.textBaseline = 'top'
    ctx.fillText(`SCORE ${game.score.toString().padStart(5, '0')}`, 10, 10)
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillText(`HI ${game.hiScore.toString().padStart(5, '0')}`, 10, 28)
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillText(`LIVES ${game.lives}`, w - 92, 10)
    ctx.fillText(`LVL ${game.level}`, w - 92, 28)

    // overlay texts
    if (game.state !== 'playing') {
      this.overlay(game)
    }
  }

  private overlay(game: Game) {
    const ctx = this.ctx
    const w = this.canvas.width / this.dpr
    const h = this.canvas.height / this.dpr
    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '700 26px system-ui, Segoe UI, Roboto, Arial'

    const lines: string[] = []
    if (game.state === 'title') lines.push('Orbit Eats Delivery Traffic')
    if (game.state === 'paused') lines.push('Paused')
    if (game.state === 'gameover') lines.push('Game Over')
    if (game.state === 'win') lines.push('You Win')

    ctx.fillText(lines[0] ?? '', w / 2, h / 2 - 34)

    ctx.font = '500 14px system-ui, Segoe UI, Roboto, Arial'
    ctx.fillStyle = 'rgba(255,255,255,0.72)'
    const sub =
      game.state === 'title'
        ? 'Move: A/D or ←/→  •  Shoot: Space/Enter  •  Pause: P'
        : 'Press R to restart'
    ctx.fillText(sub, w / 2, h / 2 + 2)
    if (game.state === 'title') {
      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      ctx.fillText('Click/tap to shoot. Double-tap to restart.', w / 2, h / 2 + 26)
    }

    ctx.restore()
  }
}
