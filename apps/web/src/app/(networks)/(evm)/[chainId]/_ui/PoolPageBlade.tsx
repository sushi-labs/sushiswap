'use client'
import { PlusIcon } from '@heroicons/react-v1/solid'
import type { V2Pool } from '@sushiswap/graph-client/data-api'
import { Button, Container, useBreakpoint } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { EvmToken, SushiSwapProtocol, unwrapEvmToken } from 'sushi/evm'
import { PoolChartV2 } from '../pool/v2/[address]/(landing)/_ui/pool-chart-v2'
import { PoolRewards } from '../pool/v2/[address]/(landing)/_ui/pool-rewards'
import { PoolTransactionsV2 } from '../pool/v2/[address]/(landing)/_ui/pool-transactions-v2'
import { Pool24HVolume } from './Pool24HVolume'
import { PoolAPR } from './PoolAPR'
import { PoolCompositionBlade } from './PoolCompositionBlade'
import { PoolPrice } from './PoolPrice'
import { PoolsBladeSection } from './PoolsBladeSection'
import { AddLiquidityDialog } from './add-liquidity/add-liquidity-dialog'

interface PoolPageBlade {
  pool: Awaited<V2Pool>
}

export const PoolPageBlade: FC<PoolPageBlade> = ({ pool }) => {
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
          <PoolsBladeSection />
          <PoolChartV2 pool={pool} />
        </div>
        <div className="flex-[1_1_0%] min-[1230px]:flex-[1_1_0%] min-w-0 flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            {isMd ? (
              <AddLiquidityDialog
                poolType={SushiSwapProtocol.BLADE}
                hidePoolTypeToggle={true}
                hideTokenSelectors={false}
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
            {/* <ManagePositionButton
              href={`/${ChainKey[pool.chainId]}/pool/v2/${pool.address}/add`}
            /> */}
          </div>
          <PoolAPR version="v2" pool={pool} />
          <PoolCompositionBlade pool={pool} />
          <Pool24HVolume pool={pool} />
          <PoolPrice pool={pool} />
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
