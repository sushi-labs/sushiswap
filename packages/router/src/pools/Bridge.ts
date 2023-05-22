export const Bridge = {
  BentoBox: 'BentoBox Bridge',
} as const

export type Bridge = (typeof Bridge)[keyof typeof Bridge]
