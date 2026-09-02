import type { LazyConnectorDefinition } from 'src/lib/wagmi/config/connector-utils'

export const safeConnectorDefinition = {
  id: 'safe',
  name: 'Safe',
  type: 'safe',
  async load() {
    const { safe } = await import('@wagmi/connectors')
    return safe()
  },
} satisfies LazyConnectorDefinition
