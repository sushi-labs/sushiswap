import { svmAddress } from 'sushi/svm'

export const SVM_RPC_URL = 'https://solana.drpc.org'

const drpcJwt = process.env['NEXT_PUBLIC_DRPC_JWT']
export const SVM_RPC_HEADERS:
  | { Authorization: string }
  | Record<string, never> = drpcJwt ? { Authorization: drpcJwt } : {}

export const SVM_FALLBACK_ACCOUNT = svmAddress(
  '8N2ssXZGJbvVLszanERuCJpLZd2nuADgpZwLkDDxwNnS',
)
