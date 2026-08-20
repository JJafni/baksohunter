export const CARD_SIZE = 132
export const CARD_GAP = 18
export const SLOT = CARD_SIZE + CARD_GAP
export const REEL_LENGTH = 56
export const CENTER_INDEX = 46
/** Vertical reel viewport height (desktop scroll axis). */
export const VIEWPORT_HEIGHT = 620
export const SPIN_MS = 4800
export const OPEN_MS = 700
/** Delay after reveal before spinner fades out. */
export const REVEAL_UI_FADE_DELAY_MS = 3000
/** Delay after monster reveal before the quest type badge appears. */
export const QUEST_TYPE_REVEAL_DELAY_MS = 1000
/** Width of the vertical reel block on desktop. */
export const REEL_WIDTH = CARD_SIZE + 40
/** Horizontal reel frame height on mobile. */
export const MOBILE_REEL_HEIGHT = CARD_SIZE + 40
/** Horizontal reel viewport cap (mobile and desktop overlay). */
export const MOBILE_REEL_MAX_WIDTH = 620
/** Max width for stacked hunt columns (mobile and desktop overlay). */
export const HUNT_COLUMN_MAX_WIDTH = 620
/** Horizontal reel viewport cap on desktop overlay panels. */
export const DESKTOP_OVERLAY_REEL_MAX_WIDTH = HUNT_COLUMN_MAX_WIDTH
/** Shared min-height for desktop overlay footer (monster filters + action row). */
export const DESKTOP_OVERLAY_ACTIONS_MIN_HEIGHT = '13.25rem'
/** Taller mobile overlay footer — keeps large pool filter chips at full size. */
export const MOBILE_OVERLAY_ACTIONS_MIN_HEIGHT = '17rem'
