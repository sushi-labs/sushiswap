import { get } from '@vercel/edge-config'

interface TakeProfitEdgeConfig {
  maintenance: boolean
}

const getTakeProfitEdgeConfig = async () => {
  return get<TakeProfitEdgeConfig>('limit')
}

export { type TakeProfitEdgeConfig, getTakeProfitEdgeConfig }
