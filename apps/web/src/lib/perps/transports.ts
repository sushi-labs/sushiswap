import { HttpTransport, WebSocketTransport } from '@nktkas/hyperliquid'
import { EvmChainId } from 'sushi/evm'
import { publicTransports } from '../wagmi/config/viem'
import { IS_PERPS_TESTNET } from './config'

export const hlHttpTransport = new HttpTransport({
  rpcUrl: publicTransports[EvmChainId.HYPEREVM].toString(),
  isTestnet: IS_PERPS_TESTNET,
})

export const hlWebSocketTransport = new WebSocketTransport({
  isTestnet: IS_PERPS_TESTNET,
})
