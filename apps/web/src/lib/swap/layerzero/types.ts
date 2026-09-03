import type { Hex } from 'viem'
import type { LayerZeroChainId } from './config'

export interface LayerZeroSendParam {
  dstEid: number
  to: Hex
  amountLD: bigint
  minAmountLD: bigint
  extraOptions: Hex
  composeMsg: Hex
  oftCmd: Hex
}

export interface LayerZeroQuote {
  fromChainId: LayerZeroChainId
  toChainId: LayerZeroChainId
  sourceAddress: AddressFor<LayerZeroChainId> | undefined
  recipient: AddressFor<LayerZeroChainId> | undefined
  amountIn: bigint
  amountSent: bigint
  amountOut: bigint
  minAmountOut: bigint
  nativeFee: bigint
  maxNativeFee: bigint
  sendParam: LayerZeroSendParam
}

export interface LayerZeroStatus {
  status: 'PENDING' | 'SUCCESS' | 'ACTION_REQUIRED'
  destinationTxHash?: string
}
