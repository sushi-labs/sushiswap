import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet'
import { isEvmAddress } from 'sushi/evm'
import z from 'zod'
import { IS_PERPS_TESTNET } from '../config'
import { useLeadingVaults, useUserVaultEquities } from '../info'

const PnlPeriodSchema = z.enum(['day', 'week', 'month', 'allTime'])
const RelationshipTypeSchema = z.enum(['parent', 'normal', 'child'])

const VaultRelationshipSchema = z.object({
  type: RelationshipTypeSchema,
})

const EvmAddressSchema = z.string().refine((val) => {
  return isEvmAddress(val)
}, 'Invalid EVM address')

const VaultSummarySchema = z.object({
  name: z.string(),
  vaultAddress: EvmAddressSchema,
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

export type PerpsVaultsResponse = z.infer<typeof VaultsResponseSchema>

export const useAllVaults = () => {
  const address = useAccount('evm')
  const { data: userVaultEquities, isLoading: isLoadingUserVaultEquities } =
    useUserVaultEquities({ address })
  const { data: leadingVaults, isLoading: isLoadingLeaders } = useLeadingVaults(
    { address },
  )
  const query = useQuery({
    queryKey: ['all-perps-vaults', address, userVaultEquities, leadingVaults],
    queryFn: async () => {
      const response = await fetch(
        `https://stats-data.hyperliquid.xyz/${IS_PERPS_TESTNET ? 'Testnet' : 'Mainnet'}/vaults`,
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
      const rawVaults = parsed.data
      return rawVaults.map((vault) => {
        const depositAmount =
          userVaultEquities?.find(
            (equity) =>
              equity?.vaultAddress?.toLowerCase() ===
              vault?.summary?.vaultAddress?.toLowerCase(),
          )?.equity || '0'
        const isVaultLeader =
          leadingVaults?.some(
            (leaderVault) =>
              leaderVault?.address?.toLowerCase() ===
              vault?.summary?.vaultAddress?.toLowerCase(),
          ) ?? false
        return {
          ...vault,
          depositAmount,
          isVaultLeader,
        }
      })
    },
  })
  return {
    ...query,
    isLoading:
      query.isLoading || isLoadingUserVaultEquities || isLoadingLeaders,
  }
}

export type PerpsVault = NonNullable<
  Awaited<ReturnType<typeof useAllVaults>>['data']
>[number]
