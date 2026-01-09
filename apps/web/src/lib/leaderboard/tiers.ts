export type TierId =
  | 'clay'
  | 'wood'
  | 'iron'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'master'
  | 'grandmaster'

export type Tier = {
  id: TierId
  name: string
  /** inclusive lower bound */
  minPoints: number
  maxPoints: number | null
  icon: keyof typeof TIER_ICONS
  accent: {
    bgClass: string
  }
}

export const TIERS: Tier[] = [
  {
    id: 'clay',
    name: 'Clay',
    minPoints: 0,
    maxPoints: 2_500,
    icon: 'Clay',
    accent: {
      bgClass: 'bg-[#f3e8ff]',
    },
  },
  {
    id: 'wood',
    name: 'Wood',
    minPoints: 2_500,
    maxPoints: 10_000,
    icon: 'Wood',
    accent: {
      bgClass: 'bg-[#ffedd5]',
    },
  },
  {
    id: 'iron',
    name: 'Iron',
    minPoints: 10_000,
    maxPoints: 50_000,
    icon: 'Iron',
    accent: {
      bgClass: 'bg-[#e0f2fe]',
    },
  },
  {
    id: 'bronze',
    name: 'Bronze',
    minPoints: 50_000,
    maxPoints: 75_000,
    icon: 'Bronze-Medal',
    accent: {
      bgClass: 'bg-[#fef3c7]',
    },
  },
  {
    id: 'silver',
    name: 'Silver',
    minPoints: 75_000,
    maxPoints: 150_000,
    icon: 'Silver-Medal',
    accent: {
      bgClass: 'bg-[#e4e4e7]',
    },
  },
  {
    id: 'gold',
    name: 'Gold',
    minPoints: 150_000,
    maxPoints: 300_000,
    icon: 'Gold-Medal',
    accent: {
      bgClass: 'bg-[#fff7ed]',
    },
  },
  {
    id: 'platinum',
    name: 'Platinum',
    minPoints: 300_000,
    maxPoints: 1_000_000,
    icon: 'Platinum',
    accent: {
      bgClass: 'bg-[#f0fdfa]',
    },
  },
  {
    id: 'diamond',
    name: 'Diamond',
    minPoints: 1_000_000,
    maxPoints: 50_000_000,
    icon: 'Gem',
    accent: {
      bgClass: 'bg-[#fdf4ff]',
    },
  },
  {
    id: 'master',
    name: 'Master',
    minPoints: 50_000_000,
    maxPoints: 100_000_000,
    icon: 'Flame',
    accent: {
      bgClass: 'bg-[#fff1f2]',
    },
  },
  {
    id: 'grandmaster',
    name: 'Grandmaster',
    minPoints: 100_000_000,
    maxPoints: null,
    icon: 'Crown',
    accent: {
      bgClass: 'bg-[#fffbeb]',
    },
  },
]

export const TIER_ICONS = {
  Clay: '🏺',
  Wood: '🪵',
  Iron: '🛡️',
  'Bronze-Medal': '🥉',
  'Silver-Medal': '🥈',
  'Gold-Medal': '🥇',
  Platinum: '💠',
  Gem: '💎',
  Flame: '🔥',
  Crown: '👑',
} as const

export const getTierForPoints = (points: number): Tier => {
  const p = Math.max(0, Math.floor(points))
  const tier =
    TIERS.find(
      (t) => p >= t.minPoints && (t.maxPoints == null || p < t.maxPoints),
    ) ?? TIERS[0]
  return tier
}

export const getNextTier = (points: number): Tier | null => {
  const current = getTierForPoints(points)
  const idx = TIERS.findIndex((t) => t.id === current.id)
  return idx >= 0 && idx < TIERS.length - 1 ? TIERS[idx + 1] : null
}

export const getTierProgress = (points: number) => {
  const p = Math.max(0, Math.floor(points))
  const current = getTierForPoints(p)
  const next = getNextTier(p)

  const tierMin = current.minPoints
  const tierMax = current.maxPoints ?? tierMin + 1 // avoid div by zero for top tier

  const denom = Math.max(1, tierMax - tierMin)
  const withinTier = Math.min(Math.max(p - tierMin, 0), denom)

  const progressPct = (withinTier / denom) * 100
  const ptsToNext = next ? Math.max(0, next.minPoints - p) : 0

  return {
    current,
    next,
    progressPct,
    ptsToNext,
    tierMin,
    tierMax: current.maxPoints,
  }
}

type MilestonePiece = {
  isFilled: boolean
  isNext: boolean
  pointsPerBlock: number
}

export const getMilestoneBlocks = (points: number): MilestonePiece[] => {
  const p = Math.max(0, Math.floor(points))
  const tier = getTierForPoints(p)

  // Grandmaster (no cap) → show all filled, block size is 0 (no next target)
  if (tier.maxPoints == null) {
    return Array.from({ length: 7 }, () => ({
      isFilled: true,
      isNext: false,
      pointsPerBlock: Number.POSITIVE_INFINITY,
    }))
  }

  const tierSpan = tier.maxPoints - tier.minPoints
  const pointsPerBlock = Math.ceil(tierSpan / 7)

  const progressInTier = Math.max(0, p - tier.minPoints)
  const filledCount = Math.floor(progressInTier / pointsPerBlock)

  return Array.from({ length: 7 }, (_, i) => ({
    isFilled: i < filledCount,
    isNext: i === filledCount && filledCount < 7,
    pointsPerBlock,
  }))
}

export function useTierUi(points: number) {
  const { current, next, progressPct, ptsToNext } = getTierProgress(points)
  const milestones = getMilestoneBlocks(points)

  return {
    currentTier: current,
    ptsToNextRank: ptsToNext,
    tierProgressPct: progressPct,
    milestones,
    nextTier: next ?? null,
  }
}
