export const Fee = {
  LOW: 1,
  MEDIUM: 5,
  AVERAGE: 10,
  DEFAULT: 30,
  HIGH: 100,
  //   MAX = 10000
} as const

export type Fee = (typeof Fee)[keyof typeof Fee]
