export const possibleTimeframes = ['24h', '7d', '30d'] as const
export type Timeframe = (typeof possibleTimeframes)[number]
export const timeframeStrings: Record<
  (typeof possibleTimeframes)[number],
  string
> = {
  '24h': 'Last 24 Hours',
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
}
