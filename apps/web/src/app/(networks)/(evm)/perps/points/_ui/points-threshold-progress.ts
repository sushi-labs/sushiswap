export type PointThreshold = {
  thresholdUsd: number
  multiplier: number
}

export function getProgressPercent({
  totalFeesUsd,
  thresholds,
}: {
  totalFeesUsd: number
  thresholds: PointThreshold[]
}) {
  if (thresholds.length === 0) {
    return 0
  }

  const firstThresholdUsd = thresholds[0].thresholdUsd
  const startsAtZero = firstThresholdUsd === 0
  const segmentCount = startsAtZero ? thresholds.length - 1 : thresholds.length

  if (segmentCount <= 0) {
    return totalFeesUsd >= firstThresholdUsd ? 100 : 0
  }

  const nextThresholdIndex = thresholds.findIndex(
    (threshold) => totalFeesUsd < threshold.thresholdUsd,
  )

  if (nextThresholdIndex === -1) {
    return 100
  }

  const completedSegments = startsAtZero
    ? nextThresholdIndex - 1
    : nextThresholdIndex
  const previousThresholdUsd =
    nextThresholdIndex === 0
      ? 0
      : thresholds[nextThresholdIndex - 1].thresholdUsd
  const nextThresholdUsd = thresholds[nextThresholdIndex].thresholdUsd
  const segmentProgress =
    (totalFeesUsd - previousThresholdUsd) /
    (nextThresholdUsd - previousThresholdUsd)

  return Math.min(
    100,
    Math.max(0, ((completedSegments + segmentProgress) / segmentCount) * 100),
  )
}
