import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { FundSource } from '@sushiswap/hooks'
import { BreadcrumbLink } from '@sushiswap/ui'
import { Checker } from '@sushiswap/wagmi'
import {
  Layout,
  SelectFeeWidget,
  SelectNetworkWidget,
  SelectPricesWidget,
  SelectTokensWidget,
} from '../../../components'
import React, { FC, useCallback, useMemo } from 'react'
import { SWRConfig } from 'swr'
import { SUPPORTED_CHAIN_IDS } from '../../../config'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ContentBlock } from '../../../components/AddPage/ContentBlock'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import Link from 'next/link'
import {
  ConcentratedLiquidityProvider,
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
} from '../../../components/ConcentratedLiquidityProvider'
import { Field } from '../../../lib/constants'
import {
  ConcentratedLiquidityURLStateProvider,
  useConcentratedLiquidityURLState,
} from '../../../components/ConcentratedLiquidityURLStateProvider'
import { useConcentratedDerivedMintInfo } from '../../../lib/hooks/useConcentratedDerivedMintInfo'

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
  const paths = SUPPORTED_CHAIN_IDS.map((chainId) => ({
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
          <div className="h-0.5 w-full bg-slate-200/5" />
        </div>
        <div className="grid grid-cols-1 sm:w-[340px] md:w-[572px] gap-10">
          <ConcentratedLiquidityURLStateProvider>
            <ConcentratedLiquidityProvider>
              <_Add />
            </ConcentratedLiquidityProvider>
          </ConcentratedLiquidityURLStateProvider>
        </div>
      </Layout>
    </SWRConfig>
  )
}

const _Add: FC = () => {
  const { chainId, token0, token1, setToken1, setToken0, setNetwork, tokensLoading, feeAmount, setFeeAmount } =
    useConcentratedLiquidityURLState()

  const { noLiquidity, dependentField, parsedAmounts } = useConcentratedDerivedMintInfo(
    token0,
    token1,
    feeAmount,
    token0,
    false
  )
  const { independentField, typedValue } = useConcentratedMintState()
  const { onFieldAInput, onFieldBInput } = useConcentratedMintActionHandlers()

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const _onFieldAInput = useCallback((val: string) => onFieldAInput(val, noLiquidity), [noLiquidity, onFieldAInput])
  const _onFieldBInput = useCallback((val: string) => onFieldBInput(val, noLiquidity), [noLiquidity, onFieldBInput])
  const amounts = useMemo(() => [parsedAmounts[Field.CURRENCY_A], parsedAmounts[Field.CURRENCY_B]], [parsedAmounts])

  return (
    <ConcentratedLiquidityProvider>
      <div className="flex flex-col order-3 gap-[64px] pb-40 sm:order-2">
        <SelectNetworkWidget selectedNetwork={chainId} onSelect={setNetwork} />
        <SelectTokensWidget
          chainId={chainId}
          token0={token0}
          token1={token1}
          setToken0={setToken0}
          setToken1={setToken1}
        />
        <SelectFeeWidget fee={feeAmount} setFee={setFeeAmount} />
        <SelectPricesWidget token0={token0} token1={token1} feeAmount={feeAmount} />

        <ContentBlock title={<span className="text-gray-900 dark:text-white">Deposit.</span>}>
          <div className="flex flex-col gap-4">
            <Web3Input.Currency
              type="INPUT"
              className="p-3 dark:bg-slate-800 bg-white rounded-xl"
              chainId={chainId}
              value={formattedAmounts[Field.CURRENCY_A]}
              onChange={_onFieldAInput}
              onSelect={setToken0}
              currency={token0}
              disabled={!token0}
              loading={tokensLoading}
            />
            <div className="left-0 right-0 mt-[-24px] mb-[-24px] flex items-center justify-center">
              <button type="button" className="p-2 bg-gray-100 dark:bg-slate-900 rounded-full z-10">
                <PlusIcon strokeWidth={3} className="w-4 h-4 text-gray-500 dark:text-slate-400" />
              </button>
            </div>
            <Web3Input.Currency
              type="INPUT"
              className="p-3 dark:bg-slate-800 bg-white rounded-xl"
              chainId={chainId}
              value={formattedAmounts[Field.CURRENCY_B]}
              onChange={_onFieldBInput}
              onSelect={setToken1}
              currency={token1}
              loading={tokensLoading}
            />
            <Checker.Connected fullWidth size="md">
              <Checker.Network fullWidth size="md" chainId={chainId}>
                <Checker.Amounts fullWidth size="md" chainId={chainId} fundSource={FundSource.WALLET} amounts={amounts}>
                  <button>test</button>
                </Checker.Amounts>
              </Checker.Network>
            </Checker.Connected>
          </div>
        </ContentBlock>
      </div>
    </ConcentratedLiquidityProvider>
  )
}

export default Add
