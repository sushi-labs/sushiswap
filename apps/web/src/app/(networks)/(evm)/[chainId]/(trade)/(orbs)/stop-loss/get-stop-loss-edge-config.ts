import { get } from '@vercel/edge-config'

interface StopLossEdgeConfig {
  maintenance: boolean
}

const getStopLossEdgeConfig = async () => {
  return get<StopLossEdgeConfig>('limit')
}

export { type StopLossEdgeConfig, getStopLossEdgeConfig }
