import { get } from '@vercel/edge-config'
import { cacheLife } from 'next/cache'
import {
  type SwapEdgeConfig,
  defaultSwapEdgeConfig,
  parseSwapEdgeConfig,
} from './swap-edge-config'

async function getSwapEdgeConfig(): Promise<SwapEdgeConfig> {
  'use cache'
  cacheLife('minutes')

  try {
    return parseSwapEdgeConfig(await get('swap'))
  } catch {
    return defaultSwapEdgeConfig
  }
}

export { getSwapEdgeConfig }
