'use client'
import { Button, Container, useBreakpoint } from '@sushiswap/ui'
import { PoolTransactionsV2 } from 'src/ui/pool/PoolTransactionsV2'

import { PlusIcon } from '@heroicons/react-v1/solid'
import type { V2Pool } from '@sushiswap/graph-client/data-api'
import { type FC, useMemo } from 'react'
import { ChainKey, SushiSwapProtocol, address } from 'sushi'
import { Native, Token, unwrapToken } from 'sushi/currency'
import { APRChart } from './APRChart'
import { ManagePositionButton } from './ManagePositionButton'
import { Pool24HVolume } from './Pool24HVolume'
import { PoolAPR } from './PoolAPR'
import { PoolChartV2 } from './PoolChartV2'
import { PoolComposition } from './PoolComposition'
import { PoolPrice } from './PoolPrice'
import { PoolRewards } from './PoolRewards'
import { AddLiquidityDialog } from './add-liquidity/add-liquidity-dialog'
// import { UnknownTokenAlert } from './UnknownTokenAlert'

interface PoolPageV2 {
  pool: Awaited<V2Pool>
}

export const PoolPageV2: FC<PoolPageV2> = ({ pool }) => {
  const [token0, token1] = useMemo(() => {
    if (!pool) return [undefined, undefined]

    return [
      unwrapToken(
        new Token({
          chainId: pool.token0.chainId,
          address: pool.token0.address,
          decimals: pool.token0.decimals,
          symbol: pool.token0.symbol,
          name: pool.token0.name,
        }),
      ),
      unwrapToken(
        new Token({
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
    <Container maxWidth="screen-3xl" className="flex flex-col gap-4 px-4">
      {/* <UnknownTokenAlert pool={pool} /> */}
      <div className="flex flex-col-reverse gap-6 w-full lg:flex-row">
        <div className="flex-[2_2_0%] min-[1230px]:flex-[3_3_0%] min-w-0 flex flex-col gap-6">
          <APRChart />
          <PoolChartV2 pool={pool} />
        </div>
        <div className="flex-[1_1_0%] min-[1230px]:flex-[1_1_0%] min-w-0 flex flex-col gap-6">
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
              />
            ) : null}
            <ManagePositionButton
              href={`/${ChainKey[pool.chainId]}/pool/v2/${pool.address}/add`}
            />
          </div>
          <PoolAPR />
          <PoolComposition pool={pool} />
          <Pool24HVolume pool={pool} />
          <PoolPrice pool={pool} />
          {pool.isIncentivized ? <PoolRewards pool={pool} /> : null}
        </div>
      </div>

      <PoolTransactionsV2 pool={pool} poolAddress={pool.address} />
    </Container>
  )
}
