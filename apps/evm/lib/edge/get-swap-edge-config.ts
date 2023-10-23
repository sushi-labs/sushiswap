import { get } from '@vercel/edge-config'

interface SwapEdgeConfig {
  maintenance: boolean
}

const getSwapEdgeConfig = async () => {
  return await get<SwapEdgeConfig>('swap')
}

export { type SwapEdgeConfig, getSwapEdgeConfig }
