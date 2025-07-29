'use client'

import { Transition } from '@headlessui/react'
import { LockClosedIcon, PlusIcon } from '@heroicons/react-v1/solid'
import { DialogTrigger, FormSection, Message, classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { type FC, Fragment, useCallback, useMemo } from 'react'
import {
  SUSHISWAP_V3_POSITION_MANAGER,
  type SushiSwapV3ChainId,
  type SushiSwapV3FeeAmount,
  isWNativeSupported,
} from 'sushi/config'
import type { Type } from 'sushi/currency'
import type { Position } from 'sushi/pool/sushiswap-v3'

import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { useConcentratedPositionOwner } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionOwner'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { Bound, Field } from '../../../lib/constants'
import { AddSectionReviewModalConcentrated } from '../AddSectionReviewModalConcentrated'
import {
  useConcentratedDerivedMintInfo,
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
} from '../ConcentratedLiquidityProvider'
import { EstimatedValue } from './estimated-value'

interface ConcentratedLiquidityWidget {
  chainId: SushiSwapV3ChainId
  account: string | undefined
  token0: Type | undefined
  token1: Type | undefined
  feeAmount: SushiSwapV3FeeAmount | undefined
  setToken0?(token: Type): void
  setToken1?(token: Type): void
  tokensLoading: boolean
  tokenId: number | string | undefined
  existingPosition: Position | undefined
  onChange?(val: string, input: 'a' | 'b'): void
  successLink?: string
}

export const ConcentratedLiquidityWidget: FC<ConcentratedLiquidityWidget> = ({
  chainId,
  account,
  feeAmount,
  token0,
  token1,
  setToken0,
  setToken1,
  tokensLoading,
  tokenId,
  existingPosition,
  onChange,
  successLink,
}) => {
  const [slippagePercent] = useSlippageTolerance(
    SlippageToleranceStorageKey.AddLiquidity,
  )
  const { onFieldAInput, onFieldBInput } = useConcentratedMintActionHandlers()
  const { independentField, typedValue } = useConcentratedMintState()
  const { data: owner, isInitialLoading: isOwnerLoading } =
    useConcentratedPositionOwner({
      chainId,
      tokenId,
    })

  const isOwner = owner === account

  const {
    dependentField,
    noLiquidity,
    parsedAmounts,
    outOfRange,
    invalidRange,
    price,
    pricesAtTicks,
    ticksAtLimit,
    ticks,
    depositADisabled,
    depositBDisabled,
    invalidPool,
    position,
    isInitialLoading: isPoolLoading,
  } = useConcentratedDerivedMintInfo({
    chainId,
    account,
    token0,
    token1,
    baseToken: token0,
    feeAmount,
    existingPosition,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const _onFieldAInput = useCallback(
    (val: string) => {
      onFieldAInput(val, noLiquidity)
      if (onChange) {
        onChange(val, 'a')
      }
    },
    [noLiquidity, onChange, onFieldAInput],
  )

  const _onFieldBInput = useCallback(
    (val: string) => {
      onFieldBInput(val, noLiquidity)
      if (onChange) {
        onChange(val, 'b')
      }
    },
    [noLiquidity, onChange, onFieldBInput],
  )

  const amounts = useMemo(() => {
    const amounts = []
    if (!depositADisabled) amounts.push(parsedAmounts[Field.CURRENCY_A])
    if (!depositBDisabled) amounts.push(parsedAmounts[Field.CURRENCY_B])
    return amounts
  }, [depositADisabled, depositBDisabled, parsedAmounts])
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks

  return (
    <div className={classNames('flex flex-col gap-8')}>
      <p className="font-medium text-slate-900 dark:text-pink-100 text-base">
        Deposit Tokens
      </p>
      <div className={classNames('flex flex-col gap-4 md:px-4')}>
        {!!existingPosition && !isOwner && !isOwnerLoading ? (
          <Message size="sm" variant="destructive">
            You are not the owner of this LP position. You will not be able to
            withdraw the liquidity from this position unless you own the
            following address: {owner}
          </Message>
        ) : null}
        {outOfRange ? (
          <Message size="sm" variant="warning">
            Your position will not earn fees or be used in trades until the
            market price moves into your range.
          </Message>
        ) : null}

        {invalidRange ? (
          <Message size="sm" variant="warning">
            Invalid range selected. The minimum price must be lower than the
            maximum price.
          </Message>
        ) : null}
        <div
          className={classNames(
            !isPoolLoading &&
              !isOwnerLoading &&
              (tickLower === undefined ||
                tickUpper === undefined ||
                invalidPool ||
                invalidRange)
              ? 'opacity-40 pointer-events-none'
              : '',
            'flex flex-col gap-4',
          )}
        >
          <div className="relative">
            {depositADisabled && !depositBDisabled ? null : (
              <Web3Input.Currency
                id="add-liquidity-token0"
                type="INPUT"
                className="p-4 bg-gray-100 dark:bg-slate-900 rounded-xl"
                chainId={chainId}
                value={formattedAmounts[Field.CURRENCY_A]}
                onChange={_onFieldAInput}
                onSelect={setToken0}
                currency={token0}
                disabled={depositADisabled}
                loading={tokensLoading || isOwnerLoading || isPoolLoading}
                allowNative={isWNativeSupported(chainId)}
                hidePercentageInputs={true}
              />
            )}
          </div>
          {depositADisabled || depositBDisabled ? null : (
            <div className="flex items-center justify-center mt-[-24px] mb-[-24px] z-[21]">
              <button
                type="button"
                className="z-10 p-2 bg-gray-100 rounded-full dark:bg-slate-900 border border-slate-50 dark:border-slate-800"
              >
                <PlusIcon
                  strokeWidth={3}
                  className="w-4 h-4 dark:text-skyblue text-blue"
                />
              </button>
            </div>
          )}
          <div className="relative mb-4">
            {!depositADisabled && depositBDisabled ? null : (
              <Web3Input.Currency
                id="add-liquidity-token1"
                type="INPUT"
                className="p-4 bg-gray-100 dark:bg-slate-900 rounded-xl"
                chainId={chainId}
                value={formattedAmounts[Field.CURRENCY_B]}
                onChange={_onFieldBInput}
                onSelect={setToken1}
                currency={token1}
                loading={tokensLoading || isOwnerLoading || isPoolLoading}
                disabled={depositBDisabled}
                allowNative={isWNativeSupported(chainId)}
                hidePercentageInputs={true}
              />
            )}
          </div>

          <Checker.Connect fullWidth>
            <Checker.Network fullWidth chainId={chainId}>
              <Checker.Amounts fullWidth chainId={chainId} amounts={amounts}>
                <Checker.Slippage
                  fullWidth
                  slippageTolerance={slippagePercent}
                  text="Continue With High Slippage"
                >
                  <Checker.ApproveERC20
                    fullWidth
                    id="approve-erc20-0"
                    amount={parsedAmounts[Field.CURRENCY_A]}
                    contract={SUSHISWAP_V3_POSITION_MANAGER[chainId]}
                    enabled={!depositADisabled}
                  >
                    <Checker.ApproveERC20
                      fullWidth
                      id="approve-erc20-1"
                      amount={parsedAmounts[Field.CURRENCY_B]}
                      contract={SUSHISWAP_V3_POSITION_MANAGER[chainId]}
                      enabled={!depositBDisabled}
                    >
                      <AddSectionReviewModalConcentrated
                        chainId={chainId}
                        feeAmount={feeAmount}
                        token0={token0}
                        token1={token1}
                        input0={parsedAmounts[Field.CURRENCY_A]}
                        input1={parsedAmounts[Field.CURRENCY_B]}
                        position={position}
                        noLiquidity={noLiquidity}
                        price={price}
                        pricesAtTicks={pricesAtTicks}
                        ticksAtLimit={ticksAtLimit}
                        tokenId={tokenId}
                        existingPosition={existingPosition}
                        onSuccess={() => {
                          _onFieldAInput('')
                          _onFieldBInput('')
                        }}
                        successLink={successLink}
                      >
                        <DialogTrigger asChild>
                          <Button
                            fullWidth
                            size="xl"
                            testId="add-liquidity-preview"
                          >
                            Preview
                          </Button>
                        </DialogTrigger>
                      </AddSectionReviewModalConcentrated>
                    </Checker.ApproveERC20>
                  </Checker.ApproveERC20>
                </Checker.Slippage>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connect>
        </div>
        <EstimatedValue dollarValue={'0'} isLoading={false} />
      </div>
    </div>
  )
}
