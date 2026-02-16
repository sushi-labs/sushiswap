'use client'

import { getBase64Decoder } from '@solana/codecs-strings'
import {
  type TransactionMessageBytesBase64,
  getBase64Encoder,
  getTransactionDecoder,
} from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import { getSvmRpc } from '../rpc'

const transactionDecoder = getTransactionDecoder()
const base64Decoder = getBase64Decoder()
const base64Encoder = getBase64Encoder()

export function useSvmEstimateGas({
  unsignedTx,
  enabled = true,
}: {
  unsignedTx: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: ['svmEstimateGas', { unsignedTx }],
    queryFn: async () => {
      if (!unsignedTx) {
        throw new Error('Transaction is required for SVM gas estimation')
      }

      const rpc = getSvmRpc()

      const start = Date.now()

      const base64Encoded = base64Encoder.encode(unsignedTx)
      const decodedTx = transactionDecoder.decode(base64Encoded)
      const messageBase64 = base64Decoder.decode(decodedTx.messageBytes)

      const { value } = await rpc
        .getFeeForMessage(messageBase64 as TransactionMessageBytesBase64, {})
        .send()

      console.log('gas', Date.now() - start)

      return value ?? null
    },
    enabled: Boolean(enabled && unsignedTx),
    staleTime: 15_000,
  })
}
