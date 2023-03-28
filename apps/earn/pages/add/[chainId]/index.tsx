import { ArrowLeftIcon, LockClosedIcon, PlusIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { BreadcrumbLink, Button, classNames } from '@sushiswap/ui'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { Layout, SelectNetworkWidget, SelectPricesWidget, SelectTokensWidget } from '../../../components'
import React, { FC, Fragment, useCallback, useMemo } from 'react'
import { SWRConfig } from 'swr'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ContentBlock } from '../../../components/AddPage/ContentBlock'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import Link from 'next/link'
import {
  ConcentratedLiquidityProvider,
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
} from '../../../components/ConcentratedLiquidityProvider'
import { Bound, Field } from '../../../lib/constants'
import {
  ConcentratedLiquidityURLStateProvider,
  useConcentratedLiquidityURLState,
} from '../../../components/ConcentratedLiquidityURLStateProvider'
import { useConcentratedDerivedMintInfo } from '../../../lib/hooks/useConcentratedDerivedMintInfo'
import { SelectFeeConcentratedWidget } from '../../../components/NewPositionSection/SelectFeeConcentratedWidget'
import { Transition } from '@headlessui/react'
import { AddSectionReviewModalConcentrated } from '../../../components/AddPage/AddSectionReviewModalConcentrated'

