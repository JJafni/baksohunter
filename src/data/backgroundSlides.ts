import libraryHero from '../assets/backgrounds/mhwilds-library-hero-2x.jpg'
import pageBgRaw from '../assets/backgrounds/mhwilds-page-bg-raw.jpg'
import screenshot01 from '../assets/backgrounds/mhwilds-screenshot-01.jpg'
import screenshot02 from '../assets/backgrounds/mhwilds-screenshot-02.jpg'
import screenshot03 from '../assets/backgrounds/mhwilds-screenshot-03.jpg'
import screenshot04 from '../assets/backgrounds/mhwilds-screenshot-04.jpg'
import screenshot05 from '../assets/backgrounds/mhwilds-screenshot-05.jpg'
import screenshot06 from '../assets/backgrounds/mhwilds-screenshot-06.jpg'

export type BackgroundSlideDirection = 'left' | 'right'

export type BackgroundSlide = {
  src: string
  direction: BackgroundSlideDirection
}

export const backgroundSlides: BackgroundSlide[] = [
  { src: libraryHero, direction: 'left' },
  { src: pageBgRaw, direction: 'right' },
  { src: screenshot01, direction: 'left' },
  { src: screenshot02, direction: 'right' },
  { src: screenshot03, direction: 'left' },
  { src: screenshot04, direction: 'right' },
  { src: screenshot05, direction: 'left' },
  { src: screenshot06, direction: 'right' },
]
