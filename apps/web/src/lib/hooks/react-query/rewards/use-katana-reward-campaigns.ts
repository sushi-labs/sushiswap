import { type EvmAddress, EvmChainId } from 'sushi/evm'
import { useRewardCampaigns } from './useRewardCampaigns'

interface UseKatanaRewardCampaignsParams {
  pool: EvmAddress | undefined
  chainId: EvmChainId | undefined
  enabled?: boolean
}

const KATANA_MAIN_PARAMETER_SUFFIX = 'SUSHI_STAKER'

export function useKatanaRewardCampaigns({
  pool,
  chainId,
  enabled = true,
}: UseKatanaRewardCampaignsParams) {
  return useRewardCampaigns({
    pool,
    chainId,
    mainParameterSuffix: KATANA_MAIN_PARAMETER_SUFFIX,
    enabled: enabled && chainId === EvmChainId.KATANA,
  })
}
