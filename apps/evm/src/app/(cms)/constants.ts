import {
  AdvancedUserIcon,
  BeginnerUserIcon,
  TechnicalUserIcon,
} from './components/icons'

export const DOCS_URL = 'https://dev.sushi.com/'
export const DEFAULT_SIDE_PADDING = 'px-6 sm:px-4'
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
export const APP_HEADER_HEIGHT = 54
export const SORTING_OPTIONS = [
  { key: 'publishedAt:desc', name: 'Newest First' },
  { key: 'publishedAt:asc', name: 'Oldest First' },
  { key: 'title:desc', name: 'Sort Title Z-A' },
  { key: 'title:asc', name: 'Sort Title A-Z' },
]

export const getShareText = (title: string | undefined) =>
  title ? `Check out this Sushi article: ${title}` : undefined
