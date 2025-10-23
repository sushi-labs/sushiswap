'use client'
import { PlusIcon } from '@heroicons/react-v1/solid'
import type { BladePool } from '@sushiswap/graph-client/data-api'
import { Button, Container } from '@sushiswap/ui'
import { type FC, useState } from 'react'
import { BladeInfoPanel } from 'src/ui/pool/BladeInfoPanel'
import { BladePoolPrice } from 'src/ui/pool/BladePoolPrice'
import { PoolTransactionsBlade } from 'src/ui/pool/PoolTransactionsBlade'
import { PoolChartBlade } from 'src/ui/pool/pool-chart-blade'
import { EvmToken, SushiSwapProtocol, unwrapEvmToken } from 'sushi/evm'
import { PoolChartV2 } from '../pool/v2/[address]/(landing)/_ui/pool-chart-v2'
import { PoolRewards } from '../pool/v2/[address]/(landing)/_ui/pool-rewards'
import { PoolTransactionsV2 } from '../pool/v2/[address]/(landing)/_ui/pool-transactions-v2'
import { APRChart } from './APRChart'
import { Pool24HVolume } from './Pool24HVolume'
import { PoolAPR } from './PoolAPR'
import { PoolCompositionBlade } from './PoolCompositionBlade'
import { PoolPrice } from './PoolPrice'
import { PoolsBladeSection } from './PoolsBladeSection'
import { AddLiquidityDialog } from './add-liquidity/add-liquidity-dialog'

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
          <BladeInfoPanel />
          <PoolChartBlade pool={pool} />
        </div>
        <div className="flex-[1_1_0%] min-[1230px]:flex-[1_1_0%] min-w-0 flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <span className="hidden md:block">
              <AddLiquidityDialog
                poolType={SushiSwapProtocol.BLADE}
                hidePoolTypeToggle={true}
                bladePool={pool}
                trigger={
                  <Button size="lg" className="w-full h-[52px]">
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Liquidity</span>
                  </Button>
                }
                chainId={pool.chainId}
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
