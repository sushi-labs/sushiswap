import { HttpTransport, WebSocketTransport } from '@nktkas/hyperliquid'
import { EvmChainId } from 'sushi/evm'
import { publicTransports } from '../wagmi/config/viem'

export const hlHttpTransport = new HttpTransport({
  rpcUrl: publicTransports[EvmChainId.HYPEREVM].toString(),
})

export const hlWebSocketTransport = new WebSocketTransport()
