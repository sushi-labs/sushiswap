import { useQuery } from '@tanstack/react-query'
import z from 'zod'

const PnlPeriodSchema = z.enum(['day', 'week', 'month', 'allTime'])
const RelationshipTypeSchema = z.enum(['parent', 'normal', 'child'])

const VaultRelationshipSchema = z.object({
  type: RelationshipTypeSchema,
})

const VaultSummarySchema = z.object({
  name: z.string(),
  vaultAddress: z.string(),
  leader: z.string(),
  tvl: z.string(),
  isClosed: z.boolean(),
  relationship: VaultRelationshipSchema,
  createTimeMillis: z.number(),
})

const VaultPnlSchema = z.tuple([PnlPeriodSchema, z.array(z.string())])

export const VaultSchema = z.object({
  apr: z.number(),
  pnls: z.array(VaultPnlSchema),
  summary: VaultSummarySchema,
})

export const VaultsResponseSchema = z.array(VaultSchema)

export type Vault = z.infer<typeof VaultSchema>
export type VaultsResponse = z.infer<typeof VaultsResponseSchema>

export const useAllVaults = () => {
  return useQuery({
    queryKey: ['all-perps-vaults'],
    queryFn: async () => {
      const response = await fetch(
        'https://stats-data.hyperliquid.xyz/Mainnet/vaults',
      )
      if (!response.ok) {
        throw new Error('Failed to fetch vaults')
      }
      const data = await response.json()
      const parsed = VaultsResponseSchema.safeParse(data)
      if (!parsed.success) {
        console.error('Failed to parse vaults response', parsed.error)
        throw new Error('Failed to parse vaults response')
      }
      return parsed.data
    },
  })
}
