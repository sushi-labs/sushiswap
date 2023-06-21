import React, { FC, Fragment, useCallback, useMemo } from 'react'
import { classNames } from '@sushiswap/ui'
import { Transition } from '@headlessui/react'
import { LockClosedIcon, PlusIcon } from '@heroicons/react/solid'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import { Bound, Field } from '../lib/constants'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { AddSectionReviewModalConcentrated } from './AddPage/AddSectionReviewModalConcentrated'
import {
  useConcentratedDerivedMintInfo,
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
} from './ConcentratedLiquidityProvider'
import { FeeAmount, Position, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { Type } from '@sushiswap/currency'
import { useConcentratedPositionOwner } from '@sushiswap/wagmi/future/hooks/positions/hooks/useConcentratedPositionOwner'
import { Button } from '@sushiswap/ui/future/components/button'
import { getV3NonFungiblePositionManagerConractConfig } from '@sushiswap/wagmi/future/hooks/contracts/useV3NonFungiblePositionManager'

interface ConcentratedLiquidityWidget {
  chainId: SushiSwapV3ChainId
  account: string | undefined
  token0: Type | undefined
  token1: Type | undefined
  feeAmount: FeeAmount | undefined
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
  const { onFieldAInput, onFieldBInput } = useConcentratedMintActionHandlers()
  const { independentField, typedValue } = useConcentratedMintState()
  const { data: owner, isLoading: isOwnerLoading } = useConcentratedPositionOwner({ chainId, tokenId })

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
    [noLiquidity, onChange, onFieldAInput]
  )

  const _onFieldBInput = useCallback(
    (val: string) => {
      onFieldBInput(val, noLiquidity)
      if (onChange) {
        onChange(val, 'b')
      }
    },
    [noLiquidity, onChange, onFieldBInput]
  )

  const amounts = useMemo(() => {
    const amounts = []
    if (!depositADisabled) amounts.push(parsedAmounts[Field.CURRENCY_A])
    if (!depositBDisabled) amounts.push(parsedAmounts[Field.CURRENCY_B])
    return amounts
  }, [depositADisabled, depositBDisabled, parsedAmounts])
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks

  return (
    <div className={classNames('flex flex-col gap-4')}>
      {!!existingPosition && !isOwner && !isOwnerLoading && (
        <div className="p-6 font-medium bg-red/10 text-red rounded-xl">
          You are not the owner of this LP position. You will not be able to withdraw the liquidity from this position
          unless you own the following address: {owner}
        </div>
      )}
      {outOfRange && (
        <div className="p-6 font-medium bg-yellow/10 text-yellow rounded-xl">
          Your position will not earn fees or be used in trades until the market price moves into your range.
        </div>
      )}

      {invalidRange && (
        <div className="p-6 font-medium bg-yellow/10 text-yellow rounded-xl">
          Invalid range selected. The minimum price must be lower than the maximum price.
        </div>
      )}
      <div
        className={classNames(
          !isPoolLoading &&
            !isOwnerLoading &&
            (tickLower === undefined || tickUpper === undefined || invalidPool || invalidRange)
            ? 'opacity-40 pointer-events-none'
            : '',
          'flex flex-col gap-4'
        )}
      >
        <div className="relative">
          <Transition
            as={Fragment}
            show={depositADisabled && !depositBDisabled}
            enter="transition duration-300 origin-center ease-out"
            enterFrom="transform opacity-0"
            enterTo="transform opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
          >
            <div className="bg-gray-200 dark:bg-slate-800 absolute inset-0 z-[1] rounded-xl flex items-center justify-center">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-10 text-sm font-medium text-center">
                <LockClosedIcon width={24} height={24} className="text-gray-400 dark:text-slate-400 text-slate-600" />
                <span className="dark:text-slate-400 text-slate-600">
                  The market price is outside your specified price range. Single-asset deposit only.{' '}
                  <a
                    // TODO
                    href="https://www.sushi.com/academy"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue hover:text-blue-600"
                  >
                    Learn More
                  </a>
                </span>
              </div>
            </div>
          </Transition>
          <Web3Input.Currency
            id='add-liquidity-token0'
            type="INPUT"
            className="p-3 bg-white dark:bg-slate-800 rounded-xl"
            chainId={chainId}
            value={formattedAmounts[Field.CURRENCY_A]}
            onChange={_onFieldAInput}
            onSelect={setToken0}
            currency={token0}
            disabled={depositADisabled}
            loading={tokensLoading || isOwnerLoading || isPoolLoading}
          />
        </div>
        <div className="left-0 right-0 mt-[-24px] mb-[-24px] flex items-center justify-center">
          <button type="button" className="z-10 p-2 bg-gray-100 rounded-full dark:bg-slate-900">
            <PlusIcon strokeWidth={3} className="w-4 h-4 text-gray-500 dark:text-slate-400 text-slate-600" />
          </button>
        </div>
        <div className="relative">
          <Transition
            as={Fragment}
            show={depositBDisabled && !depositADisabled}
            enter="transition duration-300 origin-center ease-out"
            enterFrom="transform opacity-0"
            enterTo="transform opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
          >
            <div className="bg-gray-200 dark:bg-slate-800 absolute inset-0 z-[1] rounded-xl flex items-center justify-center">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-10 text-sm font-medium text-center">
                <LockClosedIcon width={24} height={24} className="text-gray-400 dark:text-slate-400 text-slate-600" />
                <span className="dark:text-slate-400 text-slate-600">
                  The market price is outside your specified price range. Single-asset deposit only.{' '}
                  <a
                    // TODO
                    href="https://www.sushi.com/academy"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue hover:text-blue-600"
                  >
                    Learn More
                  </a>
                </span>
              </div>
            </div>
          </Transition>
          <Web3Input.Currency
            id='add-liquidity-token1'
            type="INPUT"
            className="p-3 bg-white dark:bg-slate-800 rounded-xl"
            chainId={chainId}
            value={formattedAmounts[Field.CURRENCY_B]}
            onChange={_onFieldBInput}
            onSelect={setToken1}
            currency={token1}
            loading={tokensLoading || isOwnerLoading || isPoolLoading}
            disabled={depositBDisabled}
          />
        </div>

        <Checker.Connect fullWidth size="xl">
          <Checker.Network fullWidth size="xl" chainId={chainId}>
            <Checker.Amounts fullWidth size="xl" chainId={chainId} amounts={amounts}>
              <Checker.ApproveERC20
                size="xl"
                fullWidth
                id="approve-erc20-0"
                amount={parsedAmounts[Field.CURRENCY_A]}
                contract={getV3NonFungiblePositionManagerConractConfig(chainId).address}
                enabled={!depositADisabled}
              >
                <Checker.ApproveERC20
                  size="xl"
                  fullWidth
                  id="approve-erc20-1"
                  amount={parsedAmounts[Field.CURRENCY_B]}
                  contract={getV3NonFungiblePositionManagerConractConfig(chainId).address}
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
                    successLink={successLink}
                  >
                    {({ setOpen }) => (
                      <Button fullWidth onClick={() => setOpen(true)} size="xl" testId='add-liquidity-preview'>
                        Preview
                      </Button>
                    )}
                  </AddSectionReviewModalConcentrated>
                </Checker.ApproveERC20>
              </Checker.ApproveERC20>
            </Checker.Amounts>
          </Checker.Network>
        </Checker.Connect>
      </div>
    </div>
  )
}
