import { EvmToken } from 'sushi/evm'
import { STELLAR_USDT0, StellarChainId } from 'sushi/stellar'
import { getAddress } from 'viem'
import {
  LAYERZERO_USDT0_EVM_DEPLOYMENTS,
  type LayerZeroChainId,
} from './config'

export function getLayerZeroCurrency(
  chainId: LayerZeroChainId,
): TokenFor<LayerZeroChainId> {
  if (chainId === StellarChainId.STELLAR) {
    return STELLAR_USDT0[StellarChainId.STELLAR]
  }
  const deployment = LAYERZERO_USDT0_EVM_DEPLOYMENTS[chainId]
  return new EvmToken({
    chainId,
    address: getAddress(deployment.tokenAddress),
    decimals: 6,
    symbol: deployment.symbol,
    name: deployment.symbol,
  })
}
