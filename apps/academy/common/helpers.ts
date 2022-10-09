import { AdvancedUserIcon, BeginnerUserIcon, TechnicalUserIcon } from './icons'

export const defaultSidePadding = 'px-6 sm:px-4'
export const difficultyElements = {
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
export const appHeaderHeight = 54
export const sortingOptions = [
  { key: 'publishedAt:desc', name: 'Date (desc)' },
  { key: 'publishedAt:asc', name: 'Date (asc)' },
  { key: 'title:desc', name: 'Title (desc)' },
  { key: 'title:asc', name: 'Title (asc)' },
]
