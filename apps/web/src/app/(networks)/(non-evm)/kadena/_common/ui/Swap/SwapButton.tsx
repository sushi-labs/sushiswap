import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { useSlippageTolerance } from '@sushiswap/hooks'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { Button, Dots } from '@sushiswap/ui'
import { useQueryClient } from '@tanstack/react-query'
import { useKadenaWallet } from 'node_modules/@kadena/wallet-adapter-react/dist/esm/context'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { buildGetPoolAddress } from '~kadena/_common/lib/pact/pool'
import { buildSwapTxn } from '~kadena/_common/lib/pact/swap'
import { getChainwebTxnLink } from '~kadena/_common/lib/utils/kadena-helpers'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { useSwapDispatch, useSwapState } from '~kadena/swap/swap-provider'

export const SwapButton = ({ closeModal }: { closeModal: () => void }) => {
  const { activeAccount, currentWallet } = useKadena()
  const { client } = useKadenaWallet()
  const queryClient = useQueryClient()
  const { token0, token1, amountIn, amountOut, isSwapIn, isTxnPending } =
    useSwapState()
  const {
    setIsTxnPending,
    setAmountIn,
    setAmountOut,
    setPriceImpactPercentage,
  } = useSwapDispatch()
  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.Swap,
  )
  const _slippage =
    slippageTolerance === 'AUTO' ? 0.005 : Number(slippageTolerance) / 100
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

      const getPoolAddressTx = buildGetPoolAddress(
        token0.tokenAddress,
        token1.tokenAddress,
        KADENA_CHAIN_ID,
        KADENA_NETWORK_ID,
      )

      const getPoolAddressRes = await kadenaClient.local(getPoolAddressTx, {
        preflight: false,
        signatureVerification: false,
      })

      if (getPoolAddressRes.result.status !== 'success') {
        throw new Error(
          getPoolAddressRes.result.error?.message ??
            'Failed to fetch pool address',
        )
      }

      const poolAddress = getPoolAddressRes.result.data.account

      const tx = buildSwapTxn({
        token0Address: token0.tokenAddress,
        token1Address: token1.tokenAddress,
        amountIn: Number(amountIn),
        amountOut: Number(amountOut),
        isSwapIn,
        signerAddress: address,
        poolAddress,
      })

      const signed = await client.signTransaction(currentWallet, tx)
      const preflight = await kadenaClient.preflight(signed)
      if (preflight.result.status === 'failure') {
        throw new Error(preflight.result.error?.message || 'Preflight failed')
      }

      const submitRes = await kadenaClient.submit(signed)
      const txId = submitRes.requestKey

      createInfoToast({
        summary: isSwapIn ? 'Swap initiated...' : 'Swap initiated...',
        type: 'swap',
        account: address!,
        chainId: 1,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        txHash: txId,
        href: getChainwebTxnLink(txId),
      })

      const result = await kadenaClient.pollOne(submitRes)
      console.log('result', result)
      if (result.result.status === 'failure') {
        throw new Error(result.result.error?.message || 'Transaction failed')
      }

      createSuccessToast({
        summary: 'Swap executed successfully',
        txHash: txId,
        type: 'swap',
        account: address!,
        chainId: 1,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        href: getChainwebTxnLink(txId),
      })

      await onSuccess?.()
    } catch (err) {
      createFailedToast({
        summary:
          typeof err === 'string'
            ? err
            : ((err as Error)?.message ?? 'Swap failed'),
        type: 'swap',
        account: address!,
        chainId: 1,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })
      console.error(err)
    } finally {
      setIsTxnPending(false)
    }
  }

  const onSuccess = () => {
    setAmountIn('')
    setAmountOut('')
    setPriceImpactPercentage(0)
    setIsTxnPending(false)
    closeModal()

    queryClient.invalidateQueries({
      queryKey: [
        'useTokenBalance',
        { accountAddress: address, tokenAddress: token0?.tokenAddress },
      ],
    })

    queryClient.invalidateQueries({
      queryKey: [
        'useTokenBalance',
        { accountAddress: address, tokenAddress: token1?.tokenAddress },
      ],
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
          Swap {token0?.tokenSymbol} For {token1?.tokenSymbol}
        </>
      )}
    </Button>
  )
}
