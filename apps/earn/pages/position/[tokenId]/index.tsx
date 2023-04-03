import React, { FC, useMemo, useState } from 'react'
import { Layout } from '../../../components'
import Link from 'next/link'
import { ArrowLeftIcon, MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { ChainId } from '@sushiswap/chain'
import { SplashController } from '@sushiswap/ui/future/components/SplashController'
import {
  useConcentratedLiquidityPool,
  useConcentratedLiquidityPositionsFromTokenId,
  useConcentratedPositionInfo,
} from '@sushiswap/wagmi/future/hooks'
import { useToken } from '@sushiswap/react-query'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { classNames } from '@sushiswap/ui'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Amount, tryParseAmount } from '@sushiswap/currency'
import { usePriceInverter, useTokenAmountDollarValues } from '../../../lib/hooks'
import { getPriceOrderingFromPositionForUI, getTickToPrice, unwrapToken } from '../../../lib/functions'
import { ConcentratedLiquidityWidget } from '../../../components/ConcentratedLiquidityWidget'
import { useAccount } from '@sushiswap/wagmi'
import { ConcentratedLiquidityProvider } from '../../../components/ConcentratedLiquidityProvider'
import { Button } from '@sushiswap/ui/future/components/button'
import { RadioGroup } from '@headlessui/react'
import { ConcentratedLiquidityRemoveWidget } from '../../../components/ConcentratedLiquidityRemoveWidget'
import { JSBI } from '@sushiswap/math'
import { ConcentratedLiquidityCollectButton } from '../../../components/ConcentratedLiquidityCollectButton'
import { Bound } from '../../../lib/constants'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/future/components/settings'
import { CogIcon } from '@heroicons/react/outline'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { PoolHeader } from '../../../components/future/PoolHeader'

const PositionPage = () => {
  return (
    <SplashController>
      <ConcentratedLiquidityProvider>
        <Position />
      </ConcentratedLiquidityProvider>
    </SplashController>
  )
}

const queryParamsSchema = z.object({
  tokenId: z
    .string()
    .refine((val) => val.includes(':'), {
      message: 'TokenId not in the right format',
    })
    .transform((val) => {
      const [chainId, tokenId] = val.split(':')
      return [+chainId, +tokenId] as [ChainId, number]
    }),
})

enum SelectedTab {
  Analytics,
  DecreaseLiq,
  IncreaseLiq,
}

