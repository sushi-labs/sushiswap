'use client'
import { PlusIcon } from '@heroicons/react-v1/solid'
import type { BladePool } from '@sushiswap/graph-client/data-api'
import { Button, Container } from '@sushiswap/ui'
import { type FC, useState } from 'react'
import type { SushiSwapProtocol } from 'sushi'
import { APRChart } from './APRChart'
import { BladePoolPrice } from './BladePoolPrice'
import { Pool24HVolume } from './Pool24HVolume'
import { PoolCompositionBlade } from './PoolCompositionBlade'
import { PoolTransactionsBlade } from './PoolTransactionsBlade'
import { AddLiquidityDialog } from './add-liquidity/add-liquidity-dialog'
import { PoolChartBlade } from './pool-chart-blade'

interface PoolPageBlade {
  pool: Awaited<BladePool>
}

export const PoolPageBlade: FC<PoolPageBlade> = ({ pool }) => {
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
            <span className="hidden md:block">
              <AddLiquidityDialog
                poolType={'BLADE' as SushiSwapProtocol}
                hidePoolTypeToggle={true}
                bladePool={pool}
                trigger={
                  <Button size="lg" className="w-full h-[52px]">
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Liquidity</span>
                  </Button>
                }
              />
            </span>
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
          <PoolTransactionsBlade pool={pool} poolAddress={pool.address} />
        </div>
        <div className="flex-[1_1_0%] min-[1230px]:flex-[1_1_0%] min-w-0 lg:block hidden" />
      </div>
    </Container>
  )
}
