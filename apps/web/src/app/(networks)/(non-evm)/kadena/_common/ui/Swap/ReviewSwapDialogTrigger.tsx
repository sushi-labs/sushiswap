import { Button, DialogTrigger } from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
import { useTokenBalances } from '~kadena/_common/lib/hooks/use-token-balances'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { useSwapState } from '~kadena/swap/swap-provider'

export const ReviewSwapDialogTrigger = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const {
    amountIn,
    isTxnPending,
    token0,
    token1,
    priceImpactPercentage,
    route,
    amountOut,
  } = useSwapState()
  const allowanceAmount = '1'

  const { activeAccount } = useKadena()

  const { data: tokenBalances, isLoading: isLoadingTokenBalance } =
    useTokenBalances({
      account: activeAccount?.accountName ?? '',
      tokenAddresses:
        token0 && token1 ? [token0?.tokenAddress, token1?.tokenAddress] : [],
    })
  const balanceMap = tokenBalances?.balanceMap ?? undefined

  const token0Balance =
    token0 && balanceMap ? balanceMap[token0?.tokenAddress] : 0
  // const token1Balance =
  //   token1 && balanceMap ? balanceMap[token1?.tokenAddress] : 0

  const hasInsufficientToken0Balance = useMemo(() => {
    if (isLoadingTokenBalance) return true
    return token0Balance < Number(amountIn)
  }, [amountIn, isLoadingTokenBalance, token0Balance])

  // const hasInsufficientToken1Balance = useMemo(() => {
  //   if (isLoadingTokenBalance) return true
  //   return token1Balance < Number(amountOut)
  // }, [amountOut, isLoadingTokenBalance, token1Balance])

  const swapType = 'swap'

  const noRoutes = swapType === 'swap' && route?.length === 0

  const allowanceFormatted = '0.123'

  const insufficientLiquidity = priceImpactPercentage >= 100

  const buttonText = useMemo(() => {
    if (isTxnPending) {
      return 'Swapping'
    }
    if (!amountIn || amountIn === '0' || !amountOut || amountOut === '0') {
      return 'Enter Amount'
    }
    if (hasInsufficientToken0Balance) {
      return 'Insufficient Balance'
    }
    if (noRoutes) {
      return 'No Routes Found'
    }
    if (insufficientLiquidity) {
      return 'Insufficient Liquidity'
    }
    if (
      allowanceAmount &&
      Number(amountIn) > Number(allowanceFormatted) &&
      swapType === 'swap'
    ) {
      return 'Approve'
    }
    return 'Swap'
  }, [
    amountIn,
    hasInsufficientToken0Balance,
    noRoutes,
    insufficientLiquidity,
    isTxnPending,
    amountOut,
  ])

  const userConfirmationNeeded = useMemo(() => {
    if (priceImpactPercentage >= 15) {
      return true
    }
    return false
  }, [priceImpactPercentage])

  // biome-ignore lint/correctness/useExhaustiveDependencies: Typecheck speedup
  useEffect(() => {
    setIsChecked(false)
  }, [priceImpactPercentage])

  return (
    <>
      {
        <DialogTrigger
          disabled={
            insufficientLiquidity ||
            (userConfirmationNeeded && !isChecked) ||
            !amountIn ||
            hasInsufficientToken0Balance ||
            noRoutes
          }
          asChild
        >
          <Button size="xl" fullWidth disabled={isTxnPending}>
            {buttonText}
          </Button>
        </DialogTrigger>
      }
      {userConfirmationNeeded && !isChecked ? (
        <div className="flex items-start px-4 py-3 mt-4 rounded-xl bg-red/20">
          <input
            id="expert-checkbox"
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="cursor-pointer mr-1 w-5 h-5 mt-0.5 text-red-600 !ring-red-600 bg-white border-red rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
          />
          <label
            htmlFor="expert-checkbox"
            className="ml-2 font-medium text-red-600"
          >
            Price impact is too high. You will lose a big portion of your funds
            in this trade. Please tick the box if you would like to continue.
          </label>
        </div>
      ) : null}
    </>
  )
}
