import { get } from '@vercel/edge-config'
import * as z from 'zod'

const swapEdgeConfigSchema = z.object({
  maintenance: z.boolean(),
})

type SwapEdgeConfig = z.infer<typeof swapEdgeConfigSchema>

const defaultSwapEdgeConfig: SwapEdgeConfig = {
  maintenance: false,
}

function parseSwapEdgeConfig(value: unknown): SwapEdgeConfig {
  const result = swapEdgeConfigSchema.safeParse(value)
  return result.success ? result.data : defaultSwapEdgeConfig
}

async function getSwapEdgeConfig(): Promise<SwapEdgeConfig> {
  try {
    return parseSwapEdgeConfig(await get('swap'))
  } catch {
    return defaultSwapEdgeConfig
  }
}

export {
  type SwapEdgeConfig,
  defaultSwapEdgeConfig,
  getSwapEdgeConfig,
  parseSwapEdgeConfig,
  swapEdgeConfigSchema,
}
