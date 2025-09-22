import { Button, DialogTrigger } from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
import { MIN_GAS_FEE } from '~kadena/_common/constants/gas'
import { usePoolFromTokens } from '~kadena/_common/lib/hooks/pools/use-pool-from-tokens'
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

    const kdaBalance = Number.parseFloat(balanceMap?.['coin'] ?? '0')

    if (kdaBalance === undefined) return true

    const insufficient = kdaBalance < MIN_GAS_FEE
    return insufficient
  }, [isLoadingTokenBalance, balanceMap])

  const token0Balance =
    token0 && balanceMap ? Number.parseFloat(balanceMap[token0?.address]) : 0

  const hasInsufficientToken0Balance = useMemo(() => {
    if (isLoadingTokenBalance) return true
    return token0Balance < Number(amountIn)
  }, [amountIn, isLoadingTokenBalance, token0Balance])

  const noRoutes = route?.length === 0

  const { data } = usePoolFromTokens({
    token0: token0?.address,
    token1: token1?.address,
  })

  const insufficientLiquidity =
    priceImpactPercentage >= 100 ||
    !data?.poolData?.reserve0 ||
    !data?.poolData?.reserve1

  const buttonText = useMemo(() => {
    if (isTxnPending) {
      return 'Swapping'
    }
    if (!amountIn || amountIn.eq('0')) {
      return 'Enter Amount'
    }
    if (hasInsufficientToken0Balance) {
      return 'Insufficient Balance on Chain 2'
    }
    if (noRoutes) {
      return 'No Routes Found'
    }
    if (insufficientLiquidity) {
      return 'Insufficient Liquidity'
    }
    if (hasInsufficientGas) {
      return 'Insufficient Gas Balance on Chain 2'
    }
    return 'Swap'
  }, [
    amountIn,
    hasInsufficientToken0Balance,
    noRoutes,
    insufficientLiquidity,
    isTxnPending,
    hasInsufficientGas,
  ])

  const userConfirmationNeeded = useMemo(() => {
    if (priceImpactPercentage >= 15) {
      return true
    }
    return false
  }, [priceImpactPercentage])

  useEffect(() => {
    if (priceImpactPercentage < 15) return
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
          <Button
            size="xl"
            fullWidth
            disabled={
              insufficientLiquidity ||
              (userConfirmationNeeded && !isChecked) ||
              !amountIn ||
              hasInsufficientToken0Balance ||
              noRoutes ||
              !amountOut
            }
          >
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
