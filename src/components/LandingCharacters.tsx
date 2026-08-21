import hunterFemale from '../assets/landing/hunter-female.webp'
import hunterMale from '../assets/landing/hunter-male.webp'
import { useMouseParallax } from '../hooks/useMouseParallax'

function LandingCharacters() {
  const { x, y } = useMouseParallax(0.05)
  const offsetX = x * 7
  const offsetY = y * 4

  return (
    <div className="landing-characters" aria-hidden="true">
      <div className="landing-character-wrap landing-character-wrap--left">
        <img
          src={hunterMale}
          alt=""
          className="landing-character"
          style={{ transform: `translate3d(${offsetX}px, ${offsetY}px, 0)` }}
          decoding="async"
          draggable={false}
        />
      </div>
      <div className="landing-character-wrap landing-character-wrap--right">
        <img
          src={hunterFemale}
          alt=""
          className="landing-character"
          style={{ transform: `translate3d(${offsetX}px, ${offsetY}px, 0)` }}
          decoding="async"
          draggable={false}
        />
      </div>
    </div>
  )
}

export default LandingCharacters
