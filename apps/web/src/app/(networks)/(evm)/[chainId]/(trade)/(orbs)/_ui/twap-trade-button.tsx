'use client'

import {
  type ButtonProps,
  DialogTrigger,
  Message,
  classNames,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import React, { type FC } from 'react'
import { APPROVE_TAG_SWAP } from 'src/lib/constants'
import { useWrapNative } from 'src/lib/wagmi/hooks/wnative/useWrapNative'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import type { Amount } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'
import { TwapTradeReviewDialog } from './twap-trade-review-dialog'
import { useIsTwapMaintenance } from './use-is-twap-maintenance'
import { useInputErrors, useAddresses, Module } from '@orbs-network/spot-react'
import { useDerivedStateSimpleSwap } from '../../swap/_ui/derivedstate-simple-swap-provider'

type WrapNativeCheckerProps = ButtonProps & {
  amount: Amount<EvmCurrency> | undefined
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

type TwapTradeCheckerProps = ButtonProps & {
  chainId: number
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
  const errors = useInputErrors()

  return errors ? (
    <Button
      disabled={true}
      className={className}
      fullWidth={fullWidth}
      size={size}
      testId={id}
      {...props}
    >
      {errors.message}
    </Button>
  ) : (
    <>{children}</>
  )
}

export const TwapTradeButton = ({ module }: { module: Module }) => {
  const { data: maintenance } = useIsTwapMaintenance(module)

  const {
    state: { swapAmount, chainId },
  } = useDerivedStateSimpleSwap()

  const errors = useInputErrors()
  const { spender } = useAddresses()

  return (
    <TwapTradeReviewDialog module={module}>
      <Checker.Guard
        guardWhen={maintenance}
        guardText="Maintenance in progress"
      >
        <Checker.Connect>
          <Checker.Network chainId={chainId}>
            <TwapTradeChecker chainId={chainId}>
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
      </Checker.Guard>
    </TwapTradeReviewDialog>
  )
}
