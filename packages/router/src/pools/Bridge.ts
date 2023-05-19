export const Bridge = {
  BentBox: 'BentoBox Bridge',
} as const

export type Bridge = (typeof Bridge)[keyof typeof Bridge]
