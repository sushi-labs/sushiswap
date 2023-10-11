export const Currency = {
  USD: 'USD',
  NATIVE: 'NATIVE',
} as const

export type Currency = typeof Currency[keyof typeof Currency]
