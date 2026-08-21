import almaRender from '../assets/landing/alma.webp'
import { useMouseParallax } from '../hooks/useMouseParallax'

function LandingAlma() {
  const { x, y } = useMouseParallax(0.05)
  const offsetX = x * 7
  const offsetY = y * 4

  return (
    <div className="landing-alma" aria-hidden="true">
      <div
        className="landing-alma-inner"
        style={{ transform: `translate3d(${offsetX}px, ${offsetY}px, 0)` }}
      >
        <div className="landing-alma-frame">
          <img
            src={almaRender}
            alt=""
            className="landing-alma-image"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>
    </div>
  )
}

export default LandingAlma
