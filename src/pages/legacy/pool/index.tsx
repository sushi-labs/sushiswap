import { PlusIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Loader from 'app/components/Loader'
import FullPositionCard from 'app/components/PositionCard'
import Typography from 'app/components/Typography'
import Web3Connect from 'app/components/Web3Connect'
import { useV2PairsWithLiquidity } from 'app/features/trident/migrate/context/useV2PairsWithLiquidity'
import { SwapLayout, SwapLayoutCard } from 'app/layouts/SwapLayout'
import { useActiveWeb3React } from 'app/services/web3'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import React from 'react'

const Pool = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { loading, pairs } = useV2PairsWithLiquidity()

  return (
    <>
      <NextSeo title="Pool" />
      <div className="flex items-center justify-between">
        <Typography variant="lg" className="py-6">
          Position Overview
        </Typography>
        <Link href="/add" passHref={true}>
          <Button size="sm" startIcon={<PlusIcon width={14} height={14} />}>
            New Position
          </Button>
        </Link>
      </div>
      <SwapLayoutCard className="!bg-dark-900 border border-dark-800 !p-0 overflow-hidden">
        {!account ? (
          <Web3Connect className="w-full !bg-dark-900 bg-gradient-to-r from-pink/80 hover:from-pink to-purple/80 hover:to-purple text-white h-[38px]" />
        ) : (
          <div className="px-2 space-y-4 rounded bg-dark-900">
            <div className="grid grid-flow-row divide-y divide-dark-800">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader />
                </div>
              ) : pairs?.length > 0 ? (
                pairs.map((v2Pair) => (
                  <FullPositionCard
                    key={v2Pair.liquidityToken.address}
                    pair={v2Pair}
                    stakedBalance={CurrencyAmount.fromRawAmount(v2Pair.liquidityToken, '0')}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center h-40">
                  <Typography variant="xs">{i18n._(t`No positions found`)}</Typography>
                </div>
              )}
            </div>
          </div>
        )}
      </SwapLayoutCard>
      <Typography variant="xs" className="px-10 mt-5 text-center text-low-emphesis">
        {i18n._(t`Liquidity providers earn a 0.25% fee on all trades proportional to their share of
                        the pool. Fees are added to the pool, accrue in real time and can be claimed by
                        withdrawing your liquidity`)}
      </Typography>
    </>
  )
}

Pool.Layout = SwapLayout('pool-page')

export default Pool
