import type { CrateEntry, Rarity } from '../data/types'
import { ELDER_DRAGON_SLUGS } from '../data/monsters'

export type VisualRarity = Rarity | 'elder-dragon'

export function getVisualRarity(entry: Pick<CrateEntry, 'slug' | 'rarity'>): VisualRarity {
  if (entry.rarity === 'normal' && ELDER_DRAGON_SLUGS.has(entry.slug)) {
    return 'elder-dragon'
  }
  return entry.rarity
}

export const RARITY_CARD_TONE: Record<
  VisualRarity,
  { border: string; chip: string; glow: string; backlight: string }
> = {
  normal: {
    border: 'border-teal-500/55',
    chip: 'bg-teal-500/15 text-teal-200 border-teal-400/35',
    glow: 'shadow-[0_0_45px_10px_rgba(45,212,191,0.45)]',
    backlight: 'rgba(45,212,191,0.5)',
  },
  tempered: {
    border: 'border-purple-500/65',
    chip: 'bg-purple-500/15 text-purple-200 border-purple-400/40',
    glow: 'shadow-[0_0_45px_10px_rgba(168,85,247,0.5)]',
    backlight: 'rgba(168,85,247,0.5)',
  },
  'arch-tempered': {
    border: 'border-wilds-gold/80',
    chip: 'bg-wilds-gold/15 text-wilds-gold-light border-wilds-gold/45',
    glow: 'shadow-[0_0_55px_14px_rgba(201,162,77,0.55)]',
    backlight: 'rgba(201,162,77,0.55)',
  },
  'elder-dragon': {
    border: 'border-wilds-ember/75',
    chip: 'bg-wilds-ember/15 text-orange-200 border-wilds-ember/45',
    glow: 'shadow-[0_0_45px_10px_rgba(184,101,58,0.55)]',
    backlight: 'rgba(184,101,58,0.55)',
  },
}

export const RARITY_MARKER_COLOR: Record<VisualRarity, string> = {
  normal: 'rgba(45,212,191,0.95)',
  tempered: 'rgba(168,85,247,0.95)',
  'arch-tempered': 'rgba(201,162,77,0.95)',
  'elder-dragon': 'rgba(184,101,58,0.95)',
}

export const RARITY_BACKGROUND_GLOW: Record<VisualRarity, string> = {
  normal: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(45,212,191,0.16), transparent 70%)',
  tempered: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(168,85,247,0.16), transparent 70%)',
  'arch-tempered': 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(201,162,77,0.2), transparent 70%)',
  'elder-dragon': 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(184,101,58,0.18), transparent 70%)',
}

export const RARITY_TEXT_CLASS: Record<VisualRarity, string> = {
  normal: 'text-teal-400',
  tempered: 'text-purple-400',
  'arch-tempered': 'text-wilds-gold-light',
  'elder-dragon': 'text-wilds-ember',
}
