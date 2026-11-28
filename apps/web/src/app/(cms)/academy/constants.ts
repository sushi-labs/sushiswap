import {
  AdvancedUserIcon,
  BeginnerUserIcon,
  TechnicalUserIcon,
} from '../components/icons'

export const DIFFICULTY_ELEMENTS = {
  beginner: {
    color: '#7CFF6B',
    Icon: BeginnerUserIcon,
  },
  advanced: {
    color: '#EEB531',
    Icon: AdvancedUserIcon,
  },
  technical: {
    color: '#F338C3',
    Icon: TechnicalUserIcon,
  },
}

export type StyledDifficultySlug = keyof typeof DIFFICULTY_ELEMENTS

export function isStyledDifficulty(
  slug: string | null,
): slug is StyledDifficultySlug {
  return slug !== null && Object.hasOwn(DIFFICULTY_ELEMENTS, slug)
}
