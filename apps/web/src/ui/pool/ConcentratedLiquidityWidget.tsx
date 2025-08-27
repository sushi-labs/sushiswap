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
import { Bound, Field } from '../../lib/constants'
import { AddSectionReviewModalConcentrated } from './AddSectionReviewModalConcentrated'
import {
  useConcentratedDerivedMintInfo,
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
} from './ConcentratedLiquidityProvider'

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
  withTitleAndDescription?: boolean
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
  withTitleAndDescription = true,
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

  const widget = (
    <div className={classNames('flex flex-col gap-4')}>
      {!!existingPosition && !isOwner && !isOwnerLoading ? (
        <Message size="sm" variant="destructive">
          You are not the owner of this LP position. You will not be able to
          withdraw the liquidity from this position unless you own the following
          address: {owner}
        </Message>
      ) : null}
      {outOfRange ? (
        <Message size="sm" variant="warning">
          Your position will not earn fees or be used in trades until the market
          price moves into your range.
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
          {depositADisabled && !depositBDisabled ? (
            <div className="bg-gray-200 dark:bg-slate-800 absolute inset-0 z-[1] rounded-xl flex items-center justify-center">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-10 text-sm font-medium text-center">
                <LockClosedIcon
                  width={24}
                  height={24}
                  className="text-gray-400 dark:text-slate-400"
                />
                <span className="dark:text-slate-400 text-slate-600">
                  The market price is outside your specified price range.
                  Single-asset deposit only.{' '}
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
          ) : null}
          <Web3Input.Currency
            id="add-liquidity-token0"
            type="INPUT"
            className="p-4 bg-background dark:bg-background rounded-xl"
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
        </div>
        <div className="flex items-center justify-center mt-[-24px] mb-[-24px] z-10">
          <div className="p-1.5 bg-slate-200 dark:bg-slate-750 border borde-slate-50 dark:border-slate-800 rounded-full">
            <PlusIcon
              width={16}
              height={16}
              className="text-blue dark:text-blue"
            />
          </div>
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
                <LockClosedIcon
                  width={24}
                  height={24}
                  className="text-gray-400 dark:text-slate-400"
                />
                <span className="dark:text-slate-400 text-slate-600">
                  The market price is outside your specified price range.
                  Single-asset deposit only.{' '}
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
            id="add-liquidity-token1"
            type="INPUT"
            className="p-4 bg-background dark:bg-background rounded-xl"
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
    </div>
  )

  if (withTitleAndDescription)
    return (
      <FormSection
        title="Liquidity"
        description="Depending on your range, the supplied tokens for this position will not always be a 50:50 ratio."
      >
        {widget}
      </FormSection>
    )

  return widget
}
