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
    border: 'border-sky-500/60',
    chip: 'bg-sky-500/15 text-sky-200 border-sky-400/40',
    glow: 'shadow-[0_0_45px_10px_rgba(56,189,248,0.5)]',
    backlight: 'rgba(56,189,248,0.55)',
  },
  tempered: {
    border: 'border-violet-500/70',
    chip: 'bg-violet-500/15 text-violet-200 border-violet-400/40',
    glow: 'shadow-[0_0_45px_10px_rgba(139,92,246,0.55)]',
    backlight: 'rgba(139,92,246,0.55)',
  },
  'arch-tempered': {
    border: 'border-amber-400/80',
    chip: 'bg-amber-500/15 text-amber-200 border-amber-400/50',
    glow: 'shadow-[0_0_55px_14px_rgba(251,191,36,0.6)]',
    backlight: 'rgba(251,191,36,0.55)',
  },
  'elder-dragon': {
    border: 'border-rose-500/70',
    chip: 'bg-rose-500/15 text-rose-200 border-rose-400/40',
    glow: 'shadow-[0_0_45px_10px_rgba(244,63,94,0.55)]',
    backlight: 'rgba(244,63,94,0.55)',
  },
}

export const RARITY_MARKER_COLOR: Record<VisualRarity, string> = {
  normal: 'rgba(56,189,248,0.95)',
  tempered: 'rgba(139,92,246,0.95)',
  'arch-tempered': 'rgba(251,191,36,0.95)',
  'elder-dragon': 'rgba(244,63,94,0.95)',
}

export const RARITY_BACKGROUND_GLOW: Record<VisualRarity, string> = {
  normal: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(56,189,248,0.18), transparent 70%)',
  tempered: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(139,92,246,0.18), transparent 70%)',
  'arch-tempered': 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(251,191,36,0.22), transparent 70%)',
  'elder-dragon': 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(244,63,94,0.18), transparent 70%)',
}

export const RARITY_TEXT_CLASS: Record<VisualRarity, string> = {
  normal: 'text-sky-400',
  tempered: 'text-violet-400',
  'arch-tempered': 'text-amber-400',
  'elder-dragon': 'text-rose-400',
}
