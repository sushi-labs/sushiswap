import type { ICommand } from '@kadena/client'
import { useKadenaWallet } from '@kadena/wallet-adapter-react'
import {
  SlippageToleranceStorageKey,
  useSlippageTolerance,
} from '@sushiswap/hooks'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { Button, type ButtonProps } from '@sushiswap/ui'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Amount, Fraction } from 'sushi'
import {
  KvmChainId,
  KvmToken,
  type KvmTokenAddress,
  getKvmChainByKey,
} from 'sushi/kvm'
import { parseUnits } from 'viem'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { buildAddLiquidityTxn } from '~kadena/_common/lib/pact/pool'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { usePoolDispatch, usePoolState } from '../../../../pool/pool-provider'

export const AddButton = ({
  closeModal,
  buttonProps,
}: {
  closeModal: () => void
  buttonProps?: ButtonProps
}) => {
  const queryClient = useQueryClient()

  const {
    token0,
    token1,
    isTxnPending,
    amountInToken0,
    amountInToken1,
    poolId,
  } = usePoolState()
  const { setIsTxnPending, setAmountInToken0, setAmountInToken1, setPoolId } =
    usePoolDispatch()
  const { activeAccount, currentWallet } = useKadena()
  const { client } = useKadenaWallet()
  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.RemoveLiquidity,
  )
  const slippage =
    slippageTolerance === 'AUTO' ? 0.005 : Number(slippageTolerance) / 100

  const address = activeAccount?.accountName ?? ''

  const addLiquidity = async () => {
    if (
      !token0 ||
      !token1 ||
      !amountInToken0 ||
      !amountInToken1 ||
      !address ||
      !currentWallet
    )
      return
    try {
      setIsTxnPending(true)
      const _token0 = new KvmToken({
        chainId: KvmChainId.KADENA,
        address: token0.tokenAddress as KvmTokenAddress,
        decimals: token0.tokenDecimals,
        symbol: token0.tokenSymbol,
        name: token0.tokenName,
      })
      const parsedAmountOut = parseUnits(
        amountInToken0.toString(),
        _token0.decimals,
      )
      const slippageFraction = new Fraction((1 - slippage) * 1e6)
      const minAmountToken0 = new Amount(_token0, parsedAmountOut)
        .mul(slippageFraction)
        .div(1e6)
        .toString()

      const _token1 = new KvmToken({
        chainId: KvmChainId.KADENA,
        address: token1.tokenAddress as KvmTokenAddress,
        decimals: token1.tokenDecimals,
        symbol: token1.tokenSymbol,
        name: token1.tokenName,
      })
      const parsedAmountOut1 = parseUnits(
        amountInToken1.toString(),
        _token1.decimals,
      )
      const slippageFraction1 = new Fraction((1 - slippage) * 1e6)
      const minAmountToken1 = new Amount(_token1, parsedAmountOut1)
        .mul(slippageFraction1)
        .div(1e6)
        .toString()

      let poolAddress = poolId

      if (!poolAddress) {
        const initTxn = buildAddLiquidityTxn({
          token0Address: token0.tokenAddress,
          token1Address: token1.tokenAddress,
          amountInToken0: Number(amountInToken0),
          amountInToken1: Number(amountInToken1),
          minAmountInToken0: Number(minAmountToken0),
          minAmountInToken1: Number(minAmountToken1),
          poolAddress: poolAddress,
          signerAddress: address,
          chainId: KADENA_CHAIN_ID,
          networkId: KADENA_NETWORK_ID,
        })
        const signedTxn = await client.signTransaction(currentWallet, initTxn)
        const preflightResult = await kadenaClient.preflight(
          Array.isArray(signedTxn) ? signedTxn[0] : signedTxn,
        )
        // console.log("preflightResult", preflightResult);

        if (preflightResult.result.status !== 'success') {
          throw new Error(
            preflightResult.result.error?.message || 'Preflight failed',
          )
        }

        const res = await kadenaClient.submit(signedTxn as ICommand)

        const txId = res.requestKey
        createInfoToast({
          summary: 'Creating a pool initiated...',
          type: 'swap',
          account: address as string,
          chainId: 1,
          groupTimestamp: Date.now(),
          timestamp: Date.now(),
          txHash: txId,
          href: getKvmChainByKey('kadena').getTransactionUrl(txId),
        })
        const result = await kadenaClient.pollOne(res, {
          confirmationDepth: 1,
        })
        if (result.result.status === 'failure') {
          throw new Error(result.result.error?.message || 'Transaction failed')
        }

        createSuccessToast({
          summary: 'Created a pool successfully! Continue to add liquidity.',
          txHash: txId,
          type: 'swap',
          account: address as string,
          chainId: 1,
          groupTimestamp: Date.now(),
          timestamp: Date.now(),
          href: getKvmChainByKey('kadena').getTransactionUrl(txId),
        })

        poolAddress =
          typeof result.result.data === 'object' &&
          'account' in result.result.data
            ? (result.result.data.account as string)
            : undefined

        if (!poolAddress) {
          throw new Error('Pool address not found from transaction result')
        }

        setPoolId(poolAddress)
      }

      const tx = buildAddLiquidityTxn({
        token0Address: token0.tokenAddress,
        token1Address: token1.tokenAddress,
        amountInToken0: Number(amountInToken0),
        amountInToken1: Number(amountInToken1),
        minAmountInToken0: Number(minAmountToken0),
        minAmountInToken1: Number(minAmountToken1),
        poolAddress: poolAddress,
        signerAddress: address,
        chainId: KADENA_CHAIN_ID,
        networkId: KADENA_NETWORK_ID,
      })
      const signedTxn = await client.signTransaction(currentWallet, tx)

      const preflightResult = await kadenaClient.preflight(
        Array.isArray(signedTxn) ? signedTxn[0] : signedTxn,
      )
      // console.log("preflightResult", preflightResult);

      if (preflightResult.result.status === 'failure') {
        throw new Error(
          preflightResult.result.error?.message || 'Preflight failed',
        )
      }

      const res = await kadenaClient.submit(signedTxn as ICommand)

      // console.log("add liquidity res", res);

      const txId = res.requestKey
      createInfoToast({
        summary: 'Adding liquidity initiated...',
        type: 'swap',
        account: address as string,
        chainId: 1,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        txHash: txId,
        href: getKvmChainByKey('kadena').getTransactionUrl(txId),
      })
      const result = await kadenaClient.pollOne(res)

      if (result.result.status === 'failure') {
        throw new Error(result.result.error?.message || 'Transaction failed')
      }

      createSuccessToast({
        summary: 'Added liquidity successfully',
        txHash: txId,
        type: 'swap',
        account: address as string,
        chainId: 1,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        href: getKvmChainByKey('kadena').getTransactionUrl(txId),
      })

      onSuccess()
    } catch (error) {
      const errorMessage =
        typeof error === 'string'
          ? error
          : ((error as Error)?.message ??
            'An error occurred while trying to add liquidity')
      createFailedToast({
        summary: errorMessage,
        type: 'swap',
        account: address as string,
        chainId: 1,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })
      console.error(error)
      setIsTxnPending(false)
    }
  }

  const onSuccess = () => {
    setIsTxnPending(false)
    setAmountInToken0('')
    setAmountInToken1('')
    closeModal()
    queryClient.invalidateQueries({
      queryKey: ['kadena-pool-from-tokens', token0, token1],
    })
    queryClient.invalidateQueries({
      queryKey: ['kadena-token-balances', address, [token0?.tokenAddress]],
    })
    queryClient.invalidateQueries({
      queryKey: ['kadena-token-balances', address, [token1?.tokenAddress]],
    })
    queryClient.invalidateQueries({
      queryKey: [
        'kadena-lp-balance',
        address,
        token0?.tokenAddress,
        token1?.tokenAddress,
      ],
    })
  }

  const btnText = useMemo(() => {
    if (isTxnPending && poolId) return 'Adding Liquidity'
    if (isTxnPending && !poolId) return 'Creating Pool'
    if (!poolId) return 'Create Pool'
    return 'Add Liquidity'
  }, [isTxnPending, poolId])

  return (
    <Button
      disabled={isTxnPending}
      loading={isTxnPending}
      onClick={addLiquidity}
      {...buttonProps}
    >
      {btnText}
    </Button>
  )
}
