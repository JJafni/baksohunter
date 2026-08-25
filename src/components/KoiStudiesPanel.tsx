import { forwardRef, useState, type Ref } from 'react'
import '@designcodeio/threeui/style.css'
import { cn } from '../lib/utils'

const KOI_ASSET_URL = '/synthralos-halftone.html?v=forced-fate-19'

type KoiStudiesPanelProps = {
  className?: string
  iframeRef?: Ref<HTMLIFrameElement>
  onIframeLoad?: () => void
}

const KoiStudiesPanel = forwardRef<HTMLDivElement, KoiStudiesPanelProps>(
  function KoiStudiesPanel({ className, iframeRef, onIframeLoad }, ref) {
    const [ready, setReady] = useState(false)

    return (
      <div
        ref={ref}
        className={cn('threeui-background koi-studies relative h-full min-h-0 w-full', className)}
        aria-label="Interactive stack of three Japanese koi studies"
        data-state={ready ? 'ready' : 'loading'}
        style={{
          overflow: 'hidden',
          background: '#0f0d0a',
          pointerEvents: 'auto',
        }}
      >
        <iframe
          ref={iframeRef}
          title="Koi Studies — Interactive Card Stack"
          src={KOI_ASSET_URL}
          sandbox="allow-scripts"
          allow="autoplay"
          loading="eager"
          onLoad={() => {
            setReady(true)
            onIframeLoad?.()
          }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            border: 0,
            background: '#0f0d0a',
          }}
        />
      </div>
    )
  },
)

export default KoiStudiesPanel
