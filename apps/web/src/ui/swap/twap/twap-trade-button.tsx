'use client'

import { type ButtonProps, DialogTrigger, classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import React, { type FC } from 'react'
import type { TwapSupportedChainId } from 'src/config'
import { APPROVE_TAG_SWAP } from 'src/lib/constants'
import { TwapSDK } from 'src/lib/swap/twap/TwapSDK'
import { useWrapNative } from 'src/lib/wagmi/hooks/wnative/useWrapNative'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import type { Amount, Type } from 'sushi/currency'
import type { Address } from 'viem'
import {
  useDerivedStateTwap,
  useTwapTrade,
  useTwapTradeErrors,
} from './derivedstate-twap-provider'
import { TwapTradeReviewDialog } from './twap-trade-review-dialog'
import { useIsTwapMaintenance } from './use-is-twap-maintenance'

type WrapNativeCheckerProps = ButtonProps & {
  amount: Amount<Type> | undefined
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

  return amount?.currency?.isNative && !isSuccess ? (
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

type TwapTradeCheckerProps = ButtonProps & {
  chainId: TwapSupportedChainId
}

const TwapTradeChecker: FC<TwapTradeCheckerProps> = ({
  id,
  chainId,
  children,
  className,
  fullWidth = true,
  size = 'xl',
  enabled = true,
  ...props
}) => {
  const { minTradeSizeError, minFillDelayError, maxFillDelayError } =
    useTwapTradeErrors()
  return minTradeSizeError || minFillDelayError || maxFillDelayError ? (
    <Button
      disabled={true}
      className={className}
      fullWidth={fullWidth}
      size={size}
      testId={id}
      {...props}
    >
      {minTradeSizeError
        ? 'Inadequate Trade Size'
        : minFillDelayError
          ? 'Trade Interval Below Limit'
          : maxFillDelayError
            ? 'Trade Interval Exceeds Limit'
            : ''}
    </Button>
  ) : (
    <>{children}</>
  )
}

export const TwapTradeButton = () => {
  const { data: maintenance } = useIsTwapMaintenance()

  const {
    state: { swapAmount, chainId },
  } = useDerivedStateTwap()

  const { data: trade } = useTwapTrade()

  return (
    <TwapTradeReviewDialog>
      <Checker.Guard
        guardWhen={maintenance}
        guardText="Maintenance in progress"
      >
        <Checker.Connect>
          <Checker.Network chainId={chainId}>
            <TwapTradeChecker chainId={chainId}>
              <Checker.Amounts chainId={chainId} amount={swapAmount}>
                <WrapNativeChecker amount={swapAmount}>
                  <Checker.ApproveERC20
                    id="approve-erc20"
                    amount={swapAmount?.wrapped}
                    contract={
                      TwapSDK.onNetwork(chainId).config.twapAddress as Address
                    }
                  >
                    <Checker.Success tag={APPROVE_TAG_SWAP}>
                      <DialogTrigger asChild>
                        <Button
                          size="xl"
                          disabled={!trade}
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
      </Checker.Guard>
    </TwapTradeReviewDialog>
  )
}
