import { AdvancedUserIcon, BeginnerUserIcon, TechnicalUserIcon } from './icons'

export const docsUrl = 'https://dev.sushi.com/'
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
  { key: 'publishedAt:desc', name: 'Newest articles first' },
  { key: 'publishedAt:asc', name: 'Oldest articles first' },
  { key: 'title:desc', name: 'Sort on title Z-A' },
  { key: 'title:asc', name: 'Sort on title A-Z' },
]

export const getShareText = (title: string) => `Check out this Sushi article: ${title}`
