import MockDate from 'mockdate'

export const FIXED_NOW = new Date('2026-01-15T12:00:00.000Z')

export function withFixedTime(): () => void {
  MockDate.set(FIXED_NOW)
  return () => MockDate.reset()
}
