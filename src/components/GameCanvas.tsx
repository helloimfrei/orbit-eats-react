import { useEffect, useRef } from 'react'
import { type Config, clamp, Game, Input, nowMs, Renderer } from '../game/engine'

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const cfg: Config = { worldW: 720, worldH: 540, dprMax: 2 }
    const input = new Input()
    const detachInput = input.attach(canvas)
    const game = new Game(cfg)
    const renderer = new Renderer(canvas, cfg)

    const onResize = () => renderer.resizeToContainer()
    onResize()
    window.addEventListener('resize', onResize)

    let last = nowMs()
    let raf = 0
    const loop = () => {
      const t = nowMs()
      const dt = clamp((t - last) / 1000, 0, 1 / 20)
      last = t
      game.update(dt, input, t)
      renderer.render(game, t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      detachInput()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="game"
      aria-label="Orbit Eats Delivery Traffic game canvas"
      role="img"
    />
  )
}
