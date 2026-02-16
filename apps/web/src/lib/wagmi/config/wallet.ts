import { all as portoChains } from 'porto/core/Chains'
import type { ChainId } from 'sushi'
import { EvmChainId, isEvmChainId } from 'sushi/evm'

const SUPPORTED_CHAIN_IDS_BY_WALLET: Record<string, ChainId[]> = {
  argent: [EvmChainId.ETHEREUM],
  ['xyz.ithaca.porto']: portoChains
    .map((chain) => chain.id)
    .filter((chainId) => isEvmChainId(chainId)),
}

export const isChainIdSupportedByWallet = ({
  chainId,
  walletId,
}: { chainId: ChainId; walletId: string }) => {
  return (
    !SUPPORTED_CHAIN_IDS_BY_WALLET[walletId] ||
    SUPPORTED_CHAIN_IDS_BY_WALLET[walletId].includes(chainId)
  )
}
