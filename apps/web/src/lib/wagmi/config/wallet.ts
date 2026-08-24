import type { ChainId } from 'sushi'
import { EvmChainId } from 'sushi/evm'

const SUPPORTED_CHAIN_IDS_BY_WALLET: Record<string, ChainId[]> = {
  argent: [EvmChainId.ETHEREUM],
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
