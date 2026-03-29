import { sendAsset } from '@nktkas/hyperliquid/api/exchange'
import { AbstractWalletError } from '@nktkas/hyperliquid/signing'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet'
import type { EvmAddress } from 'sushi/evm'
import { useWalletClient } from 'wagmi'
import { TOAST_AUTOCLOSE_TIME } from '../config'
import { useLegalCheck } from '../info/use-legal-check'
import { hlHttpTransport } from '../transports'
import { formatSize } from '../utils'

type SendData = {
  destination: string
  sourceDex: string
  destinationDex: string
  token: string
  amount: string
  decimals: number
  fromSubAccount?: string | EvmAddress // "" for main account, address for subaccount, or undefined for main account
}

export const useSendAsset = () => {
  const { data: walletClient } = useWalletClient()
  const address = useAccount('evm')
  const { data: legalCheck } = useLegalCheck({ address })

  const mutation = useMutation({
    mutationKey: ['useSendAsset', walletClient?.account?.address, legalCheck],
    mutationFn: async ({
      destination,
      sourceDex,
      destinationDex,
      token,
      amount: sendAmount,
      decimals,
      fromSubAccount,
    }: SendData) => {
      if (!walletClient) {
        return
      }
      if (!legalCheck?.ipAllowed || !legalCheck?.userAllowed) {
        throw new Error('Legal check failed. Cannot cancel twap order.')
      }

      return sendAsset(
        {
          wallet: walletClient,
          transport: hlHttpTransport,
        },
        {
          destination,
          sourceDex,
          destinationDex,
          token,
          amount: formatSize(sendAmount, decimals),
          ...(fromSubAccount ? { fromSubAccount } : {}),
        },
      )
    },

    onMutate: () => {
      if (!walletClient?.account) return
      const ts = Date.now()

      createInfoToast({
        summary: `Transferring asset...`,
        account: walletClient?.account.address,
        chainId: 1,
        type: 'burn',
        timestamp: ts,
        groupTimestamp: ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
      })

      return { ts }
    },

    onSuccess: (_res, _vars, ctx) => {
      if (!walletClient?.account || !ctx) return

      createSuccessToast({
        summary: `Transferred asset successfully`,
        account: walletClient.account.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx.ts,
        groupTimestamp: ctx.ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
      })
    },

    onError: (error, _vars, ctx) => {
      let message = ''
      if (error instanceof AbstractWalletError || error instanceof Error) {
        message = error.message
      }
      createFailedToast({
        summary: message || `Failed to Transfer Asset`,
        account: walletClient?.account?.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx?.ts ?? Date.now(),
        groupTimestamp: ctx?.ts ?? Date.now(),
        autoClose: TOAST_AUTOCLOSE_TIME,
      })
    },
  })

  return {
    sendAssetAsync: mutation.mutateAsync,
    sendAsset: mutation.mutate,
    isPending: mutation.isPending,
  }
}
