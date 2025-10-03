import type { ICommand } from '@kadena/client'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { Button, Dots } from '@sushiswap/ui'
import { useQueryClient } from '@tanstack/react-query'
import { useKadenaWallet } from 'node_modules/@kadena/wallet-adapter-react/dist/esm/context'
import { logger } from 'src/lib/logger'
import { KvmChainId, getKvmChainByKey } from 'sushi/kvm'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { buildGetPoolAddress } from '~kadena/_common/lib/pact/pool'
import { buildSwapTxn } from '~kadena/_common/lib/pact/swap'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { useSwapDispatch, useSwapState } from '~kadena/swap/swap-provider'

export const SwapButton = ({ closeModal }: { closeModal: () => void }) => {
  const { activeAccount, currentWallet } = useKadena()
  const { client } = useKadenaWallet()
  const queryClient = useQueryClient()
  const { token0, token1, amountIn, amountOut, isTxnPending, minAmountOut } =
    useSwapState()
  const {
    setIsTxnPending,
    setAmountIn,
    setAmountOut,
    setPriceImpactPercentage,
    setAmountInString,
    setAmountOutString,
    setStatus,
    setTxHash,
  } = useSwapDispatch()

  const address = activeAccount?.accountName ?? ''

  const swapToken = async () => {
    if (
      !token0 ||
      !token1 ||
      !amountIn ||
      !amountOut ||
      !address ||
      !currentWallet
    )
      return

    try {
      setIsTxnPending(true)
      setStatus('pending')

      const getPoolAddressTx = buildGetPoolAddress(
        token0.address,
        token1.address,
      )

      const getPoolAddressRes = await kadenaClient.local(getPoolAddressTx, {
        preflight: false,
        signatureVerification: false,
      })

      if (getPoolAddressRes.result.status !== 'success') {
        setStatus('error')
        throw new Error(
          getPoolAddressRes.result.error?.message ??
            'Failed to fetch pool address',
        )
      }

      const poolAddress =
        typeof getPoolAddressRes.result.data === 'object' &&
        'account' in getPoolAddressRes.result.data
          ? (getPoolAddressRes.result.data.account as string)
          : undefined

      if (!poolAddress) {
        setStatus('error')
        throw new Error('Pool does not exist')
      }

      const tx = buildSwapTxn({
        token0Address: token0.address,
        token1Address: token1.address,
        amountIn: Number(amountIn),
        amountOut: Number(minAmountOut),
        signerAddress: address,
        poolAddress,
        isSimulate: false,
        chainId: KADENA_CHAIN_ID,
        networkId: KADENA_NETWORK_ID,
      })

      const signed = await client.signTransaction(currentWallet, tx)

      const preflight = await kadenaClient.preflight(
        Array.isArray(signed) ? signed[0] : signed,
      )
      if (preflight.result.status === 'failure') {
        setStatus('error')
        throw new Error(preflight.result.error?.message || 'Preflight failed')
      }

      const submitRes = await kadenaClient.submit(signed as ICommand)
      const txId = submitRes.requestKey
      setTxHash(txId)
      createInfoToast({
        summary: 'Swap initiated...',
        type: 'swap',
        account: address,
        chainId: KvmChainId.KADENA,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        txHash: txId,
        href: getKvmChainByKey('kadena').getTransactionUrl(txId),
      })

      const result = await kadenaClient.pollOne(submitRes)

      if (result.result.status === 'failure') {
        setStatus('error')
        throw new Error(result.result.error?.message || 'Transaction failed')
      }

      createSuccessToast({
        summary: 'Swap executed successfully',
        txHash: txId,
        type: 'swap',
        account: address!,
        chainId: KvmChainId.KADENA,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        href: getKvmChainByKey('kadena').getTransactionUrl(txId),
      })

      onSuccess()
    } catch (err) {
      createFailedToast({
        summary:
          typeof err === 'string'
            ? err
            : ((err as Error)?.message ?? 'Swap failed'),
        type: 'swap',
        account: address!,
        chainId: KvmChainId.KADENA,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })
      logger.error(err, {
        location: 'KadenaSwapButton',
        action: 'swapToken',
        token_from: token0?.address,
        token_to: token1?.address,
        account: address,
      })
      setStatus('error')
      console.error(err)
    } finally {
      setIsTxnPending(false)
    }
  }

  const onSuccess = () => {
    setStatus('success')
    setAmountIn(undefined)
    setAmountOut(undefined)
    setAmountInString('')
    setAmountOutString('')
    setPriceImpactPercentage(0)
    setIsTxnPending(false)
    closeModal()

    queryClient.invalidateQueries({
      queryKey: ['kadena-token-balances', address, [token0?.address]],
    })
    queryClient.invalidateQueries({
      queryKey: ['kadena-token-balances', address, [token1?.address]],
    })
  }

  return (
    <Button
      disabled={isTxnPending}
      color="blue"
      fullWidth
      size="xl"
      onClick={swapToken}
    >
      {isTxnPending ? (
        <Dots>Confirming Swap</Dots>
      ) : (
        <>
          Swap {token0?.symbol} For {token1?.symbol}
        </>
      )}
    </Button>
  )
}
