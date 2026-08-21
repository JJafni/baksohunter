/** Key Art backgrounds from the MHWilds Image Gallery (Marketing → Key Art). */
export type KeyArtSlide = {
  url: string
  label: string
}

export const KEY_ART_SLIDES: KeyArtSlide[] = [
  {
    url: 'https://monsterhunterwiki.org/images/2/27/MHWilds-Key_Art_001.webp',
    label: 'Key Art',
  },
  {
    url: 'https://monsterhunterwiki.org/images/9/92/MHWilds-Arkveld_Key_Art_001.webp',
    label: 'Arkveld Key Art',
  },
  {
    url: 'https://monsterhunterwiki.org/images/a/a9/MHWilds-Arkveld_Key_Art_002.webp',
    label: 'Arkveld Key Art',
  },
  {
    url: 'https://monsterhunterwiki.org/images/0/00/MHWilds-Mizutsune_Key_Art.webp',
    label: 'Mizutsune · Title Update 1',
  },
  {
    url: 'https://monsterhunterwiki.org/images/6/6a/MHWilds-Lagiacrus_Key_Art.webp',
    label: 'Lagiacrus · Title Update 2',
  },
  {
    url: 'https://monsterhunterwiki.org/images/6/68/MHWilds-Seregios_Key_Art.webp',
    label: 'Seregios · Title Update 2',
  },
  {
    url: 'https://monsterhunterwiki.org/images/d/d7/MHWilds-Omega_Planetes_Key_Art.webp',
    label: 'Omega Planetes · Title Update 3',
  },
  {
    url: 'https://monsterhunterwiki.org/images/4/44/MHWilds-Gogmazios_Key_Art_001.webp',
    label: 'Gogmazios · Title Update 4',
  },
]

export function getKeyArtUrls(): string[] {
  return KEY_ART_SLIDES.map((slide) => slide.url)
}
