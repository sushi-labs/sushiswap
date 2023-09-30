import { createClient } from '@vercel/edge-config'

interface FeatureFlags {
  maintenance: boolean
  swapApi: boolean
}

export async function get(key: keyof FeatureFlags) {
  const edgeConfig = createClient(process.env.EDGE_CONFIG)
  const featureFlag = await edgeConfig.get(key)
  return featureFlag
}