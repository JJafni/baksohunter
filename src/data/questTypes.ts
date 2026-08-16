/** Quest objective types from the MHWiki quest icon set (Category:MHWiki_Quest_Icons). */
export type QuestType = 'hunt' | 'slay' | 'capture'

export type QuestTypeDefinition = {
  id: QuestType
  /** Short label shown on reveal (e.g. "Hunt"). */
  label: string
  /** One-line objective hint for the assigned quest type. */
  objective: string
  icon: string
}

export const QUEST_TYPES: QuestTypeDefinition[] = [
  {
    id: 'hunt',
    label: 'Hunt',
    objective: 'Slay or capture the target',
    icon: '/quest-icons/hunt.png',
  },
  {
    id: 'slay',
    label: 'Slay',
    objective: 'Slay the target',
    icon: '/quest-icons/slay.png',
  },
  {
    id: 'capture',
    label: 'Capture',
    objective: 'Capture the target',
    icon: '/quest-icons/capture.png',
  },
]

export const QUEST_TYPE_BY_ID = Object.fromEntries(
  QUEST_TYPES.map((quest) => [quest.id, quest]),
) as Record<QuestType, QuestTypeDefinition>

export function pickRandomQuestType(): QuestType {
  return QUEST_TYPES[Math.floor(Math.random() * QUEST_TYPES.length)].id
}

export function getQuestTypeIconUrls(): string[] {
  return QUEST_TYPES.map((quest) => quest.icon)
}
