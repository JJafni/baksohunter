import almaRender from '../assets/landing/alma.webp'
import roveRender from '../assets/landing/rove.webp'
import { useMouseParallax } from '../hooks/useMouseParallax'

function LandingCharacters() {
  const { x, y } = useMouseParallax(0.11)

  const roveX = x * 22
  const roveY = y * 14
  const almaX = x * 18
  const almaY = y * 12

  return (
    <div className="landing-characters" aria-hidden="true">
      <img
        src={roveRender}
        alt=""
        className="landing-character landing-character--left"
        style={{ transform: `translate3d(${roveX}px, ${roveY}px, 0)` }}
        decoding="async"
        draggable={false}
      />
      <img
        src={almaRender}
        alt=""
        className="landing-character landing-character--right"
        style={{ transform: `translate3d(${almaX}px, ${almaY}px, 0)` }}
        decoding="async"
        draggable={false}
      />
    </div>
  )
}

export default LandingCharacters
