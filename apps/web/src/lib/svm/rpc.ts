import { createSolanaRpc } from '@solana/kit'
import { SVM_RPC_HEADERS, SVM_RPC_URL } from './config'

export type SvmRpcClient = ReturnType<typeof createSolanaRpc>

let rpcClient: SvmRpcClient | undefined

export function getSvmRpc() {
  if (!rpcClient) {
    rpcClient = createSolanaRpc(SVM_RPC_URL, {
      headers: SVM_RPC_HEADERS,
    })
  }

  return rpcClient
}
