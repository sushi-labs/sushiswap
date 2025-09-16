import type { ICommand } from '@kadena/client'
import { useKadenaWallet } from '@kadena/wallet-adapter-react'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { Button, type ButtonProps } from '@sushiswap/ui'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import { getKvmChainByKey } from 'sushi/kvm'
import { kadenaClient } from '~kadena/_common/constants/client'
import { MIN_GAS_FEE } from '~kadena/_common/constants/gas'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { useTokenBalances } from '~kadena/_common/lib/hooks/use-token-balances'
import { buildRemoveLiquidityTxn } from '~kadena/_common/lib/pact/pool'
import { WalletConnector } from '~kadena/_common/ui/WalletConnector/WalletConnector'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { usePoolState } from '../../../../pool/pool-provider'
import { useRemoveLiqDispatch, useRemoveLiqState } from './pool-remove-provider'

export const RemoveButton = (props: ButtonProps) => {
  const queryClient = useQueryClient()
  const params = useParams()
  const _poolId = params?.id as string
  const { isConnected } = useKadena()
  const {
    percentage,
    isTxnPending,
    lpToRemove,
    minAmountToken0,
    minAmountToken1,
  } = useRemoveLiqState()
  const { setIsTxnPending, setPercentage } = useRemoveLiqDispatch()
  const { token0, token1, poolId } = usePoolState()
  const { activeAccount, currentWallet } = useKadena()
  const { client } = useKadenaWallet()
  const { data: tokenBalances, isLoading: isLoadingTokenBalance } =
    useTokenBalances({
      account: activeAccount?.accountName ?? '',
      tokenAddresses: ['coin'],
    })
  const balanceMap = tokenBalances?.balanceMap ?? undefined

  const hasInsufficientGas = useMemo(() => {
    if (isLoadingTokenBalance) return true

    const kdaBalance = Number.parseFloat(balanceMap?.['coin'] ?? '0')

    if (kdaBalance === undefined) return true

    const insufficient = kdaBalance < MIN_GAS_FEE
    return insufficient
  }, [isLoadingTokenBalance, balanceMap])

  const address = activeAccount?.accountName ?? ''

  const removeLiquidity = async () => {
    if (
      !isConnected ||
      !address ||
      !token0 ||
      !token1 ||
      !lpToRemove ||
      !minAmountToken0 ||
      !minAmountToken1 ||
      !currentWallet ||
      !poolId
    ) {
      return
    }
    try {
      setIsTxnPending(true)

      const tx = buildRemoveLiquidityTxn({
        token0Address: token0.address,
        token1Address: token1.address,
        lpToRemove: lpToRemove,
        minAmountOutToken0: minAmountToken0,
        minAmountOutToken1: minAmountToken1,
        pairAddress: poolId,
        signerAddress: address,
        chainId: KADENA_CHAIN_ID,
        networkId: KADENA_NETWORK_ID,
      })
      const signedTxn = await client.signTransaction(currentWallet, tx)

      const preflightResult = await kadenaClient.preflight(
        Array.isArray(signedTxn) ? signedTxn[0] : signedTxn,
      )
      if (preflightResult.result.status === 'failure') {
        throw new Error(
          preflightResult.result.error?.message || 'Preflight failed',
        )
      }

      const res = await kadenaClient.submit(signedTxn as ICommand)
      const txId = res.requestKey
      createInfoToast({
        summary: 'Removing liquidity initiated...',
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
        summary: 'Removed liquidity successfully',
        txHash: txId,
        type: 'swap',
        account: address as string,
        chainId: 1,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        href: getKvmChainByKey('kadena').getTransactionUrl(txId),
      })

      await onSuccess()
    } catch (error) {
      const errorMessage =
        typeof error === 'string'
          ? error
          : ((error as Error)?.message ??
            'An error occurred while trying to remove liquidity.')
      //create error toast
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

  const onSuccess = async () => {
    setPercentage(0)
    setIsTxnPending(false)
    queryClient.invalidateQueries({
      queryKey: ['kadena-pool-from-tokens', token0, token1],
    })
    queryClient.invalidateQueries({
      queryKey: ['kadena-token-balances', address, [token0?.address]],
    })
    queryClient.invalidateQueries({
      queryKey: ['kadena-token-balances', address, [token1?.address]],
    })
    queryClient.invalidateQueries({
      queryKey: [
        'kadena-lp-balance',
        address,
        token0?.address,
        token1?.address,
      ],
    })
    queryClient.invalidateQueries({
      queryKey: ['kadena-pool-by-id', _poolId, undefined, 4],
    })
  }
  const buttonText = useMemo(() => {
    if (isTxnPending) {
      return 'Removing Liquidity'
    }
    if (percentage === 0) {
      return 'Enter Amount'
    }
    if (hasInsufficientGas) {
      return 'Insufficient Gas Balance on Chain 2'
    }
    return 'Remove Liquidity'
  }, [percentage, isTxnPending, hasInsufficientGas])

  if (!isConnected) {
    return <WalletConnector fullWidth {...props} />
  }

  return (
    <Button
      onClick={removeLiquidity}
      disabled={percentage === 0 || isTxnPending}
      {...props}
    >
      {buttonText}
    </Button>
  )
}
