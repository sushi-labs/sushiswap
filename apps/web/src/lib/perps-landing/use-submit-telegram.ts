import { submitTelegram } from '@sushiswap/graph-client/perps-landing-api'
import { createFailedToast, createSuccessToast } from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'

const _extractGraphQLErrorMessage = (error: string) => {
  try {
    const jsonStart = error.indexOf('{')
    const parsed = JSON.parse(error.slice(jsonStart))
    return parsed?.response?.errors?.[0]?.message ?? error
  } catch {
    return error
  }
}

export const useSubmitTelegram = () => {
  return useMutation({
    mutationKey: ['useSubmitTelegram', 'perps-landing', 'telegram'],
    mutationFn: async ({
      telegramHandle,
      address,
    }: {
      telegramHandle: string
      address?: EvmAddress
    }) => {
      return await submitTelegram({ telegramHandle, address })
    },
    onError: (error, variables, _context) => {
      const errorMessage = _extractGraphQLErrorMessage(error?.message)
      const ts = Date.now()
      createFailedToast({
        summary: errorMessage,
        type: 'burn',
        account: variables.address ?? '0x00',
        chainId: 1,
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
          account: variables.address ?? '0x00',
          chainId: 1,
          groupTimestamp: ts,
          timestamp: ts,
        })
      } else {
        createFailedToast({
          summary: data.message,
          type: 'burn',
          account: variables.address ?? '0x00',
          chainId: 1,
          groupTimestamp: ts,
          timestamp: ts,
        })
      }
    },
  })
}
