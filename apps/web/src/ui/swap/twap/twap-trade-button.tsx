'use client'

import { type ButtonProps, DialogTrigger, classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import { readContract } from '@wagmi/core'
import React, { useEffect, useMemo, type FC } from 'react'
import type { TwapSupportedChainId } from 'src/config'
import { APPROVE_TAG_SWAP } from 'src/lib/constants'
import { TwapSDK } from 'src/lib/swap/twap/TwapSDK'
import { useWrapNative } from 'src/lib/wagmi/hooks/wnative/useWrapNative'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import type { ApproveERC20Props } from 'src/lib/wagmi/systems/Checker/ApproveERC20'
import { withCheckerRoot } from 'src/lib/wagmi/systems/Checker/Provider'
import { erc20Abi_allowance } from 'sushi/abi'
import { Amount, type Type } from 'sushi/currency'
import { type Address, maxUint256 } from 'viem'
import { useAccount, useConfig } from 'wagmi'
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

const ERC20ApproveChecker: FC<ApproveERC20Props> = ({ children, ...props }) => {
  const { contract, amount, enabled = true } = props

  const { address } = useAccount()

  const config = useConfig()

  // using useQuery over useReadContract to prevent unintended cache behavior w/ useTokenApproval
  const { data: allowance } = useQuery({
    queryKey: ['allowance', amount?.currency.id, address, contract],
    queryFn: async () => {
      if (!amount || !address || !contract) throw new Error()

      return await readContract(config, {
        abi: erc20Abi_allowance,
        chainId: amount.currency.chainId,
        address: amount.currency.wrapped.address,
        functionName: 'allowance',
        args: [address, contract],
      })
    },
    enabled: Boolean(
      enabled && amount?.currency.isToken && address && contract,
    ),
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const amountToApprove = useMemo(() => {
    if (amount?.currency.isNative || allowance === maxUint256) return amount
    if (typeof amount === 'undefined' || typeof allowance === 'undefined')
      return undefined
    return amount.add(Amount.fromRawAmount(amount.currency, allowance))
  }, [amount, allowance])

  return (
    <Checker.ApproveERC20 {...props} amount={amountToApprove}>
      {children}
    </Checker.ApproveERC20>
  )
}

export const TwapTradeButton = withCheckerRoot(() => {
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
                  <ERC20ApproveChecker
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
                  </ERC20ApproveChecker>
                </WrapNativeChecker>
              </Checker.Amounts>
            </TwapTradeChecker>
          </Checker.Network>
        </Checker.Connect>
      </Checker.Guard>
    </TwapTradeReviewDialog>
  )
})
