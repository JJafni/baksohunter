import type { CrateEntry } from './types'
import { ELDER_DRAGON_SLUGS } from './monsters'

/** Quest objective types from the MHWiki quest icon set (Category:MHWiki_Quest_Icons). */
export type QuestType = 'hunt' | 'slay' | 'capture'

export type QuestTypeDefinition = {
  id: QuestType
  /** Short label shown on reveal (e.g. "Hunt"). */
  label: string
  icon: string
}

export const QUEST_TYPES: QuestTypeDefinition[] = [
  {
    id: 'hunt',
    label: 'Hunt',
    icon: '/quest-icons/hunt.png',
  },
  {
    id: 'slay',
    label: 'Slay',
    icon: '/quest-icons/slay.png',
  },
  {
    id: 'capture',
    label: 'Capture',
    icon: '/quest-icons/capture.png',
  },
]

export const QUEST_TYPE_BY_ID = Object.fromEntries(
  QUEST_TYPES.map((quest) => [quest.id, quest]),
) as Record<QuestType, QuestTypeDefinition>

const RANDOM_QUEST_TYPES: QuestType[] = ['hunt', 'slay', 'capture']

export function isElderDragonEntry(entry: CrateEntry): boolean {
  return entry.rarity === 'normal' && ELDER_DRAGON_SLUGS.has(entry.slug)
}

export function pickQuestTypeForMonster(entry: CrateEntry): QuestType {
  if (isElderDragonEntry(entry)) return 'slay'
  return RANDOM_QUEST_TYPES[Math.floor(Math.random() * RANDOM_QUEST_TYPES.length)]
}

export function getQuestTypeIconUrls(): string[] {
  return QUEST_TYPES.map((quest) => quest.icon)
}
