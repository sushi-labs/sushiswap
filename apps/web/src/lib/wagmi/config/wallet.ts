import { all as portoChains } from 'porto/Chains'
import { EvmChainId, isEvmChainId } from 'sushi/evm'

const SUPPORTED_CHAIN_IDS_BY_WALLET: Record<string, EvmChainId[]> = {
  argent: [EvmChainId.ETHEREUM],
  ['xyz.ithaca.porto']: portoChains
    .map((chain) => chain.id)
    .filter((chainId) => isEvmChainId(chainId)),
}

export const isChainIdSupportedByWallet = ({
  chainId,
  walletId,
}: { chainId: EvmChainId; walletId: string }) => {
  return (
    !SUPPORTED_CHAIN_IDS_BY_WALLET[walletId] ||
    SUPPORTED_CHAIN_IDS_BY_WALLET[walletId].includes(chainId)
  )
}
