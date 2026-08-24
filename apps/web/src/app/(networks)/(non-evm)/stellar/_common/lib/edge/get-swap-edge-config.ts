import { get } from '@vercel/edge-config'
import { cacheLife } from 'next/cache'

interface SwapEdgeConfig {
  maintenance: boolean
}

async function getSwapEdgeConfig(): Promise<SwapEdgeConfig> {
  'use cache'
  cacheLife('minutes')

  try {
    return (await get<SwapEdgeConfig>('swap')) ?? { maintenance: false }
  } catch {
    return { maintenance: false }
  }
}

export { type SwapEdgeConfig, getSwapEdgeConfig }
