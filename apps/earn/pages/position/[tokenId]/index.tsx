import React, { FC, useMemo, useState } from 'react'
import { Layout } from '../../../components'
import Link from 'next/link'
import { ArrowLeftIcon, MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { SplashController } from '@sushiswap/ui/future/components/SplashController'
import {
  useConcentratedLiquidityPositionsFromTokenId,
  useConcentratedPositionInfo,
  useConcentratedPositionOwner,
  useTokenWithCache,
} from '@sushiswap/wagmi/future/hooks'
import { useConcentratedLiquidityPoolStats } from '@sushiswap/react-query'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { classNames } from '@sushiswap/ui'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Amount } from '@sushiswap/currency'
import { usePriceInverter } from '../../../lib/hooks'
import { formatTickPrice, getPriceOrderingFromPositionForUI, unwrapToken } from '../../../lib/functions'
import { ConcentratedLiquidityWidget } from '../../../components/ConcentratedLiquidityWidget'
import { useAccount } from '@sushiswap/wagmi'
import {
  ConcentratedLiquidityProvider,
  useConcentratedDerivedMintInfo,
} from '../../../components/ConcentratedLiquidityProvider'
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
import { isSushiSwapV3ChainId, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import useIsTickAtLimit from '../../../lib/hooks/useIsTickAtLimit'
import { useAngleRewards } from '@sushiswap/react-query'
import { ConcentratedLiquidityHarvestButton } from '../../../components/ConcentratedLiquidityHarvestButton'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { ChainId } from '@sushiswap/chain'
import { Explainer } from '@sushiswap/ui/future/components/Explainer'

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
      return [+chainId, +tokenId] as [SushiSwapV3ChainId, number]
    })
    .refine(([chainId]) => isSushiSwapV3ChainId(chainId), {
      message: 'ChainId not supported.',
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

  const { data: token0, isLoading: token0Loading } = useTokenWithCache({ chainId, address: positionDetails?.token0 })
  const { data: token1, isLoading: token1Loading } = useTokenWithCache({ chainId, address: positionDetails?.token1 })

  const { data: position } = useConcentratedPositionInfo({
    chainId,
    token0,
    tokenId,
    token1,
  })

  const pricesFromPosition = position ? getPriceOrderingFromPositionForUI(position) : undefined

  const { pool, isLoading, outOfRange } = useConcentratedDerivedMintInfo({
    chainId,
    account: address,
    token0,
    token1,
    baseToken: token0,
    feeAmount: positionDetails?.fee,
    existingPosition: position ?? undefined,
  })

  const { data: poolStats } = useConcentratedLiquidityPoolStats({
    chainId: positionDetails?.chainId,
    address: positionDetails?.address,
  })

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

  const { priceLower, priceUpper, base } = usePriceInverter({
    priceLower: pricesFromPosition?.priceLower,
    priceUpper: pricesFromPosition?.priceUpper,
    quote: pricesFromPosition?.quote,
    base: pricesFromPosition?.base,
    invert,
  })

  const tickAtLimit = useIsTickAtLimit(positionDetails?.fee, position?.tickLower, position?.tickUpper)

  const inverted = token1 ? base?.equals(token1) : undefined
  const currencyQuote = inverted ? token0 : token1
  const currencyBase = inverted ? token1 : token0
  const below = pool && position && true ? pool.tickCurrent < position.tickLower : undefined
  const above = pool && position && true ? pool.tickCurrent >= position.tickUpper : undefined
  const inRange = typeof below === 'boolean' && typeof above === 'boolean' ? !below && !above : false
  const fullRange = Boolean(tickAtLimit[Bound.LOWER] && tickAtLimit[Bound.UPPER])

  const { data: owner } = useConcentratedPositionOwner({ chainId, tokenId })
  const { data: rewardsData, isLoading: rewardsLoading } = useAngleRewards({
    chainId,
    account: owner,
  })

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <Link
          className="flex items-center gap-4 mb-2 group"
          href={`/${chainId}:${positionDetails?.address}`}
          shallow={true}
        >
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
          apy={{ rewards: poolStats?.incentiveApr, fees: poolStats?.feeApr1d }}
          {...(priceLower && {
            priceRange: fullRange
              ? 'Full range (0 ⇔ ∞)'
              : `${formatTickPrice({ price: priceLower, atLimit: tickAtLimit, direction: Bound.UPPER })} ${
                  currencyQuote?.symbol
                } ⇔ ${formatTickPrice({ price: priceUpper, atLimit: tickAtLimit, direction: Bound.UPPER })} ${
                  currencyQuote?.symbol
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
            testdata-id="decrease-liquidity-button"
          >
            Decrease Liquidity
          </RadioGroup.Option>
          <div>
            <SettingsOverlay
              options={{
                slippageTolerance: {
                  storageKey: tab === SelectedTab.DecreaseLiq ? 'removeLiquidity' : 'addLiquidity',
                  defaultValue: '0.5',
                  title: tab === SelectedTab.DecreaseLiq ? 'Remove Liquidity Slippage' : 'Add Liquidity Slippage',
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
                <List.KeyValue flex title={`${_token0.symbol}`}>
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
                <List.KeyValue flex title={`${_token1.symbol}`}>
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
          {chainId === ChainId.POLYGON && (
            <List className="!gap-1">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <List.Label className="flex gap-1">
                    Unclaimed rewards{' '}
                    <Explainer hover iconSize={16} placement="bottom" width={320}>
                      <List className="!pt-0 ">
                        <List.Label>Accumulated rewards since inception</List.Label>
                        <List.Control>
                          {rewardsLoading ? (
                            <List.KeyValue skeleton />
                          ) : rewardsData &&
                            positionDetails &&
                            rewardsData.pools[positionDetails.address]?.rewardsPerToken ? (
                            Object.values(rewardsData.pools[positionDetails.address].rewardsPerToken).map((el, i) => (
                              <List.KeyValue key={i} flex title={`${el.accumulatedSinceInception.currency.symbol}`}>
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2">
                                    <Currency.Icon currency={el.unclaimed.currency} width={18} height={18} />
                                    {el.accumulatedSinceInception.toSignificant(4)} {el.unclaimed.currency.symbol}
                                  </div>
                                </div>
                              </List.KeyValue>
                            ))
                          ) : (
                            <List.KeyValue
                              flex
                              title={
                                <span className="text-xs italic font-normal text-center text-gray-500 dark:text-slate-400">
                                  No rewards found
                                </span>
                              }
                            >
                              {' '}
                            </List.KeyValue>
                          )}
                        </List.Control>
                      </List>
                    </Explainer>
                  </List.Label>
                </div>
                <ConcentratedLiquidityHarvestButton account={address} chainId={chainId}>
                  {({ write, isLoading }) => (
                    <Checker.Connect size="xs" variant="empty" className="!h-[24px] font-bold">
                      <Checker.Network size="xs" variant="empty" className="!h-[24px] font-bold" chainId={chainId}>
                        <Button
                          disabled={isLoading}
                          onClick={() => write?.()}
                          size="xs"
                          variant="empty"
                          className="!h-[24px] font-bold"
                        >
                          Harvest
                        </Button>
                      </Checker.Network>
                    </Checker.Connect>
                  )}
                </ConcentratedLiquidityHarvestButton>
              </div>
              <List.Control>
                {rewardsLoading ? (
                  <List.KeyValue skeleton />
                ) : rewardsData && positionDetails && rewardsData.pools[positionDetails.address]?.rewardsPerToken ? (
                  Object.values(rewardsData.pools[positionDetails.address].rewardsPerToken).map((el, i) => (
                    <List.KeyValue key={i} flex title={`${el.unclaimed.currency.symbol}`}>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Currency.Icon currency={el.unclaimed.currency} width={18} height={18} />
                          {el.unclaimed.toSignificant(4)} {el.unclaimed.currency.symbol}
                        </div>
                      </div>
                    </List.KeyValue>
                  ))
                ) : (
                  <List.KeyValue
                    flex
                    title={
                      <span className="text-xs italic font-normal text-center text-gray-500 dark:text-slate-400">
                        No rewards found
                      </span>
                    }
                  >
                    {' '}
                  </List.KeyValue>
                )}
              </List.Control>
              <List.Label className="pt-1.5 font-normal text-gray-500 dark:text-slate-400">
                Harvest all available pool rewards on the current network.
              </List.Label>
            </List>
          )}
          <List className="!gap-1">
            <div className="flex items-center justify-between">
              <List.Label className="whitespace-nowrap">Unclaimed fees</List.Label>
              <ConcentratedLiquidityCollectButton
                position={position ?? undefined}
                positionDetails={positionDetails}
                token0={token0}
                token1={token1}
                account={address}
                chainId={chainId}
              >
                {({ sendTransaction, isLoading }) => (
                  <Checker.Connect size="xs" variant="empty" className="!h-[24px] font-bold">
                    <Checker.Network size="xs" variant="empty" className="!h-[24px] font-bold" chainId={chainId}>
                      <Button
                        disabled={isLoading}
                        onClick={() => sendTransaction?.()}
                        size="xs"
                        variant="empty"
                        className="!h-[24px] font-bold"
                      >
                        Collect
                      </Button>
                    </Checker.Network>
                  </Checker.Connect>
                )}
              </ConcentratedLiquidityCollectButton>
            </div>
            <List.Control>
              {amounts[0] ? (
                <List.KeyValue flex title={`${amounts[0].currency.symbol}`}>
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
                <List.KeyValue flex title={`${amounts[1].currency.symbol}`}>
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
                      !inRange ? 'bg-yellow/10' : 'bg-green/10',
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
                {pool && currencyBase && currencyQuote ? (
                  <span className="px-1 text-sm text-gray-600 dark:text-slate-200">
                    Current:{' '}
                    <b>
                      1 {unwrapToken(currencyBase)?.symbol} ={' '}
                      {(inverted ? pool?.token1Price : pool?.token0Price)?.toSignificant(6)}{' '}
                      {unwrapToken(currencyQuote)?.symbol}
                    </b>
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
                    {pool && currencyBase && currencyQuote ? (
                      <span className="font-medium">
                        {fullRange
                          ? '0'
                          : formatTickPrice({ price: priceLower, atLimit: tickAtLimit, direction: Bound.UPPER })}{' '}
                        {unwrapToken(currencyQuote)?.symbol}
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
                    {priceUpper && pool && currencyQuote && currencyBase ? (
                      <span className="font-medium">
                        {fullRange
                          ? '∞'
                          : formatTickPrice({ price: priceUpper, atLimit: tickAtLimit, direction: Bound.UPPER })}{' '}
                        {unwrapToken(currencyQuote).symbol}
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
