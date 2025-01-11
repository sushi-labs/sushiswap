export const DOCS_URL = 'https://docs.sushi.com/'
export const DEFAULT_SIDE_PADDING = 'px-6 sm:px-4'
export const APP_HEADER_HEIGHT = 54

export const SORTING_OPTIONS = [
  { key: 'publishedAt:desc', name: 'Newest First' },
  { key: 'publishedAt:asc', name: 'Oldest First' },
  { key: 'title:asc', name: 'Sort Title A-Z' },
  { key: 'title:desc', name: 'Sort Title Z-A' },
]

export const getShareText = (title: string | undefined) =>
  title ? `Check out this Sushi article: ${title}` : undefined
