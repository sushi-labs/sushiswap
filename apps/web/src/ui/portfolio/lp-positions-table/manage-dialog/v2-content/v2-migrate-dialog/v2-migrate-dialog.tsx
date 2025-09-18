import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react-v1/solid'
import type { V2Pool } from '@sushiswap/graph-client/data-api'
import { SlippageToleranceStorageKey, TTLStorageKey } from '@sushiswap/hooks'
import {
  Button,
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Dots,
  Toggle,
} from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
import { usePoolsByTokenPair } from 'src/lib/hooks/usePoolsByTokenPair'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { SelectFeeConcentratedWidget } from 'src/ui/pool/add-liquidity/select-fee-concentrated-widget'
import { type SushiSwapV3ChainId, SushiSwapV3FeeAmount } from 'sushi/config'
import { ManageDialogHeader } from '../../manage-dialog-header'
import { Positions } from '../../positions'

import { APPROVE_TAG_MIGRATE, Bound } from 'src/lib/constants'
import { useTokenAmountDollarValues, useV2Pool } from 'src/lib/hooks'
import {
  V3MigrateContractConfig,
  useV3Migrate,
} from 'src/lib/wagmi/hooks/migrate/hooks/useV3Migrate'
import type { V3MigrateChainId } from 'src/lib/wagmi/hooks/migrate/types'
import { useSushiSwapV2Pool } from 'src/lib/wagmi/hooks/pools/hooks/useSushiSwapV2Pools'
import { useTotalSupply } from 'src/lib/wagmi/hooks/tokens/useTotalSupply'
import { useTransactionDeadline } from 'src/lib/wagmi/hooks/utils/hooks/useTransactionDeadline'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useApproved } from 'src/lib/wagmi/systems/Checker/Provider'
import { usePoolPosition } from 'src/ui/pool'
import { useConcentratedDerivedMintInfo } from 'src/ui/pool/ConcentratedLiquidityProvider'
import { CustomMessage } from 'src/ui/pool/add-liquidity/custom-message'
import { DoesNotExistMessage } from 'src/ui/pool/add-liquidity/does-not-exist-message'
import { SelectPriceWidget } from 'src/ui/pool/add-liquidity/select-price-widget'
import { formatUSD } from 'sushi'
import type { SushiSwapV2ChainId } from 'sushi/config'
import { Amount, Price } from 'sushi/currency'
import type { Type } from 'sushi/currency'
import { ZERO } from 'sushi/math'
import {
  Position,
  SushiSwapV3Pool,
  TickMath,
  priceToClosestTick,
} from 'sushi/pool/sushiswap-v3'
import { SushiSwapProtocol } from 'sushi/types'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useWaitForTransactionReceipt } from 'wagmi'
import { usePrices } from '../../../../../../app/(networks)/(evm)/_common/ui/price-provider/price-provider/use-prices'

