import { initiateClaim } from '@sushiswap/graph-client/migration-claim'
import { createFailedToast, createSuccessToast } from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import type { EvmAddress, EvmChainId } from 'sushi/evm'

export const useInitiateClaim = () => {
  return useMutation({
    mutationKey: ['useInitiateClaim', 'v2-migration-claim'],
    mutationFn: async ({
      address,
      message,
      signature,
      chainId,
    }: {
      address: EvmAddress
      message: string
      signature: string
      chainId: number
    }) => {
      return await initiateClaim({ address, message, signature, chainId })
    },
    onError: (error, variables, _context) => {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred'
      const ts = Date.now()
      createFailedToast({
        summary: errorMessage,
        type: 'burn',
        account: variables.address,
        chainId: variables.chainId as EvmChainId,
        groupTimestamp: ts,
        timestamp: ts,
      })
    },
    onSuccess: (data, variables, _context) => {
      const ts = Date.now()
      if (data.success) {
        createSuccessToast({
          summary: data.message,
          type: 'burn',
          account: variables.address,
          chainId: variables.chainId as EvmChainId,
          groupTimestamp: ts,
          timestamp: ts,
        })
      } else {
        createFailedToast({
          summary: data.message,
          type: 'burn',
          account: variables.address,
          chainId: variables.chainId as EvmChainId,
          groupTimestamp: ts,
          timestamp: ts,
        })
      }
    },
  })
}
