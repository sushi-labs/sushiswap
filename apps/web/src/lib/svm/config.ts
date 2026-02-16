export const SVM_RPC_URL = `https://lb.drpc.live/solana/${process.env.NEXT_PUBLIC_DRPC_ID}`

const drpcJwt = process.env['NEXT_PUBLIC_DRPC_JWT']
export const SVM_RPC_HEADERS:
  | { Authorization: string }
  | Record<string, never> = drpcJwt ? { Authorization: drpcJwt } : {}
