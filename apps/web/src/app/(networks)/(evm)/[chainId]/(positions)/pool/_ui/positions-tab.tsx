'use client'

import { Card, CardHeader, CardTitle, Tabs, TabsContent } from '@sushiswap/ui'
import {} from '@sushiswap/ui'
import type { FC } from 'react'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
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
  const address = useAccount('evm')

  if (!address) {
    return (
      <div className="mt-4 mb-8">
        <Card className="!bg-transparent md:!bg-secondary !border-transparent md:!border-accent">
          <CardHeader className="!px-0 md:!px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle className="flex-grow whitespace-nowrap">
                My Positions{' '}
                <span className="text-muted-foreground text-sm font-normal">
                  (0)
                </span>
              </CardTitle>
            </div>
          </CardHeader>
          <div className="flex flex-col justify-center gap-2 items-center min-h-[250px]">
            <p className="text-muted-foreground text-sm">
              Connect your wallet to view positions.
            </p>
            <ConnectButton namespace="evm" />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col mt-3 mb-8 gap-3">
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
      {tab === 'v2' ? <V2MigrationNotice /> : null}
    </div>
  )
}
