'use client'

import {
  InputErrors,
  type Module,
  useAddresses,
  useInputErrors,
} from '@orbs-network/spot-react'
import { type ButtonProps, DialogTrigger, classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import React, { type FC } from 'react'
import { APPROVE_TAG_SWAP } from 'src/lib/constants'
import { useWrapNative } from 'src/lib/wagmi/hooks/wnative/useWrapNative'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import type { Amount } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'
import { useDerivedStateSimpleSwap } from '../../swap/_ui/derivedstate-simple-swap-provider'
import { TwapTradeReviewDialog } from './twap-trade-review-dialog'

function getInputErrorMessage(error: ReturnType<typeof useInputErrors>) {
  if (!error) return undefined

  switch (error.type) {
    case InputErrors.EMPTY_LIMIT_PRICE:
      return 'Enter a limit price'
    case InputErrors.MAX_CHUNKS:
      return `Inadequate Trade Size, ${error.value} is max`
    case InputErrors.MAX_FILL_DELAY:
      return 'Trade interval above limit'
    case InputErrors.MAX_ORDER_DURATION:
      return 'Order duration above limit'
    case InputErrors.MAX_ORDER_SIZE:
      return 'Order size above limit'
    case InputErrors.MIN_CHUNKS:
      return 'Place order'
    case InputErrors.MIN_ORDER_DURATION:
      return 'Order duration below limit'
    case InputErrors.MIN_FILL_DELAY:
      return 'Trade Interval Below Limit'
    case InputErrors.MIN_TRADE_SIZE:
      return 'Trade size below minimum'
    case InputErrors.MISSING_LIMIT_PRICE:
      return 'Set a limit price'
    case InputErrors.INSUFFICIENT_BALANCE:
      return 'Insufficient balance'
    case InputErrors.STOP_LOSS_TRIGGER_PRICE_GREATER_THAN_MARKET_PRICE:
      return 'Trigger price must be lower than market price'
    case InputErrors.TAKE_PROFIT_TRIGGER_PRICE_LESS_THAN_MARKET_PRICE:
      return 'Trigger price must be higher than market price'
    case InputErrors.TRIGGER_LIMIT_PRICE_GREATER_THAN_TRIGGER_PRICE:
      return 'Limit price must be lower than the trigger price'
    case InputErrors.EMPTY_TRIGGER_PRICE:
      return 'Enter a trigger price'
  }
}

type WrapNativeCheckerProps = ButtonProps & {
  amount: Amount<EvmCurrency> | undefined
  enabled?: boolean
}

const WrapNativeChecker: FC<WrapNativeCheckerProps> = ({
  id,
  amount,
  children,
  className,
  fullWidth = true,
  size = 'xl',
  enabled = true,
  ...props
}) => {
  const { write, isPending, isSuccess } = useWrapNative({ amount, enabled })

  return amount?.currency?.type === 'native' && !isSuccess ? (
    <Button
      disabled={!write}
      className={classNames(className, 'group relative')}
      loading={isPending}
      onClick={() => write?.()}
      fullWidth={fullWidth}
      size={size}
      testId={id}
      {...props}
    >
      Wrap {amount?.currency.symbol}
    </Button>
  ) : (
    <>{children}</>
  )
}

const TwapTradeChecker: FC<ButtonProps> = ({
  id,
  children,
  className,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const errors = useInputErrors()
  const errorMessage = getInputErrorMessage(errors)

  return errorMessage ? (
    <Button
      disabled={true}
      className={className}
      fullWidth={fullWidth}
      size={size}
      testId={id}
      {...props}
    >
      {errorMessage}
    </Button>
  ) : (
    <>{children}</>
  )
}

export const TwapTradeButton = ({ module }: { module: Module }) => {
  const {
    state: { swapAmount, chainId },
  } = useDerivedStateSimpleSwap()

  const errors = useInputErrors()
  const { spender } = useAddresses()

  return (
    <TwapTradeReviewDialog module={module}>
      <Checker.Connect>
        <Checker.Network chainId={chainId}>
          <TwapTradeChecker>
            <Checker.Amounts chainId={chainId} amount={swapAmount}>
              <WrapNativeChecker amount={swapAmount as Amount<EvmCurrency>}>
                <Checker.ApproveERC20
                  id="approve-erc20"
                  amount={swapAmount?.wrap()}
                  contract={spender}
                >
                  <Checker.Success tag={APPROVE_TAG_SWAP}>
                    <DialogTrigger asChild>
                      <Button
                        size="xl"
                        disabled={!!errors}
                        fullWidth
                        testId="swap"
                      >
                        Place order
                      </Button>
                    </DialogTrigger>
                  </Checker.Success>
                </Checker.ApproveERC20>
              </WrapNativeChecker>
            </Checker.Amounts>
          </TwapTradeChecker>
        </Checker.Network>
      </Checker.Connect>
    </TwapTradeReviewDialog>
  )
}
