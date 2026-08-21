import { get } from '@vercel/edge-config'
import { cacheLife } from 'next/cache'
import {
  type SwapEdgeConfig,
  defaultSwapEdgeConfig,
  parseSwapEdgeConfig,
} from './swap-edge-config'

/**
 * Live, uncached read. `maintenance` is an incident kill switch, so anything
 * that gates trading on it must not read through a cache.
 */
async function readSwapEdgeConfig(): Promise<SwapEdgeConfig> {
  try {
    return parseSwapEdgeConfig(await get('swap'))
  } catch {
    return defaultSwapEdgeConfig
  }
}

/**
 * Cached read, used only to seed `useIsSwapMaintenance`'s `initialData` in the
 * prerendered shell. The client repolls `/api/config/swap` (uncached) every
 * minute, so a stale seed cannot hold the kill switch off.
 */
async function getSwapEdgeConfig(): Promise<SwapEdgeConfig> {
  'use cache'
  cacheLife('minutes')

  return readSwapEdgeConfig()
}

export { getSwapEdgeConfig, readSwapEdgeConfig }
