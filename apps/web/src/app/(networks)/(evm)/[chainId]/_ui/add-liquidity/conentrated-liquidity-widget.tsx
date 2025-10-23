'use client'

import { InformationCircleIcon, PlusIcon } from '@heroicons/react-v1/solid'
import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { Message, classNames } from '@sushiswap/ui'
import { type FC, useCallback, useMemo } from 'react'
import { Bound, Field } from 'src/lib/constants'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { useConcentratedPositionOwner } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionOwner'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import {
  SUSHISWAP_V3_POSITION_MANAGER,
  type SushiSwapV3ChainId,
  type SushiSwapV3FeeAmount,
  isWNativeSupported,
} from 'sushi/evm'
import type { EvmCurrency, Position } from 'sushi/evm'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import {
  useConcentratedDerivedMintInfo,
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
} from '../concentrated-liquidity-provider'
import { AddLiquidityV3Button } from './add-liquidity-v3-button'
import { EstimatedValue } from './estimated-value'

interface ConcentratedLiquidityWidget {
  chainId: SushiSwapV3ChainId
  account: string | undefined
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  feeAmount: SushiSwapV3FeeAmount | undefined
  setToken0: ((token: EvmCurrency) => void) | undefined
  setToken1: ((token: EvmCurrency) => void) | undefined
  tokensLoading: boolean
  tokenId: number | string | undefined
  existingPosition: Position | undefined
  onChange?(val: string, input: 'a' | 'b'): void
  successLink: string | undefined
  inputClassName?: string
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
  inputClassName,
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

  const { data: price0, isLoading: isPrice0Loading } = usePrice({
    chainId: token0?.chainId,
    address: token0?.wrap()?.address,
    enabled: !!token0,
  })
  const { data: price1, isLoading: isPrice1Loading } = usePrice({
    chainId: token1?.chainId,
    address: token1?.wrap()?.address,
    enabled: !!token1,
  })

  const estimatedValue = useMemo(() => {
    if (!token0 || !token1) return '0'
    const amount0 = parsedAmounts.CURRENCY_A?.amount || 0n
    const amount1 = parsedAmounts.CURRENCY_B?.amount || 0n
    if (!amount0 || !amount1) return '0'
    const value0 = price0
      ? (price0 * Number(amount0)) / 10 ** token0.decimals
      : 0
    const value1 = price1
      ? (price1 * Number(amount1)) / 10 ** token1.decimals
      : 0

    return (
      (Number.isNaN(value0) ? 0 : value0) + (Number.isNaN(value1) ? 0 : value1)
    ).toFixed(2)
  }, [parsedAmounts, token0, token1, price0, price1])

  return (
    <div className={classNames('flex flex-col gap-4')}>
      <p className="font-medium text-slate-900 dark:text-pink-100 text-base">
        Deposit Tokens
      </p>
      <div className={classNames('flex flex-col gap-2')}>
        {!!existingPosition && !isOwner && !isOwnerLoading ? (
          <Message size="sm" variant="info">
            <div className="flex items-center gap-1">
              <InformationCircleIcon className="w-3 h-3" /> You are not the
              owner of this LP position. You will not be able to withdraw the
              liquidity from this position unless you own the following address:{' '}
              {owner}
            </div>
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
                className={classNames(
                  'p-4 bg-slate-50 dark:bg-slate-800  rounded-xl',
                  inputClassName,
                )}
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
            <div className="flex items-center justify-center mt-[-24px] mb-[-24px] z-[19]">
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
          <div className="relative mb-2">
            {!depositADisabled && depositBDisabled ? null : (
              <Web3Input.Currency
                id="add-liquidity-token1"
                type="INPUT"
                className={classNames(
                  'p-4 bg-slate-50 dark:bg-slate-800  rounded-xl',
                  inputClassName,
                )}
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
                      <AddLiquidityV3Button
                        chainId={chainId}
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
                      />
                    </Checker.ApproveERC20>
                  </Checker.ApproveERC20>
                </Checker.Slippage>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connect>
        </div>
        <EstimatedValue
          dollarValue={estimatedValue}
          isLoading={isPrice0Loading || isPrice1Loading}
        />
      </div>
    </div>
  )
}
