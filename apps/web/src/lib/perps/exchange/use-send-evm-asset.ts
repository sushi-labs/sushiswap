import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { NativeAddress } from 'src/lib/constants'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { EvmChainId, EvmToken } from 'sushi/evm'
import { erc20Abi, parseAbi } from 'viem'
import { useWalletClient, useWriteContract } from 'wagmi'
import { TOAST_AUTOCLOSE_TIME } from '../config'
import { useLegalCheck } from '../info/use-legal-check'
import type { SendableAssetType } from '../user'

const usdcDepositAbi = parseAbi([
  'function deposit(uint256 amount,uint32 destinationDex)',
])

export const useSendEvmAsset = () => {
  const { data: walletClient } = useWalletClient()
  const address = useAccount('evm')
  const { data: legalCheck } = useLegalCheck({ address })
  const { mutateAsync: writeContractAsync, data: txHash } = useWriteContract()

  const mutation = useMutation({
    mutationKey: [
      'useSendEvmAsset',
      walletClient?.account?.address,
      legalCheck,
      txHash,
    ],
    mutationFn: async ({
      assetToSend,
      amount,
    }: { assetToSend: SendableAssetType; amount: string }) => {
      if (!walletClient || !assetToSend?.evmAddressData?.address || !amount) {
        return
      }
      if (!legalCheck?.ipAllowed || !legalCheck?.userAllowed) {
        throw new Error('Legal check failed. Cannot cancel twap order.')
      }

      const currency = new EvmToken({
        chainId: EvmChainId.HYPEREVM,
        address: assetToSend.evmAddressData?.address,
        decimals:
          assetToSend.evmAddressData?.address === NativeAddress
            ? 18
            : assetToSend.decimals +
              assetToSend.evmAddressData.evm_extra_wei_decimals,
        name: assetToSend.symbol,
        symbol: assetToSend.symbol,
      })
      const toAddress = assetToSend.destinationAddress
      const amountToSend = Amount.tryFromHuman(currency, amount)
      if (!amountToSend) return
      if (assetToSend?.symbol === 'USDC') {
        return writeContractAsync({
          address: assetToSend.spender!,
          abi: usdcDepositAbi,
          functionName: 'deposit',
          args: [amountToSend?.amount, 4294967295],
          chainId: EvmChainId.HYPEREVM,
        })
      }
      if (assetToSend.evmAddressData?.address === NativeAddress) {
        return walletClient.sendTransaction({
          to: toAddress,
          value: amountToSend.amount,
          chainId: EvmChainId.HYPEREVM,
        })
      }
      return writeContractAsync({
        address: assetToSend.evmAddressData?.address,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [toAddress, amountToSend?.amount],
        chainId: EvmChainId.HYPEREVM,
      })
    },

    onMutate: () => {
      if (!walletClient?.account) return
      const ts = Date.now()

      createInfoToast({
        summary: `Confirm transaction in wallet`,
        account: walletClient?.account.address,
        chainId: EvmChainId.HYPEREVM,
        type: 'burn',
        timestamp: ts,
        groupTimestamp: ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
        txHash,
        variant: 'perps',
      })

      return { ts }
    },

    onSuccess: (_res, _vars, ctx) => {
      if (!walletClient?.account || !ctx) return

      createSuccessToast({
        summary: `Transferred asset successfully`,
        account: walletClient.account.address,
        chainId: EvmChainId.HYPEREVM,
        type: 'burn',
        timestamp: ctx.ts,
        groupTimestamp: ctx.ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
        txHash,
        variant: 'perps',
      })
    },

    onError: (error, _vars, ctx) => {
      let message = ''
      if (error instanceof Error) {
        message = error.message
      }
      createFailedToast({
        summary: message || `Failed to Transfer Asset`,
        account: walletClient?.account?.address,
        chainId: EvmChainId.HYPEREVM,
        type: 'burn',
        timestamp: ctx?.ts ?? Date.now(),
        groupTimestamp: ctx?.ts ?? Date.now(),
        autoClose: TOAST_AUTOCLOSE_TIME,
        txHash,
        variant: 'perps',
      })
    },
  })

  return {
    sendAsset: mutation.mutate,
    isPending: mutation.isPending,
  }
}
