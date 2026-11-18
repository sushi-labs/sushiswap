'use client'

import { Tabs, TabsContent } from '@sushiswap/ui'
import type { FC } from 'react'
import {
  type BladeChainId,
  type SushiSwapChainId,
  getEvmChainById,
  isSushiSwapV2ChainId,
} from 'sushi/evm'
import { V2MigrationNotice } from '~evm/[chainId]/_ui/v2-migration-notice'
import { ConcentratedPositionsTable } from '~evm/[chainId]/pool/_ui/concentrated-positions-table/concentrated-positions-table'
import { usePositionFilters } from './position-filters-provider'
import { V2PositionsTable } from './v2-positions-table'

export const PositionsTab: FC<{
  chainId: SushiSwapChainId | BladeChainId
}> = ({ chainId }) => {
  const {
    state: { tab, hideClosedPositions },
  } = usePositionFilters()

  return (
    <div className="flex flex-col mt-4 mb-8">
      {tab === 'v2' ? <V2MigrationNotice /> : null}

      <Tabs value={tab} defaultValue={tab}>
        <TabsContent value="v3">
          <ConcentratedPositionsTable
            chainId={chainId}
            hideNewSmartPositionButton={true}
            hideNewPositionButton={true}
            hideCollectAllButton={true}
            hideClosedPositions={hideClosedPositions}
          />
        </TabsContent>
        {isSushiSwapV2ChainId(chainId) && (
          <TabsContent value="v2">
            <V2PositionsTable
              chainId={chainId}
              rowLink={(row) =>
                `/${getEvmChainById(chainId).key}/pool/v2/${row.pool.address}/add`
              }
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