//@DEV @TODO - typed as any until real type is known
export const V2MigrateDialog = ({
  pool,
  fakePosition,
  isOpen,
  setIsOpen,
}: {
  pool: V2Pool
  fakePosition: any
  isOpen: boolean
  setIsOpen: (val: boolean) => void
}) => {
  const [step, setStep] = useState(0)
  const [feeAmount, setFeeAmount] = useState<SushiSwapV3FeeAmount>(
    SushiSwapV3FeeAmount.LOWEST,
  )
  const [invertPrice, setInvertPrice] = useState(false)
  const [invertTokens, setInvertTokens] = useState(false)
  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.AddLiquidity,
  )
  const { address } = useAccount()
  const { data: priceMap } = usePrices({ chainId: pool.chainId })

  const {
    data: { token0: _token0, token1: _token1, liquidityToken },
  } = useV2Pool(pool)
  const {
    value0: _value0,
    value1: _value1,
    underlying0: _underlying0,
    underlying1: _underlying1,
    isLoading,
    balance,
  } = usePoolPosition()
  const [
    token0,
    token1,
    // value0, value1, underlying0, underlying1
  ] = useMemo(
    () =>
      invertTokens
        ? [_token1, _token0, _value1, _value0, _underlying1, _underlying0]
        : [_token0, _token1, _value0, _value1, _underlying0, _underlying1],
    [
      invertTokens,
      _token0,
      _token1,
      _value0,
      _value1,
      _underlying0,
      _underlying1,
    ],
  )

  const { data: pair } = useSushiSwapV2Pool(
    pool.chainId as SushiSwapV2ChainId,
    token0,
    token1,
  )
  const v2SpotPrice = useMemo(
    () =>
      _token0 && _token1 && pair?.[1]?.reserve0 && pair?.[1]?.reserve1
        ? new Price(
            _token0.wrapped,
            _token1.wrapped,
            pair[1].reserve0.quotient,
            pair[1].reserve1.quotient,
          )
        : undefined,
    [_token0, _token1, pair],
  )

  const {
    ticks,
    invalidRange,
    pool: v3Pool,
    // parsedAmounts,
    // pricesAtTicks,
    // ticksAtLimit,
    // price,
    noLiquidity,
    // outOfRange,
    isLoading: isLoadingV3Pool,
  } = useConcentratedDerivedMintInfo({
    chainId: pool.chainId as SushiSwapV3ChainId,
    account: address,
    token0,
    token1,
    baseToken: token0,
    feeAmount,
    existingPosition: undefined,
  })
  const poolExists = Boolean(!isLoadingV3Pool && v3Pool)

  const totalSupply = useTotalSupply(liquidityToken)

  // this is just getLiquidityValue with the fee off, but for the passed pair
  const token0Value = useMemo(
    () =>
      token0 && pair?.[1] && totalSupply && balance
        ? Amount.fromRawAmount(
            token0?.wrapped,
            (balance.quotient *
              (token0.wrapped.equals(pair[1].token0)
                ? pair[1].reserve0.quotient
                : pair[1].reserve1.quotient)) /
              totalSupply.quotient,
          )
        : undefined,
    [token0, pair, totalSupply, balance],
  )

  const token1Value = useMemo(
    () =>
      token1 && pair?.[1]?.reserve1 && totalSupply && balance
        ? Amount.fromRawAmount(
            token1?.wrapped,
            (balance.quotient *
              (token1.wrapped.equals(pair[1].token1)
                ? pair[1].reserve1.quotient
                : pair[1].reserve0.quotient)) /
              totalSupply.quotient,
          )
        : undefined,
    [token1, pair, totalSupply, balance],
  )

  const v3Address =
    token0 && token1 && feeAmount
      ? SushiSwapV3Pool.getAddress(token0.wrapped, token1.wrapped, feeAmount)
      : undefined
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  // the v3 tick is either the pool's tickCurrent, or the tick closest to the v2 spot price
  const tick =
    v3Pool?.tickCurrent ??
    (v2SpotPrice ? priceToClosestTick(v2SpotPrice) : undefined)
  // the price is either the current v3 price, or the price at the tick
  const sqrtPrice =
    v3Pool?.sqrtRatioX96 ??
    (tick ? TickMath.getSqrtRatioAtTick(tick) : undefined)

  const position = useMemo(
    () =>
      typeof tickLower === 'number' &&
      typeof tickUpper === 'number' &&
      !invalidRange &&
      token0 &&
      token1 &&
      token0Value &&
      token1Value &&
      sqrtPrice &&
      tick
        ? Position.fromAmounts({
            pool:
              v3Pool ??
              new SushiSwapV3Pool(
                token0.wrapped,
                token1.wrapped,
                feeAmount,
                sqrtPrice,
                0,
                tick,
                [],
              ),
            tickLower,
            tickUpper,
            amount0: token0.wrapped.sortsBefore(token1.wrapped)
              ? token0Value.quotient
              : token1Value.quotient,
            amount1: token0.wrapped.sortsBefore(token1.wrapped)
              ? token1Value.quotient
              : token0Value.quotient,
            useFullPrecision: true, // we want full precision for the theoretical position
          })
        : undefined,
    [
      feeAmount,
      invalidRange,
      sqrtPrice,
      tick,
      tickLower,
      tickUpper,
      token0,
      token0Value,
      token1,
      token1Value,
      v3Pool,
    ],
  )

  const v3SpotPrice = useMemo(
    () => (v3Pool ? v3Pool?.token0Price : undefined),
    [v3Pool],
  )
  const [positionAmount0, positionAmount1] = useMemo(
    () =>
      invertTokens
        ? [position?.amount1, position?.amount0]
        : [position?.amount0, position?.amount1],
    [invertTokens, position?.amount0, position?.amount1],
  )

  const refund0 = useMemo(
    () =>
      positionAmount0 &&
      token0 &&
      token0Value &&
      Amount.fromRawAmount(
        token0,
        token0Value.quotient - positionAmount0.quotient,
      ),
    [positionAmount0, token0, token0Value],
  )

  const refund1 = useMemo(
    () =>
      positionAmount1 &&
      token1 &&
      token1Value &&
      Amount.fromRawAmount(
        token1,
        token1Value.quotient - positionAmount1.quotient,
      ),
    [positionAmount1, token1, token1Value],
  )

  const [v3FiatValue0, v3FiatValue1, refund0FiatValue, refund1FiatValue] =
    useTokenAmountDollarValues({
      chainId: pool.chainId as SushiSwapV3ChainId,
      amounts: [positionAmount0, positionAmount1, refund0, refund1],
    })

  const { amount0: v3Amount0Min, amount1: v3Amount1Min } = useMemo(
    () =>
      position
        ? position.mintAmountsWithSlippage(slippageTolerance)
        : { amount0: undefined, amount1: undefined },
    [position, slippageTolerance],
  )

  const { approved: approvedMigrate } = useApproved(APPROVE_TAG_MIGRATE)
  const { data: deadline } = useTransactionDeadline({
    storageKey: TTLStorageKey.AddLiquidity,
    chainId: pool.chainId,
  })
  const {
    write: writeMigrate,

    isError,
    isPending: isMigrateLoading,
    data: hash,
  } = useV3Migrate({
    account: address,
    args: {
      pair: pool.address,
      liquidityToMigrate: balance,
      percentageToMigrate: 100,
      token0: _token0?.wrapped,
      token1: _token1?.wrapped,
      fee: feeAmount,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0Min: v3Amount0Min,
      amount1Min: v3Amount1Min,
      recipient: address,
      deadline,
      refundAsETH: true,
      sqrtPrice,
      noLiquidity,
    },
    chainId: pool.chainId as V3MigrateChainId,
    enabled: approvedMigrate,
  })

  const { status } = useWaitForTransactionReceipt({
    chainId: pool.chainId as SushiSwapV3ChainId,
    hash,
  })

  useEffect(() => {
    if (status === 'success') {
      setIsOpen(false)
    }
  }, [status, setIsOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          icon={ArrowRightIcon}
          iconProps={{ className: '!w-4 !h-4' }}
          iconPosition="end"
        >
          Migrate to V3
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="border-t !max-w-full md:!max-w-[900px] border-[#EBEBEB] rounded-t-none md:rounded-t-2xl !bg-slate-50 dark:border-[#FFFFFF14] dark:!bg-slate-800 w-full  max-h-[100dvh] overflow-y-auto hide-scrollbar"
      >
        <DialogTitle className="!font-medium mt-3">
          Migrate Position
        </DialogTitle>
        <div className="flex flex-col gap-3 mt-3 w-full">
          <ManageDialogHeader hideApr={true} data={fakePosition} />
          {step === 0 ? (
            <>
              <Positions hideButtons={true} position={fakePosition} />
              <p className="font-medium">Select Fee Tier</p>
              <SelectFeeConcentratedWidget
                feeAmount={feeAmount}
                setFeeAmount={setFeeAmount}
                token1={token1}
                token0={token0}
              />
              <Button
                size="xl"
                onClick={() => setStep(1)}
                className="mt-4 w-full"
              >
                Next
              </Button>
            </>
          ) : null}
          {step === 1 ? (
            <>
              <button
                onClick={() => setStep(0)}
                type="button"
                className="flex items-center text-base font-medium w-fit text-blue dark:text-skyblue"
              >
                <ArrowLeftIcon className="mr-2 w-4 h-4" />
                Select Fee Tier
              </button>
              {poolExists ? (
                <CustomMessage message="You should only deposit liquidity into SushiSwap V3 at a price you believe is correct. If the price seems incorrect, you can either make a swap to move the price or wait for someone else to do so." />
              ) : (
                <DoesNotExistMessage type="SUSHISWAP_V3" />
              )}
              {poolExists && token0 && token1 && pool ? (
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex flex-wrap gap-2 justify-between items-center w-full">
                    <div className="flex gap-2 items-center">
                      <PriceBadge protocol={SushiSwapProtocol.SUSHISWAP_V2} />
                      <div className="text-sm font-medium">
                        {invertPrice
                          ? `${v2SpotPrice?.invert()?.toSignificant(6)} ${_token0!.symbol}`
                          : `${v2SpotPrice?.toSignificant(6)} ${_token1!.symbol}`}{' '}
                        = 1 {invertPrice ? _token1!.symbol : _token0!.symbol} (
                        {invertPrice
                          ? formatUSD(
                              priceMap?.get(_token1?.wrapped.address!) || 0,
                            )
                          : formatUSD(
                              priceMap?.get(_token0?.wrapped.address!) || 0,
                            )}
                        )
                      </div>
                    </div>
                    <TokenPriceToggle
                      token0={_token0!}
                      token1={_token1!}
                      invertPrice={invertPrice}
                      setInvertPrice={setInvertPrice}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 justify-between items-center w-full">
                    <div className="flex gap-2 items-center">
                      <PriceBadge protocol={SushiSwapProtocol.SUSHISWAP_V3} />
                      <div className="text-sm font-medium">
                        {invertPrice
                          ? `${v3SpotPrice?.invert()?.toSignificant(6)} ${_token0!.symbol}`
                          : `${v3SpotPrice?.toSignificant(6)} ${_token1!.symbol}`}{' '}
                        = 1 {invertPrice ? _token1!.symbol : _token0!.symbol} (
                        {invertPrice
                          ? formatUSD(
                              priceMap?.get(_token1?.wrapped.address!) || 0,
                            )
                          : formatUSD(
                              priceMap?.get(_token0?.wrapped.address!) || 0,
                            )}
                        )
                      </div>
                    </div>
                    <TokenPriceToggle
                      token0={_token0!}
                      token1={_token1!}
                      invertPrice={invertPrice}
                      setInvertPrice={setInvertPrice}
                    />
                  </div>
                </div>
              ) : null}

              <SelectPriceWidget
                chainId={pool.chainId as SushiSwapV3ChainId}
                token0={token0}
                token1={token1}
                poolAddress={v3Address}
                tokenId={undefined}
                feeAmount={feeAmount}
                switchTokens={() => setInvertTokens((prev) => !prev)}
              />
              <Button
                size="xl"
                onClick={() => setStep(2)}
                className="mt-4 w-full"
              >
                Next
              </Button>
            </>
          ) : null}
          {step === 2 ? (
            <>
              <Card className="!bg-slate-50 dark:!bg-slate-800">
                <CardHeader className="!p-3 justify-between items-center !flex-row flex gap-2">
                  <div>
                    <CardTitle className="mb-1">Migrated Value</CardTitle>
                    <CardDescription className="font-medium !text-lg">
                      {formatUSD(v3FiatValue0 + v3FiatValue1)}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="!p-3 !pt-0">
                  <CardGroup>
                    <CardCurrencyAmountItem
                      amount={positionAmount0}
                      fiatValue={formatUSD(v3FiatValue0)}
                      amountClassName="!font-medium"
                    />
                    <CardCurrencyAmountItem
                      amount={positionAmount1}
                      fiatValue={formatUSD(v3FiatValue1)}
                      amountClassName="!font-medium"
                    />
                  </CardGroup>
                </CardContent>
              </Card>
              <Card className="!bg-slate-50 dark:!bg-slate-800">
                <CardHeader className="!p-3 justify-between items-center !flex-row flex gap-2">
                  <div>
                    <CardTitle className="mb-1">Refund Value</CardTitle>
                    <CardDescription className="font-medium !text-lg">
                      {formatUSD(refund0FiatValue + refund1FiatValue)}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="!p-3 !pt-0">
                  <CardGroup>
                    <CardCurrencyAmountItem
                      amount={token0Value}
                      fiatValue={formatUSD(refund0FiatValue)}
                      amountClassName="!font-medium"
                    />
                    <CardCurrencyAmountItem
                      amount={token1Value}
                      fiatValue={formatUSD(refund1FiatValue)}
                      amountClassName="!font-medium"
                    />
                  </CardGroup>
                </CardContent>
              </Card>
              <Checker.Connect fullWidth size="default">
                <Checker.Network
                  fullWidth
                  size="default"
                  chainId={pool.chainId}
                >
                  <Checker.Guard
                    size="default"
                    guardWhen={!balance?.greaterThan(ZERO)}
                    guardText="Not enough balance"
                  >
                    <Checker.Guard
                      size="default"
                      guardWhen={Boolean(
                        !position ||
                          positionAmount0?.equalTo(ZERO) ||
                          positionAmount1?.equalTo(ZERO),
                      )}
                      guardText="Enter valid range"
                    >
                      <Checker.ApproveERC20
                        fullWidth
                        size="default"
                        id="approve-migrate"
                        amount={balance ?? undefined}
                        contract={
                          V3MigrateContractConfig(
                            pool.chainId as V3MigrateChainId,
                          ).address
                        }
                        enabled={Boolean(
                          V3MigrateContractConfig(
                            pool.chainId as V3MigrateChainId,
                          ).address,
                        )}
                      >
                        <Checker.Success tag={APPROVE_TAG_MIGRATE}>
                          <Button
                            fullWidth
                            size="xl"
                            loading={isLoading && !isError}
                            onClick={async () => await writeMigrate?.()}
                            disabled={isMigrateLoading || isError}
                            color={isError ? 'red' : 'blue'}
                            testId="migrate-confirm"
                          >
                            {isError ? (
                              'Shoot! Something went wrong :('
                            ) : isMigrateLoading ? (
                              <Dots>Confirm Migrate</Dots>
                            ) : (
                              'Confirm Migrate'
                            )}
                          </Button>
                        </Checker.Success>
                      </Checker.ApproveERC20>
                    </Checker.Guard>
                  </Checker.Guard>
                </Checker.Network>
              </Checker.Connect>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

const PriceBadge = ({ protocol }: { protocol: SushiSwapProtocol }) => {
  return (
    <div className="whitespace-nowrap bg-[#3B7EF61A] text-[#3B7EF6] text-xs px-2.5 py-1 w-fit font-medium rounded-full">
      {protocol === 'SUSHISWAP_V2' ? 'V2' : 'V3'} Price
    </div>
  )
}

const TokenPriceToggle = ({
  token0,
  token1,
  invertPrice,
  setInvertPrice,
}: {
  token0: Type
  token1: Type
  invertPrice: boolean
  setInvertPrice: (val: boolean) => void
}) => {
  return (
    <div className="flex gap-1">
      <Toggle
        variant="outline"
        onPressedChange={() => setInvertPrice(true)}
        pressed={invertPrice}
        size="xs"
        className="!w-full md:!w-fit"
      >
        {token0?.symbol}
      </Toggle>
      <Toggle
        variant="outline"
        onPressedChange={() => setInvertPrice(false)}
        pressed={!invertPrice}
        size="xs"
        className="!w-full md:!w-fit"
      >
        {token1?.symbol}
      </Toggle>
    </div>
  )
}
