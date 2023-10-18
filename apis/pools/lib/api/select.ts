import * as Database from '@sushiswap/database'

export const SushiPoolSelect = {
  id: true,
  address: true,
  name: true,
  chainId: true,
  protocol: true,
  swapFee: true,
  twapEnabled: true,
  totalSupply: true,
  liquidityUSD: true,
  volumeUSD: true,
  feeApr1h: true,
  feeApr1d: true,
  feeApr1w: true,
  feeApr1m: true,
  totalApr1h: true,
  totalApr1d: true,
  totalApr1w: true,
  totalApr1m: true,
  incentiveApr: true,
  isIncentivized: true,
  wasIncentivized: true,
  fees1h: true,
  fees1d: true,
  fees1w: true,
  fees1m: true,
  feesChange1h: true,
  feesChange1d: true,
  feesChange1w: true,
  feesChange1m: true,
  volume1h: true,
  volume1d: true,
  volume1w: true,
  volume1m: true,
  volumeChange1h: true,
  volumeChange1d: true,
  volumeChange1w: true,
  volumeChange1m: true,
  liquidityUSDChange1h: true,
  liquidityUSDChange1d: true,
  liquidityUSDChange1w: true,
  liquidityUSDChange1m: true,
  isBlacklisted: true,
  token0: {
    select: {
      id: true,
      address: true,
      name: true,
      symbol: true,
      decimals: true,
    },
  },
  token1: {
    select: {
      id: true,
      address: true,
      name: true,
      symbol: true,
      decimals: true,
    },
  },
  incentives: {
    select: {
      id: true,
      pid: true,
      chainId: true,
      chefType: true,
      apr: true,
      rewarderAddress: true,
      rewarderType: true,
      rewardPerDay: true,
      rewardToken: {
        select: {
          id: true,
          address: true,
          name: true,
          symbol: true,
          decimals: true,
        },
      },
    },
  },
  hadEnabledSteerVault: true,
  hasEnabledSteerVault: true,
  steerVaults: {
    select: {
      id: true,
      address: true,
      chainId: true,

      feeTier: true,

      apr: true,
      apr1d: true,
      apr1w: true,
      // apr1m: true,
      // apr1y: true,

      token0: {
        select: {
          id: true,
          address: true,
          name: true,
          symbol: true,
          decimals: true,
        },
      },
      reserve0: true,
      reserve0USD: true,
      fees0: true,
      fees0USD: true,

      token1: {
        select: {
          id: true,
          address: true,
          name: true,
          symbol: true,
          decimals: true,
        },
      },
      reserve1: true,
      reserve1USD: true,
      fees1: true,
      fees1USD: true,

      reserveUSD: true,
      feesUSD: true,

      strategy: true,
      payloadHash: true,
      // description: true,
      // state: true

      performanceFee: true,

      lowerTick: true,
      upperTick: true,

      adjustmentFrequency: true,
      lastAdjustmentTimestamp: true,

      isEnabled: true,
      wasEnabled: true,

      creator: true,
      admin: true,
      manager: true,
    },
  },
} as const satisfies Database.Prisma.SushiPoolSelect
