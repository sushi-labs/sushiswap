import { Button, type ButtonProps, DialogTrigger } from '@sushiswap/ui'
import { useMemo } from 'react'
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
        token0 && token1 ? [token0?.tokenAddress, token1?.tokenAddress] : [],
    })
  const balanceMap = tokenBalances?.balanceMap ?? undefined
  const poolExists = Boolean(poolId)

  const token0Balance =
    token0 && balanceMap ? balanceMap[token0?.tokenAddress] : 0
  const token1Balance =
    token1 && balanceMap ? balanceMap[token1?.tokenAddress] : 0

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
      return `Insufficient ${token0?.tokenSymbol} Balance`
    }
    if (hasInsufficientToken1Balance) {
      return `Insufficient ${token1?.tokenSymbol} Balance`
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
