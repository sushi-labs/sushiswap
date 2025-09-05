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
import { Decimal } from 'sushi'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import {
  buildAddLiquidityTxn,
  buildGetPoolAddress,
} from '~kadena/_common/lib/pact/pool'
import { getChainwebTxnLink } from '~kadena/_common/lib/utils/kadena-helpers'
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
      const minAmountToken0 = new Decimal(amountInToken0)
        .mul(new Decimal(1).minus(slippage))
        .toString()

      const minAmountToken1 = new Decimal(amountInToken1)
        .mul(new Decimal(1).minus(slippage))
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
        //@ts-expect-error - type mismatch, but we know this is correct
        const preflightResult = await kadenaClient.preflight(signedTxn)
        // console.log("preflightResult", preflightResult);

        if (preflightResult.result.status !== 'success') {
          throw new Error(
            preflightResult.result.error?.message || 'Preflight failed',
          )
        }
        //@ts-expect-error - type mismatch, but we know this is correct
        const res = await kadenaClient.submit(signedTxn)
        // console.log("add liquidity res", res);
        const txId = res.requestKey
        createInfoToast({
          summary: 'Creating a pool initiated...',
          type: 'swap',
          account: address as string,
          chainId: 1,
          groupTimestamp: Date.now(),
          timestamp: Date.now(),
          txHash: txId,
          href: getChainwebTxnLink(txId),
        })
        const result = await kadenaClient.pollOne(res, {
          confirmationDepth: 4,
        })
        if (result.result.status === 'failure') {
          throw new Error(result.result.error?.message || 'Transaction failed')
        }
        //@ts-expect-error - type mismatch, but we know this is correct
        poolAddress = preflightResult.result.data?.account
        console.log(
          '[AddButton] poolAddress from preflightResult:',
          poolAddress,
        )
        createSuccessToast({
          summary: 'Created a pool successfully! Continue to add liquidity.',
          txHash: txId,
          type: 'swap',
          account: address as string,
          chainId: 1,
          groupTimestamp: Date.now(),
          timestamp: Date.now(),
          href: getChainwebTxnLink(txId),
        })

        const key = Object.keys(result)[0]
        //@ts-expect-error - type mismatch, but we know this is correct
        poolAddress = result[key]?.result?.data?.account

        if (!poolAddress) {
          poolAddress = await getPoolAddress(
            token0.tokenAddress,
            token1.tokenAddress,
            KADENA_CHAIN_ID,
            KADENA_NETWORK_ID,
          )
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
      //@ts-expect-error - type mismatch, but we know this is correct
      const preflightResult = await kadenaClient.preflight(signedTxn)
      // console.log("preflightResult", preflightResult);

      if (preflightResult.result.status === 'failure') {
        throw new Error(
          preflightResult.result.error?.message || 'Preflight failed',
        )
      }
      //@ts-expect-error - type mismatch, but we know this is correct
      const res = await kadenaClient.submit(signedTxn)

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
        href: getChainwebTxnLink(txId),
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
        href: getChainwebTxnLink(txId),
      })

      await onSuccess()
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

  const getPoolAddress = async (
    token0Address: string | undefined,
    token1Address: string | undefined,
    chainId: number,
    networkId: string,
  ): Promise<string> => {
    if (!token0Address || !token1Address) {
      throw new Error('Missing token addresses')
    }

    const tx = buildGetPoolAddress(
      token0Address,
      token1Address,
      chainId,
      networkId,
    )

    const res = await kadenaClient.local(tx, {
      preflight: false,
      signatureVerification: false,
    })

    if (res.result.status !== 'success') {
      throw new Error(
        res.result.error?.message ?? 'Failed to fetch pool address',
      )
    }

    //@ts-expect-error - type mismatch, but we know this is correct
    const poolAddress = res.result.data?.account

    if (!poolAddress) {
      throw new Error('No pool address returned')
    }

    return poolAddress
  }

  const onSuccess = async () => {
    setIsTxnPending(false)
    setAmountInToken0('')
    setAmountInToken1('')
    closeModal()
    await queryClient.invalidateQueries({
      queryKey: ['kadena-pool-from-tokens', token0, token1],
    })
    await queryClient.invalidateQueries({
      queryKey: ['kadena-token-balances', address, [token0?.tokenAddress]],
    })
    await queryClient.invalidateQueries({
      queryKey: ['kadena-token-balances', address, [token1?.tokenAddress]],
    })
    await queryClient.invalidateQueries({
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
