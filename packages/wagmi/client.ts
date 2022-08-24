import { config } from '@sushiswap/wagmi-config'
import { createClient } from 'wagmi'

export type Client = ReturnType<typeof createClient>

export const client: Client = createClient(config)
