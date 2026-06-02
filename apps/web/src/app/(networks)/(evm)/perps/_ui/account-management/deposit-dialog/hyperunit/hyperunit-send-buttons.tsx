import { createToast } from '@sushiswap/notifications'
import { Button } from '@sushiswap/ui'
import { useCallback } from 'react'
import { useTransferSol } from 'src/lib/svm/hooks/use-transfer-sol'
import { useTransferSplToken } from 'src/lib/svm/hooks/use-transfer-spl-token'
import { useAccount } from 'src/lib/wallet'
import { type EvmAddress, type EvmChainId, erc20Abi_transfer } from 'sushi/evm'
import type { SvmChainId, SvmToken } from 'sushi/svm'
import { usePublicClient, useSendTransaction, useWriteContract } from 'wagmi'

/**
 * Each connected-wallet send action lives in its own component so that the
 * heavy wagmi generics (`useSendTransaction` vs `useWriteContract`) and the SVM
 * transfer hooks are never co-resolved in a single closure. Co-locating them
 * forces TypeScript into a multi-second structural comparison between
 * `SendTransactionMutateAsync` and `WriteContractMutateAsync` on every check.
 */

type SendButtonProps<TChainId extends EvmChainId | SvmChainId> = {
  amount: bigint
  amountText: string
  depositAddress: AddressFor<TChainId>
  setOpen: (open: boolean) => void
}

function SendButton({
  onClick,
  loading,
}: {
  onClick: () => void
  loading: boolean
}) {
  return (
    <Button
      variant="perps-tertiary"
      size="default"
      className="w-full"
      onClick={onClick}
      loading={loading}
    >
      Send
    </Button>
  )
}

function emitEvmSendToast({
  account,
  chainId,
  hash,
  promise,
  amountText,
  symbol,
}: {
  account: EvmAddress | undefined
  chainId: EvmChainId
  hash: EvmAddress
  promise: Promise<unknown>
  amountText: string
  symbol: string
}) {
  const ts = new Date().getTime()
  void createToast({
    account,
    type: 'send',
    chainId,
    txHash: hash,
    promise,
    summary: {
      pending: `Depositing ${amountText} ${symbol}`,
      completed: `Deposited ${amountText} ${symbol}`,
      failed: `Something went wrong depositing ${amountText} ${symbol}`,
    },
    timestamp: ts,
    groupTimestamp: ts,
    variant: 'perps',
  })
}

export function EvmNativeSendButton({
  amount,
  amountText,
  depositAddress,
  chainId,
  symbol,
  setOpen,
}: SendButtonProps<EvmChainId> & { chainId: EvmChainId; symbol: string }) {
  const account = useAccount('evm')
  const client = usePublicClient()
  const { mutateAsync: sendTransactionAsync, isPending } = useSendTransaction()

  const onClick = useCallback(async () => {
    const hash = await sendTransactionAsync({
      to: depositAddress as EvmAddress,
      value: amount,
    })
    const promise = client.waitForTransactionReceipt({ hash })
    emitEvmSendToast({
      account,
      chainId,
      hash,
      promise,
      amountText,
      symbol,
    })
    setOpen(false)
  }, [
    sendTransactionAsync,
    depositAddress,
    amount,
    client,
    account,
    chainId,
    amountText,
    symbol,
    setOpen,
  ])

  return <SendButton onClick={onClick} loading={isPending} />
}

export function EvmTokenSendButton({
  amount,
  amountText,
  depositAddress,
  chainId,
  tokenAddress,
  symbol,
  setOpen,
}: SendButtonProps<EvmChainId> & {
  chainId: EvmChainId
  tokenAddress: EvmAddress
  symbol: string
}) {
  const account = useAccount('evm')
  const client = usePublicClient()
  const { mutateAsync: writeContractAsync, isPending } = useWriteContract()

  const onClick = useCallback(async () => {
    const hash = await writeContractAsync({
      address: tokenAddress,
      abi: erc20Abi_transfer,
      functionName: 'transfer',
      args: [depositAddress as EvmAddress, amount],
    })
    const promise = client.waitForTransactionReceipt({ hash })
    emitEvmSendToast({
      account,
      chainId,
      hash,
      promise,
      amountText,
      symbol,
    })
    setOpen(false)
  }, [
    writeContractAsync,
    tokenAddress,
    depositAddress,
    amount,
    client,
    account,
    chainId,
    amountText,
    symbol,
    setOpen,
  ])

  return <SendButton onClick={onClick} loading={isPending} />
}

export function SvmNativeSendButton({
  amount,
  depositAddress,
  setOpen,
}: SendButtonProps<SvmChainId>) {
  const { transferSolAsync, isPending } = useTransferSol({
    onSuccess: () => setOpen(false),
  })

  const onClick = useCallback(() => {
    void transferSolAsync({ destination: depositAddress, amount })
  }, [transferSolAsync, depositAddress, amount])

  return <SendButton onClick={onClick} loading={isPending} />
}

export function SvmTokenSendButton({
  amount,
  depositAddress,
  token,
  setOpen,
}: SendButtonProps<SvmChainId> & { token: SvmToken }) {
  const { transferSplTokenAsync, isPending } = useTransferSplToken({
    onSuccess: () => setOpen(false),
  })

  const onClick = useCallback(() => {
    void transferSplTokenAsync({
      amount,
      destination: depositAddress,
      tokenToSend: token,
    })
  }, [transferSplTokenAsync, depositAddress, amount, token])

  return <SendButton onClick={onClick} loading={isPending} />
}
