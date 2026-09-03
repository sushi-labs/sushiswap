export const SVM_RPC_URL = `https://lb.drpc.live/solana/${process.env.NEXT_PUBLIC_DRPC_ID}`
// Browser WebSockets cannot attach dRPC's required Authorization header.
export const SVM_WS_RPC_URL = 'wss://api.mainnet-beta.solana.com'
const drpcJwt = process.env['NEXT_PUBLIC_DRPC_JWT']
export const SVM_RPC_HEADERS:
  | { Authorization: string }
  | Record<string, never> = drpcJwt ? { Authorization: drpcJwt } : {}
