import { Button, DialogTrigger } from '@sushiswap/ui'
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks'
import { useEffect, useMemo, useState } from 'react'
import { ROUTER_CONTRACT } from '~tron/_common/constants/contracts'
import { useAllowance } from '~tron/_common/lib/hooks/useAllowance'
import { useTokenBalance } from '~tron/_common/lib/hooks/useTokenBalance'
import { formatUnitsForInput } from '~tron/_common/lib/utils/formatters'
import { getIfWrapOrUnwrap } from '~tron/_common/lib/utils/helpers'
import { useSwapState } from '~tron/swap/swap-provider'
import { ApproveToken } from '../Shared/ApproveToken'

export const ReviewSwapDialogTrigger = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const {
    token0,
    token1,
    amountIn,
    isTxnPending,
    priceImpactPercentage,
    route,
    amountOut,
  } = useSwapState()
  const { address } = useWallet()
  const { data: allowanceAmount, refetch } = useAllowance({
    tokenAddress: token0?.address as string,
    ownerAddress: address as string,
    spenderAddress: ROUTER_CONTRACT,
  })
  const { data: tokenBalance, isLoading } = useTokenBalance({
    accountAddress: address,
    tokenAddress: token0.address,
  })

  const refreshAllowance = async () => {
    await refetch()
  }

  const hasInsufficientBalance = useMemo(() => {
    if (isLoading) return true
    return (
      Number(formatUnitsForInput(tokenBalance ?? '0', token0.decimals)) <
      Number(amountIn)
    )
  }, [tokenBalance, token0, amountIn, isLoading])

  const swapType = useMemo(() => {
    return getIfWrapOrUnwrap(token0, token1)
  }, [token0, token1])

  const noRoutes = swapType === 'swap' && route?.length === 0

  const allowanceFormatted = formatUnitsForInput(
    allowanceAmount ?? '0',
    token0?.decimals,
  )

  const insufficientLiquidity = priceImpactPercentage >= 100

  const buttonText = useMemo(() => {
    if (isTxnPending) {
      return 'Swapping'
    }
    if (!amountIn || amountIn === '0' || !amountOut || amountOut === '0') {
      return 'Enter Amount'
    }
    if (hasInsufficientBalance) {
      return 'Insufficient Balance'
    }
    if (swapType === 'unwrap') {
      return 'Unwrap'
    }
    if (swapType === 'wrap') {
      return 'Wrap'
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
    return 'Review Swap'
  }, [
    amountIn,
    allowanceAmount,
    hasInsufficientBalance,
    noRoutes,
    allowanceFormatted,
    swapType,
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
      {buttonText === 'Approve' ? (
        <ApproveToken
          tokenToApprove={token0}
          amount={amountIn}
          spenderAddress={ROUTER_CONTRACT}
          onSuccess={refreshAllowance}
          buttonProps={{ size: 'xl', fullWidth: true }}
        />
      ) : (
        <DialogTrigger
          disabled={
            insufficientLiquidity ||
            (userConfirmationNeeded && !isChecked) ||
            !amountIn ||
            hasInsufficientBalance ||
            noRoutes
          }
          asChild
        >
          <Button size="xl" fullWidth>
            {buttonText}
          </Button>
        </DialogTrigger>
      )}
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
