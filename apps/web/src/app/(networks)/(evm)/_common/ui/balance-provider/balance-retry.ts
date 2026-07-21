import ms from 'ms'

const MAX_BALANCE_RETRY_DELAY = ms('30s')

export function getBalanceRetryDelay(failureCount: number): number {
  if (failureCount <= 0) return 0
  return Math.min(2 ** (failureCount - 1) * ms('1s'), MAX_BALANCE_RETRY_DELAY)
}

export function shouldRetryBalanceFetch({
  failureCount,
  force,
  lastErrorAt,
  now,
}: {
  failureCount: number
  force: boolean
  lastErrorAt: number | undefined
  now: number
}): boolean {
  if (force || !lastErrorAt) return true
  return now >= lastErrorAt + getBalanceRetryDelay(failureCount)
}