const LINKS: BreadcrumbLink[] = [
  {
    href: `/add`,
    label: `Add`,
  },
]

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const chainId = params?.chainId ? (parseInt(params.chainId as string) as ChainId) : ChainId.ETHEREUM
  return {
    props: {
      chainId,
    },
  }
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export const getStaticPaths: GetStaticPaths = async () => {
  // Get the paths we want to pre-render based on supported chain ids
  // TODO SUPPORTED_CHAIN_IDS
  const paths = [ChainId.ARBITRUM].map((chainId) => ({
    params: {
      chainId: chainId.toString(),
    },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: false }
}

export function Add() {
  return (
    <SWRConfig>
      <Layout breadcrumbs={LINKS}>
        <div className="flex flex-col gap-3">
          <Link href="/">
            <ArrowLeftIcon width={24} className="text-slate-50" />
          </Link>
          <h1 className="text-3xl font-medium mt-2">Add Liquidity</h1>
          <h1 className="text-lg text-slate-400">Create a new liquidity position</h1>
        </div>
        <div className="h-0.5 w-full bg-slate-200/5 my-10" />
        <div className="flex justify-center">
          <div className="sm:w-[340px] md:w-[572px] gap-10">
            <ConcentratedLiquidityURLStateProvider>
              <ConcentratedLiquidityProvider>
                <_Add />
              </ConcentratedLiquidityProvider>
            </ConcentratedLiquidityURLStateProvider>
          </div>
        </div>
      </Layout>
    </SWRConfig>
  )
}

const _Add: FC = () => {
  const { chainId, token0, token1, setToken1, setToken0, setNetwork, tokensLoading } =
    useConcentratedLiquidityURLState()

  const {
    noLiquidity,
    dependentField,
    parsedAmounts,
    outOfRange,
    invalidRange,
    price,
    invertPrice,
    pricesAtTicks,
    ticks,
    ticksAtLimit,
    pool,
    depositADisabled,
    depositBDisabled,
    invalidPool,
    position,
  } = useConcentratedDerivedMintInfo({
    existingPosition: undefined,
  })

  const { independentField, typedValue } = useConcentratedMintState()
  const { onFieldAInput, onFieldBInput } = useConcentratedMintActionHandlers()

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const _onFieldAInput = useCallback((val: string) => onFieldAInput(val, noLiquidity), [noLiquidity, onFieldAInput])
  const _onFieldBInput = useCallback((val: string) => onFieldBInput(val, noLiquidity), [noLiquidity, onFieldBInput])
  const amounts = useMemo(() => [parsedAmounts[Field.CURRENCY_A], parsedAmounts[Field.CURRENCY_B]], [parsedAmounts])
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks

  return (
    <div className="flex flex-col order-3 gap-[64px] pb-40 sm:order-2">
      <SelectNetworkWidget selectedNetwork={chainId} onSelect={setNetwork} />
      <SelectTokensWidget
        chainId={chainId}
        token0={token0}
        token1={token1}
        setToken0={setToken0}
        setToken1={setToken1}
      />
      <SelectFeeConcentratedWidget />
      <SelectPricesWidget
        price={price}
        invertPrice={invertPrice}
        pricesAtTicks={pricesAtTicks}
        ticks={ticks}
        ticksAtLimit={ticksAtLimit}
        pool={pool}
      />

      <ContentBlock
        title={
          <>
            How much <span className="text-gray-900 dark:text-white">liquidity</span> do you want to provide?
          </>
        }
      >
        <div className={classNames('flex flex-col gap-4')}>
          {outOfRange && (
            <div className="bg-yellow/10 text-yellow rounded-xl p-6 font-medium">
              Your position will not earn fees or be used in trades until the market price moves into your range.
            </div>
          )}

          {invalidRange && (
            <div className="bg-yellow/10 text-yellow rounded-xl p-6 font-medium">
              Invalid range selected. The minimum price must be lower than the maximum price.
            </div>
          )}

          <div
            className={classNames(
              tickLower === undefined || tickUpper === undefined || invalidPool || invalidRange
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
                <div className="bg-slate-800 absolute inset-0 z-[1] rounded-xl flex items-center justify-center">
                  <div className="flex-col gap-2 absolute inset-0 flex items-center justify-center text-center text-sm font-medium px-10">
                    <LockClosedIcon width={24} height={24} className="text-slate-400" />
                    <span className="text-slate-400">
                      The market price is outside your specified price range. Single-asset deposit only.{' '}
                      <a
                        // TODO
                        href="https://sushi.com/academy"
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
                type="INPUT"
                className="p-3 dark:bg-slate-800 bg-white rounded-xl"
                chainId={chainId}
                value={formattedAmounts[Field.CURRENCY_A]}
                onChange={_onFieldAInput}
                onSelect={setToken0}
                currency={token0}
                disabled={depositADisabled}
                loading={tokensLoading}
              />
            </div>
            <div className="left-0 right-0 mt-[-24px] mb-[-24px] flex items-center justify-center">
              <button type="button" className="p-2 bg-gray-100 dark:bg-slate-900 rounded-full z-10">
                <PlusIcon strokeWidth={3} className="w-4 h-4 text-gray-500 dark:text-slate-400" />
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
                <div className="bg-slate-800 absolute inset-0 z-[1] rounded-xl flex items-center justify-center">
                  <div className="flex-col gap-2 absolute inset-0 flex items-center justify-center text-center text-sm font-medium px-10">
                    <LockClosedIcon width={24} height={24} className="text-slate-400" />
                    <span className="text-slate-400">
                      The market price is outside your specified price range. Single-asset deposit only.{' '}
                      <a
                        // TODO
                        href="https://sushi.com/academy"
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
                type="INPUT"
                className="p-3 dark:bg-slate-800 bg-white rounded-xl"
                chainId={chainId}
                value={formattedAmounts[Field.CURRENCY_B]}
                onChange={_onFieldBInput}
                onSelect={setToken1}
                currency={token1}
                loading={tokensLoading}
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
                    amount={amounts[0]}
                    contract="0xC36442b4a4522E871399CD717aBDD847Ab11FE88"
                  >
                    <Checker.ApproveERC20
                      size="xl"
                      fullWidth
                      id="approve-erc20-1"
                      amount={amounts[1]}
                      contract="0xC36442b4a4522E871399CD717aBDD847Ab11FE88"
                    >
                      <AddSectionReviewModalConcentrated
                        input0={amounts[0]}
                        input1={amounts[1]}
                        position={position}
                        noLiquidity={noLiquidity}
                        price={price}
                        pricesAtTicks={pricesAtTicks}
                      >
                        {({ setOpen }) => (
                          <Button fullWidth onClick={() => setOpen(true)} size="md">
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
      </ContentBlock>
    </div>
  )
}

export default Add
