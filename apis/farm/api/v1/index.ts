import type { VercelRequest, VercelResponse } from '@vercel/node'

import redis from '../../lib/redis'

interface ChainIdFarmMap {
  [key: string]: {
    chainId: number
    farms: FarmsMap
  }
}

interface FarmsMap {
  [poolAddress: string]: Farm
}

interface Farm {
  id: string
  chainId: number
  pool: string
  incentives: {
    apr: number
    rewardPerDay: number
    rewardToken: {
      address: string
      decimals: number
      symbol: string
    }
    rewarder: {
      address: string
      type: 'Primary' | 'Secondary'
    }
  }[]
  chefType: 'MasterChefV1' | 'MasterChefV2' | 'MiniChef'
  poolType: 'Legacy' | 'Trident' | 'Kashi' | 'Unknown'
}

export default async (request: VercelRequest, response: VercelResponse) => {
  const data = await redis.hgetall('farms')

  if (!data) {
    return response.status(503)
  }

  return response.status(200).json(
    Object.entries(data).reduce((previousValue: Farm[], [key, value]: [string, string]) => {
      const {
        chainId,
        farms,
      }: {
        chainId: number
        farms: FarmsMap
      } = JSON.parse(value)
      return [
        ...previousValue,
        ...Object.entries(farms).reduce<Farm[]>(
          (previousValue, [key, value]) => [
            ...previousValue,
            {
              ...value,
              id: `${chainId}:${key}`,
              chainId,
              pool: key,
            },
          ],
          []
        ),
      ]
    }, [])
  )
}
