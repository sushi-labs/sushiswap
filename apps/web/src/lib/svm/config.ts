import { getRpcHeaders, getRpcUrl } from 'src/lib/rpc'

export const SVM_RPC_URL = getRpcUrl('solana')
export const SVM_WS_RPC_URL = `wss://lb.drpc.live/solana/${process.env.NEXT_PUBLIC_DRPC_SOLANA_WS_ID}`
export const SVM_RPC_HEADERS = getRpcHeaders()
