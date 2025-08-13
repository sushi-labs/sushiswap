'use client'
import { PlusIcon } from '@heroicons/react-v1/solid'
import type { BladePool } from '@sushiswap/graph-client/data-api'
import { Button, Container, useBreakpoint } from '@sushiswap/ui'
import { type FC, useState } from 'react'
import { APRChart } from './APRChart'
import { BladePoolPrice } from './BladePoolPrice'
import { Pool24HVolume } from './Pool24HVolume'
import { PoolCompositionBlade } from './PoolCompositionBlade'
import { AddLiquidityDialog } from './add-liquidity/add-liquidity-dialog'
import { PoolChartBlade } from './pool-chart-blade'

interface PoolPageBlade {
  pool: Awaited<BladePool>
}

export const PoolPageBlade: FC<PoolPageBlade> = ({ pool }) => {
  const { isMd } = useBreakpoint('md')
  const [showStableTypes, setShowStableTypes] = useState(false)
  return (
    <Container
      maxWidth="screen-3xl"
      className="flex flex-col gap-4 px-4 lg:gap-6"
    >
      {/* <UnknownTokenAlert pool={pool} /> */}
      <div className="flex flex-col-reverse gap-4 w-full lg:gap-10 lg:flex-row">
        <div className="flex-[2_2_0%] min-[1230px]:flex-[3_3_0%] min-w-0 flex flex-col gap-4 lg:gap-6">
          <APRChart pool={pool} />
          <PoolChartBlade />
        </div>
        <div className="flex-[1_1_0%] min-[1230px]:flex-[1_1_0%] min-w-0 flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            {isMd ? (
              <AddLiquidityDialog
                // @ts-expect-error - ok until we have a blade pool type
                poolType={'BLADE'}
                hidePoolTypeToggle={true}
                hideTokenSelectors={false}
                trigger={
                  <Button size="lg" className="w-full h-[52px]">
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Liquidity</span>
                  </Button>
                }
              />
            ) : null}
            {/* <ManagePositionButton
              href={`/${ChainKey[pool.chainId]}/pool/v2/${pool.address}/add`}
            /> */}
          </div>
          {/* <PoolAPRBlade version="v2" pool={pool} /> */}
          <PoolCompositionBlade
            pool={pool}
            showStableTypes={showStableTypes}
            setShowStableTypes={setShowStableTypes}
          />
          <Pool24HVolume pool={pool} />
          <BladePoolPrice pool={pool} showStableTypes={showStableTypes} />
        </div>
      </div>

      <div className="flex gap-6 lg:gap-10 lg:flex-row">
        <div className="flex-[2_2_0%] min-[1230px]:flex-[3_3_0%] min-w-0">
          {/* <PoolTransactionsV2 pool={pool} poolAddress={pool.address} /> */}
        </div>
        <div className="flex-[1_1_0%] min-[1230px]:flex-[1_1_0%] min-w-0 lg:block hidden" />
      </div>
    </Container>
  )
}
