export const cookieTypes = [
  'essential',
  'functional',
  'analytical',
  'google',
  'hotjar',
] as const

export type CookieType = (typeof cookieTypes)[number]

export const alwaysEnabledCookieTypes = ['essential'] as const

export type ManageAction =
  | {
      type: 'confirm'
    }
  | {
      type: 'set'
      cookieType: CookieType
      enabled: boolean
    }
  | {
      type: 'reject'
    }
