import { Button, type ButtonProps, DialogTrigger } from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
import { formatUnitsForInput } from '~kadena/_common/lib/utils/formatters'
// import { ApproveToken } from '~tron/_common/ui/Shared/ApproveToken'
// import { ROUTER_CONTRACT } from '../Remove/RemoveButton'
import { usePoolState } from '../pool-provider'

export const ReviewAddDialogTrigger = (props: ButtonProps) => {
  const { token0, token1, isTxnPending, amountInToken0, amountInToken1 } =
    usePoolState()

  const token0Balance = '1.2'
  const token1Balance = '2.4'
  const [isLoadingToken0Balance, setIsLoadingToken0Balance] = useState(true)
  const [isLoadingToken1Balance, setIsLoadingToken1Balance] = useState(true)

  useEffect(() => {
    setIsLoadingToken0Balance(true)
    setIsLoadingToken1Balance(true)
  }, [])

  const token0AllowanceAmount = '2.4'
  const token1AllowanceAmount = '3.6'
  // const refetchToken0Allowance = async () => {}
  // const refetchToken1Allowance = async () => {}

  const hasInsufficientToken0Balance = useMemo(() => {
    if (isLoadingToken0Balance) return true
    return (
      Number(
        formatUnitsForInput(token0Balance ?? '0', token0?.tokenDecimals ?? 18),
      ) < Number(amountInToken0)
    )
  }, [token0, amountInToken0, isLoadingToken0Balance])

  const hasInsufficientToken1Balance = useMemo(() => {
    if (isLoadingToken1Balance) return true
    return (
      Number(
        formatUnitsForInput(token1Balance ?? '0', token1?.tokenDecimals ?? 18),
      ) < Number(amountInToken1)
    )
  }, [token1, amountInToken1, isLoadingToken1Balance])

  const token0AllowanceFormatted = formatUnitsForInput(
    token0AllowanceAmount ?? '0',
    token0?.tokenDecimals ?? 18,
  )

  const token1AllowanceFormatted = formatUnitsForInput(
    token1AllowanceAmount ?? '0',
    token1?.tokenDecimals ?? 18,
  )

  const hasInsufficientToken0Allowance = useMemo(() => {
    return (
      !!token1AllowanceAmount &&
      Number(token0AllowanceFormatted) < Number(amountInToken0)
    )
  }, [token0AllowanceFormatted, amountInToken0])

  const hasInsufficientToken1Allowance = useMemo(() => {
    return (
      !!token1AllowanceAmount &&
      Number(token1AllowanceFormatted) < Number(amountInToken1)
    )
  }, [token1AllowanceFormatted, amountInToken1])

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
    if (hasInsufficientToken0Allowance) {
      return `Approve ${token0?.tokenSymbol} Token`
    }
    if (hasInsufficientToken1Allowance) {
      return `Approve ${token1?.tokenSymbol} Token`
    }

    return 'Add Liquidity'
  }, [
    hasInsufficientToken0Balance,
    hasInsufficientToken1Balance,
    hasInsufficientToken0Allowance,
    hasInsufficientToken1Allowance,
    invalidAmount,
    token0,
    token1,
    isTxnPending,
  ])

  // if (buttonText === `Approve ${token0?.tokenSymbol} Token`) {
  //   return (
  //     <ApproveToken
  //       tokenToApprove={token0!}
  //       amount={amountInToken0}
  //       spenderAddress={ROUTER_CONTRACT}
  //       onSuccess={async () => {
  //         await refetchToken0Allowance()
  //       }}
  //       buttonProps={props}
  //     />
  //   )
  // }

  // if (buttonText === `Approve ${token1?.tokenSymbol} Token`) {
  //   return (
  //     <ApproveToken
  //       tokenToApprove={token1!}
  //       amount={amountInToken1}
  //       spenderAddress={ROUTER_CONTRACT}
  //       onSuccess={async () => {
  //         await refetchToken1Allowance()
  //       }}
  //       buttonProps={props}
  //     />
  //   )
  // }

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
