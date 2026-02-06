import { createSolanaRpc } from '@solana/kit'
import { SVM_RPC_HEADERS, SVM_RPC_URL } from './config'

export type SvmRpcClient = ReturnType<typeof createSolanaRpc>

let rpcClient: SvmRpcClient | undefined

export function getSvmRpc() {
  if (!rpcClient) {
    rpcClient = createSolanaRpc(
      'https://mainnet.helius-rpc.com/?api-key=2f1f30b2-0307-4a4f-b310-dd2470256e2a',
    )
    // rpcClient = createSolanaRpc(SVM_RPC_URL, {
    //   headers: SVM_RPC_HEADERS,
    // })
  }

  return rpcClient
}