const Position: FC = () => {
  const { address } = useAccount()
  const { query } = useRouter()
  const [invert, setInvert] = useState(false)
  const [tab, setTab] = useState<SelectedTab>(SelectedTab.IncreaseLiq)

  const {
    tokenId: [chainId, tokenId],
  } = queryParamsSchema.parse(query)

  const { data: positionDetails } = useConcentratedLiquidityPositionsFromTokenId({
    chainId,
    tokenId,
  })

  const { data: token0, isLoading: token0Loading } = useToken({ chainId, address: positionDetails?.token0 })
  const { data: token1, isLoading: token1Loading } = useToken({ chainId, address: positionDetails?.token1 })
  const { data: pool, isLoading } = useConcentratedLiquidityPool({
    chainId,
    token0,
    token1,
    feeAmount: positionDetails?.fee,
  })

  const { data: position } = useConcentratedPositionInfo({
    chainId,
    token0,
    tokenId,
    token1,
  })

  const fiatAmounts = useMemo(() => [tryParseAmount('1', token0), tryParseAmount('1', token1)], [token0, token1])
  const fiatAmountsAsNumber = useTokenAmountDollarValues({ chainId, amounts: fiatAmounts })
  const priceOrdering = position ? getPriceOrderingFromPositionForUI(position) : undefined

  const { priceLower, priceUpper, base, quote } = usePriceInverter({
    priceLower: priceOrdering?.priceLower,
    priceUpper: priceOrdering?.priceUpper,
    base: token0,
    quote: token1,
    invert,
  })

  const pricesAtTicks = useMemo(() => {
    if (!position) return { [Bound.LOWER]: undefined, [Bound.UPPER]: undefined }
    return {
      [Bound.LOWER]: getTickToPrice(token0, token1, position.tickLower),
      [Bound.UPPER]: getTickToPrice(token0, token1, position.tickUpper),
    }
  }, [position, token0, token1])

  const { [Bound.LOWER]: lowerPrice, [Bound.UPPER]: upperPrice } = pricesAtTicks

  const invalidRange = position && Boolean(position.tickLower >= position.tickUpper)
  const price = pool && token0 ? pool.priceOf(token0) : undefined
  const outOfRange = Boolean(
    !invalidRange && price && lowerPrice && upperPrice && (price.lessThan(lowerPrice) || price.greaterThan(upperPrice))
  )

  const [minPriceDiff, maxPriceDiff] = useMemo(() => {
    if (!pool || !token0 || !token1 || !lowerPrice || !upperPrice || !base || !quote) return [0, 0]
    const min = +lowerPrice?.toFixed(10)
    const cur = +pool.priceOf(token0)?.toFixed(10)
    const max = +upperPrice?.toFixed(10)

    if (!invert) {
      return [-100 * ((max - cur) / max), -100 * ((min - cur) / min)]
    }

    return [((min - cur) / cur) * 100, ((max - cur) / cur) * 100]
  }, [base, invert, lowerPrice, pool, quote, token0, token1, upperPrice])

  const [_token0, _token1] = useMemo(
    () => [token0 ? unwrapToken(token0) : undefined, token1 ? unwrapToken(token1) : undefined],
    [token0, token1]
  )

  const amounts = useMemo(() => {
    if (positionDetails && positionDetails.fees && _token0 && _token1)
      return [
        Amount.fromRawAmount(_token0, JSBI.BigInt(positionDetails.fees[0])),
        Amount.fromRawAmount(_token1, JSBI.BigInt(positionDetails.fees[1])),
      ]

    return [undefined, undefined]
  }, [_token0, _token1, positionDetails])

  const inverted = token1 ? base?.equals(token1) : undefined
  const currencyQuote = inverted ? token1 : token0
  const currencyBase = inverted ? token0 : token1

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        {/*// TODO*/}
        <Link className="group flex gap-4 items-center mb-2" href={`/pools/${chainId}:TODO`} shallow={true}>
          <IconButton
            icon={ArrowLeftIcon}
            iconProps={{
              width: 24,
              height: 24,
              transparent: true,
            }}
          />
          <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">Go back to pool</span>
        </Link>
        <PoolHeader
          title="Position on "
          isLoading={isLoading}
          chainId={chainId}
          pool={pool}
          apy={{ rewards: 12.54, fees: 10.27 }}
          {...(priceLower && {
            priceRange: `${priceLower?.toSignificant(4)} ${quote?.symbol} ⇔ ${priceUpper?.toSignificant(4)} ${
              quote?.symbol
            }`,
          })}
        />
        <RadioGroup value={tab} onChange={setTab} className="flex flex-wrap gap-2 mt-3">
          <RadioGroup.Option
            value={SelectedTab.IncreaseLiq}
            as={Button}
            startIcon={<PlusIcon width={18} height={18} />}
            variant="outlined"
            color={tab === SelectedTab.IncreaseLiq ? 'blue' : 'default'}
          >
            Increase Liquidity
          </RadioGroup.Option>{' '}
          <RadioGroup.Option
            value={SelectedTab.DecreaseLiq}
            as={Button}
            startIcon={<MinusIcon width={18} height={18} />}
            variant="outlined"
            color={tab === SelectedTab.DecreaseLiq ? 'blue' : 'default'}
          >
            Decrease Liquidity
          </RadioGroup.Option>
          <div>
            <SettingsOverlay
              options={{
                slippageTolerance: {
                  storageKey: 'removeLiquidity',
                  defaultValue: '0.5',
                  title: 'Remove Liquidity Slippage',
                },
              }}
              modules={[SettingsModule.SlippageTolerance]}
            >
              {({ setOpen }) => (
                <Button variant="outlined" color="default" onClick={() => setOpen(true)}>
                  <CogIcon width={24} height={24} />
                </Button>
              )}
            </SettingsOverlay>
          </div>
        </RadioGroup>
      </div>
      <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-5 md:my-10 h-0.5" />
      <div className="mt-10 grid md:grid-cols-[404px_auto] gap-10">
        <div className="flex flex-col gap-6">
          <List>
            <List.Label>Deposits</List.Label>
            <List.Control>
              {position?.amount0 && _token0 ? (
                <List.KeyValue title={`${_token0.symbol}`}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Currency.Icon currency={_token0} width={18} height={18} />
                      {position.amount0.toSignificant(4)} {_token0.symbol}
                    </div>
                  </div>
                </List.KeyValue>
              ) : (
                <List.KeyValue skeleton />
              )}
              {position?.amount1 && _token1 ? (
                <List.KeyValue title={`${_token1.symbol}`}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Currency.Icon currency={_token1} width={18} height={18} />
                      {position.amount1.toSignificant(4)} {_token1.symbol}
                    </div>
                  </div>
                </List.KeyValue>
              ) : (
                <List.KeyValue skeleton />
              )}
            </List.Control>
          </List>
          <List className="!gap-1">
            <div className="flex items-center justify-between">
              <List.Label>Unclaimed fees</List.Label>
              <ConcentratedLiquidityCollectButton
                position={position ?? undefined}
                positionDetails={positionDetails}
                token0={token0}
                token1={token1}
                account={address}
                chainId={chainId}
              >
                {({ sendTransaction, isLoading }) => (
                  <Button
                    disabled={isLoading}
                    onClick={() => sendTransaction?.()}
                    size="xs"
                    variant="empty"
                    className="!h-[24px] font-bold"
                  >
                    Collect
                  </Button>
                )}
              </ConcentratedLiquidityCollectButton>
            </div>
            <List.Control>
              {amounts[0] ? (
                <List.KeyValue title={`${amounts[0].currency.symbol}`}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Currency.Icon currency={amounts[0].currency} width={18} height={18} />
                      {amounts[0].toSignificant(4)} {amounts[0].currency.symbol}
                    </div>
                  </div>
                </List.KeyValue>
              ) : (
                <List.KeyValue skeleton />
              )}
              {amounts[1] ? (
                <List.KeyValue title={`${amounts[1].currency.symbol}`}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Currency.Icon currency={amounts[1].currency} width={18} height={18} />
                      {amounts[1].toSignificant(4)} {amounts[1].currency.symbol}
                    </div>
                  </div>
                </List.KeyValue>
              ) : (
                <List.KeyValue skeleton />
              )}
            </List.Control>
          </List>
          <List className="!gap-1">
            <div className="flex items-center justify-between">
              <List.Label>Price Range</List.Label>
              {_token0 && _token1 && (
                <RadioGroup value={invert} onChange={setInvert} className="flex">
                  <RadioGroup.Option
                    value={false}
                    as={Button}
                    size="xs"
                    color={invert ? 'default' : 'blue'}
                    variant="empty"
                    className="!h-[24px] font-bold"
                  >
                    {_token0.symbol}
                  </RadioGroup.Option>
                  <RadioGroup.Option
                    value={true}
                    as={Button}
                    color={invert ? 'blue' : 'default'}
                    size="xs"
                    variant="empty"
                    className="!h-[24px] font-bold"
                  >
                    {_token1.symbol}
                  </RadioGroup.Option>
                </RadioGroup>
              )}
            </div>
            <List.Control className="flex flex-col gap-3 p-4">
              <div className="p-4 inline-flex flex-col gap-2 bg-gray-50 dark:bg-white/[0.02] rounded-xl">
                <div className="flex">
                  <div
                    className={classNames(
                      outOfRange ? 'bg-yellow/10' : 'bg-green/10',
                      'px-2 py-1 flex items-center gap-1 rounded-full'
                    )}
                  >
                    <div className={classNames(outOfRange ? 'bg-yellow' : 'bg-green', 'w-3 h-3 rounded-full')} />
                    {outOfRange ? (
                      <span className="text-xs font-medium text-yellow-900 dark:text-yellow">Out of Range</span>
                    ) : (
                      <span className="text-xs font-medium text-green">In Range</span>
                    )}
                  </div>
                </div>
                {pool && _token0 && _token1 ? (
                  <span className="px-1 text-sm text-gray-600 dark:text-slate-200">
                    <b>
                      1 {invert ? _token1.symbol : _token0.symbol} ={' '}
                      {pool[invert ? 'token1Price' : 'token0Price'].toSignificant(6)}
                    </b>{' '}
                    {invert ? _token0.symbol : _token1.symbol} (${fiatAmountsAsNumber[invert ? 1 : 0].toFixed(2)})
                  </span>
                ) : (
                  <Skeleton.Text fontSize="text-sm" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 flex flex-col gap-3 bg-gray-50 dark:bg-white/[0.02] rounded-xl">
                  <div className="flex">
                    <div className="gap-1 px-2 py-1 text-xs font-medium rounded-full bg-pink/10 text-pink">
                      Min Price
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {priceLower && pool && _token0 && _token1 ? (
                      <span className="font-medium">
                        {priceLower?.toSignificant(4)} {quote?.symbol}
                      </span>
                    ) : (
                      <Skeleton.Text />
                    )}
                    {priceLower && pool && _token0 && _token1 ? (
                      <span className="text-sm text-gray-600 dark:text-slate-400">
                        ${(fiatAmountsAsNumber[0] * (1 + minPriceDiff / 100)).toFixed(2)} ({minPriceDiff.toFixed(2)}%)
                      </span>
                    ) : (
                      <Skeleton.Text />
                    )}
                  </div>
                  {currencyBase && (
                    <span className="text-xs text-slate-500">
                      Your position will be 100% {unwrapToken(currencyBase).symbol} at this price.
                    </span>
                  )}
                </div>
                <div className="p-4 inline-flex flex-col gap-3 bg-gray-50 dark:bg-white/[0.02] rounded-xl">
                  <div className="flex">
                    <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue/10 text-blue">
                      Max Price
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {priceUpper && pool && _token1 && _token0 ? (
                      <span className="font-medium">
                        {priceUpper?.toSignificant(4)} {quote?.symbol}
                      </span>
                    ) : (
                      <Skeleton.Text />
                    )}
                    {priceUpper && pool && _token1 && _token0 ? (
                      <span className="text-sm text-gray-600 dark:text-slate-400">
                        ${(fiatAmountsAsNumber[0] * (1 + maxPriceDiff / 100)).toFixed(2)} ({maxPriceDiff.toFixed(2)}%)
                      </span>
                    ) : (
                      <Skeleton.Text />
                    )}
                  </div>
                  {currencyQuote && (
                    <span className="text-xs text-slate-500">
                      Your position will be 100% {unwrapToken(currencyQuote).symbol} at this price.
                    </span>
                  )}
                </div>
              </div>
            </List.Control>
          </List>
        </div>
        <div className="flex flex-col w-full gap-10">
          <div className={tab === SelectedTab.Analytics ? 'block' : 'hidden'}>
            <h1 className="text-5xl">Analytics Here</h1>
          </div>
          <div className={tab === SelectedTab.IncreaseLiq ? 'block' : 'hidden'}>
            <div className="flex flex-col gap-3 pt-3">
              <List.Label>Amount</List.Label>
              <ConcentratedLiquidityWidget
                chainId={chainId}
                account={address}
                token0={_token0}
                token1={_token1}
                feeAmount={positionDetails?.fee}
                tokensLoading={token0Loading || token1Loading}
                existingPosition={position ?? undefined}
                tokenId={tokenId}
              />
            </div>
          </div>
          <div className={classNames('pt-3', tab === SelectedTab.DecreaseLiq ? 'block' : 'hidden')}>
            <ConcentratedLiquidityRemoveWidget
              token0={_token0}
              token1={_token1}
              account={address}
              chainId={chainId}
              position={position ?? undefined}
              positionDetails={positionDetails}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PositionPage
