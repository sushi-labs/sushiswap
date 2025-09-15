import { Button, type ButtonProps, DialogTrigger } from '@sushiswap/ui'
import { useMemo } from 'react'
import { MIN_GAS_FEE } from '~kadena/_common/constants/gas'
import { useTokenBalances } from '~kadena/_common/lib/hooks/use-token-balances'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { usePoolState } from '../../../../pool/pool-provider'

export const ReviewAddDialogTrigger = (props: ButtonProps) => {
  const {
    token0,
    token1,
    isTxnPending,
    amountInToken0,
    amountInToken1,
    poolId,
  } = usePoolState()
  const { activeAccount } = useKadena()
  const { data: tokenBalances, isLoading: isLoadingTokenBalance } =
    useTokenBalances({
      account: activeAccount?.accountName ?? '',
      tokenAddresses:
        token0 && token1 ? [token0?.address, token1?.address] : [],
    })
  const balanceMap = tokenBalances?.balanceMap ?? undefined

  const hasInsufficientGas = useMemo(() => {
    if (isLoadingTokenBalance) return true

    const kdaBalance = balanceMap?.['coin']

    if (kdaBalance === undefined) return true

    const insufficient = kdaBalance < MIN_GAS_FEE
    return insufficient
  }, [isLoadingTokenBalance, balanceMap])

  const poolExists = Boolean(poolId)

  const token0Balance = token0 && balanceMap ? balanceMap[token0?.address] : 0
  const token1Balance = token1 && balanceMap ? balanceMap[token1?.address] : 0

  const hasInsufficientToken0Balance = useMemo(() => {
    if (isLoadingTokenBalance) return true
    return token0Balance < Number(amountInToken0)
  }, [amountInToken0, isLoadingTokenBalance, token0Balance])

  const hasInsufficientToken1Balance = useMemo(() => {
    if (isLoadingTokenBalance) return true
    return token1Balance < Number(amountInToken1)
  }, [amountInToken1, isLoadingTokenBalance, token1Balance])

  const invalidAmount = useMemo(() => {
    return (
      amountInToken0 === '' ||
      amountInToken1 === '' ||
      Number(amountInToken0) === 0 ||
      Number(amountInToken1) === 0
    )
  }, [amountInToken0, amountInToken1])

  const buttonText = useMemo(() => {
    if (isTxnPending) {
      if (!poolExists) {
        return 'Creating Pool'
      }
      return 'Adding Liquidity'
    }
    if (invalidAmount) {
      return 'Enter Amount'
    }
    if (hasInsufficientToken0Balance) {
      return `Insufficient ${token0?.symbol} Balance on Chain 2`
    }
    if (hasInsufficientToken1Balance) {
      return `Insufficient ${token1?.symbol} Balance on Chain 2`
    }
    if (hasInsufficientGas) {
      return 'Insufficient Gas Balance on Chain 2'
    }
    if (!poolExists) {
      return 'Create Pool'
    }
    return 'Add Liquidity'
  }, [
    hasInsufficientToken0Balance,
    hasInsufficientToken1Balance,
    invalidAmount,
    token0,
    token1,
    isTxnPending,
    poolExists,
    hasInsufficientGas,
  ])

  return (
    <DialogTrigger
      disabled={
        invalidAmount ||
        hasInsufficientToken0Balance ||
        hasInsufficientToken1Balance ||
        isTxnPending
      }
      asChild
    >
      <Button loading={isTxnPending} {...props}>
        {buttonText}
      </Button>
    </DialogTrigger>
  )
}
