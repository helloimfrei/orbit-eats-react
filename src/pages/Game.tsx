export default function Game() {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 64px)' }}>
      <iframe
        src="/game.html"
        title="Orbit Eats Delivery Traffic"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        allow="autoplay"
      />
    </div>
  )
}
