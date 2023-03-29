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
  useConcentratedDerivedMintInfo,
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
} from '../../../components/ConcentratedLiquidityProvider'
import { Bound, Field } from '../../../lib/constants'
import {
  ConcentratedLiquidityURLStateProvider,
  useConcentratedLiquidityURLState,
} from '../../../components/ConcentratedLiquidityURLStateProvider'
import { SelectFeeConcentratedWidget } from '../../../components/NewPositionSection/SelectFeeConcentratedWidget'
import { Transition } from '@headlessui/react'
import { AddSectionReviewModalConcentrated } from '../../../components/AddPage/AddSectionReviewModalConcentrated'
import { ConcentratedLiquidityWidget } from '../../../components/ConcentratedLiquidityWidget'
import { useAccount } from 'wagmi'
import {
  useConcentratedLiquidityPositionsFromTokenId,
  useConcentratedPositionInfo,
} from '@sushiswap/wagmi/future/hooks'
import { BigNumber } from '@ethersproject/bignumber'

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
  const { address } = useAccount()
  const { chainId, token0, token1, setToken1, setToken0, setNetwork, feeAmount, tokensLoading, tokenId } =
    useConcentratedLiquidityURLState()

  const { data: position } = useConcentratedPositionInfo({
    chainId,
    token0,
    tokenId,
    token1,
  })

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
      <SelectPricesWidget />

      <ContentBlock
        title={
          <>
            How much <span className="text-gray-900 dark:text-white">liquidity</span> do you want to provide?
          </>
        }
      >
        <ConcentratedLiquidityWidget
          chainId={chainId}
          account={address}
          token0={token0}
          token1={token1}
          setToken0={setToken0}
          setToken1={setToken1}
          feeAmount={feeAmount}
          tokensLoading={tokensLoading}
          existingPosition={position}
          tokenId={tokenId}
        />
      </ContentBlock>
    </div>
  )
}

export default Add
