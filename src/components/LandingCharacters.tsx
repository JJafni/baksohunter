import hunterFemale from '../assets/landing/hunter-female.webp'
import hunterMale from '../assets/landing/hunter-male.webp'
import { useMouseParallax } from '../hooks/useMouseParallax'

function LandingCharacters() {
  const { x, y } = useMouseParallax(0.11)

  const maleX = x * 22
  const maleY = y * 14
  const femaleX = x * 18
  const femaleY = y * 12

  return (
    <div className="landing-characters" aria-hidden="true">
      <img
        src={hunterMale}
        alt=""
        className="landing-character landing-character--left"
        style={{ transform: `translate3d(${maleX}px, ${maleY}px, 0)` }}
        decoding="async"
        draggable={false}
      />
      <img
        src={hunterFemale}
        alt=""
        className="landing-character landing-character--right"
        style={{ transform: `translate3d(${femaleX}px, ${femaleY}px, 0)` }}
        decoding="async"
        draggable={false}
      />
    </div>
  )
}

export default LandingCharacters
