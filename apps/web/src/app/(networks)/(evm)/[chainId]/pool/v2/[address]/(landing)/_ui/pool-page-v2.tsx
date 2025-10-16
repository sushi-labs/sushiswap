'use client'
import { PlusIcon } from '@heroicons/react-v1/solid'
// import { UnknownTokenAlert } from './UnknownTokenAlert'
import type { RawV2Pool, V2Pool } from '@sushiswap/graph-client/data-api'
import { Button, Container, useBreakpoint } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import {
  EvmToken,
  SushiSwapProtocol,
  getEvmChainById,
  unwrapEvmToken,
} from 'sushi/evm'
import { APRChart } from '~evm/[chainId]/_ui/APRChart'
import { ManagePositionButton } from '~evm/[chainId]/_ui/ManagePositionButton'
import { Pool24HVolume } from '~evm/[chainId]/_ui/Pool24HVolume'
import { PoolAPR } from '~evm/[chainId]/_ui/PoolAPR'
import { PoolPrice } from '~evm/[chainId]/_ui/PoolPrice'
import { AddLiquidityDialog } from '~evm/[chainId]/_ui/add-liquidity/add-liquidity-dialog'
import { PoolChartV2 } from './pool-chart-v2'
import { PoolComposition } from './pool-composition'
import { PoolRewards } from './pool-rewards'
import { PoolTransactionsV2 } from './pool-transactions-v2'

interface PoolPageV2 {
  pool: RawV2Pool
}

export const PoolPageV2: FC<PoolPageV2> = ({ pool }) => {
  const [token0, token1] = useMemo(() => {
    if (!pool) return [undefined, undefined]

    return [
      unwrapEvmToken(
        new EvmToken({
          chainId: pool.token0.chainId,
          address: pool.token0.address,
          decimals: pool.token0.decimals,
          symbol: pool.token0.symbol,
          name: pool.token0.name,
        }),
      ),
      unwrapEvmToken(
        new EvmToken({
          chainId: pool.token1.chainId,
          address: pool.token1.address,
          decimals: pool.token1.decimals,
          symbol: pool.token1.symbol,
          name: pool.token1.name,
        }),
      ),
    ]
  }, [pool])
  const { isMd } = useBreakpoint('md')

  return (
    <Container
      maxWidth="screen-3xl"
      className="flex flex-col gap-4 px-4 lg:gap-6"
    >
      {/* <UnknownTokenAlert pool={pool} /> */}
      <div className="flex flex-col-reverse gap-4 w-full lg:gap-10 lg:flex-row">
        <div className="flex-[2_2_0%] min-[1230px]:flex-[3_3_0%] min-w-0 flex flex-col gap-4 lg:gap-6">
          <APRChart pool={pool} />
          <PoolChartV2 pool={pool} />
        </div>
        <div className="flex-[1_1_0%] min-[1230px]:flex-[1_1_0%] min-w-0 flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            {isMd ? (
              <AddLiquidityDialog
                poolType={SushiSwapProtocol.SUSHISWAP_V2}
                hidePoolTypeToggle={true}
                hideTokenSelectors={true}
                token0={token0}
                token1={token1}
                trigger={
                  <Button size="lg" className="w-full h-[52px]">
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Liquidity</span>
                  </Button>
                }
                chainId={pool.chainId}
              />
            ) : null}
            <ManagePositionButton
              href={`/${getEvmChainById(pool.chainId).key}/pool/v2/${pool.address}/add`}
            />
          </div>
          <PoolAPR version="v2" pool={pool} />
          <PoolComposition pool={pool} />
          <Pool24HVolume pool={pool} />
          <PoolPrice pool={pool} showRate />
          {pool.isIncentivized ? <PoolRewards pool={pool} /> : null}
        </div>
      </div>

      <div className="flex gap-6 lg:gap-10 lg:flex-row">
        <div className="flex-[2_2_0%] min-[1230px]:flex-[3_3_0%] min-w-0">
          <PoolTransactionsV2 pool={pool} poolAddress={pool.address} />
        </div>
        <div className="flex-[1_1_0%] min-[1230px]:flex-[1_1_0%] min-w-0 lg:block hidden" />
      </div>
    </Container>
  )
}
