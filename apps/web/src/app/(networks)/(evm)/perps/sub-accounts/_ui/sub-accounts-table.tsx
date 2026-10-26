'use client'

import { Button, DataTableVirtual, useBreakpoint } from '@sushiswap/ui'
import type { TableState } from '@tanstack/react-table'
import { type ReactElement, useMemo } from 'react'
import { useAllPerpMetas } from 'src/lib/perps/info/use-all-perp-metas'
import { useSpotClearinghouseState } from 'src/lib/perps/info/use-spot-clearinghouse-state'
import { useSubAccounts } from 'src/lib/perps/info/use-sub-accounts'
import { useAllDexClearinghouseState } from 'src/lib/perps/subscription/use-all-dex-clearinghouse-state'
import {
  getPerpsAccountEquity,
  getSpotAccountEquity,
  getSpotTokenPrices,
} from 'src/lib/perps/utils'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'src/lib/wallet'
import { PerpsCard } from '../../_ui/_common/perps-card'
import { useAssetListState } from '../../_ui/asset-selector'
import { tableRowClassName } from '../../_ui/trade-tables/_common/column-meta'
import { MobileTable } from '../../_ui/trade-tables/_common/mobile-table'
import {
  ACTIONS_COLUMN,
  ADDRESS_COLUMN,
  NAME_COLUMN,
  PERPS_EQUITY_COLUMN,
  SPOT_EQUITY_COLUMN,
  type SubAccountTableRow,
} from './columns'

const COLUMNS = [
  NAME_COLUMN,
  ADDRESS_COLUMN,
  PERPS_EQUITY_COLUMN,
  SPOT_EQUITY_COLUMN,
  ACTIONS_COLUMN,
]

export function SubAccountsTable(): ReactElement {
  const address = useAccount('evm')
  const { isLg } = useBreakpoint('lg')
  const subAccounts = useSubAccounts({ address })
  const masterPerps = useAllDexClearinghouseState({ address })
  const masterSpot = useSpotClearinghouseState({ address })
  const { data: allPerpMetas } = useAllPerpMetas()
  const {
    state: {
      assetListQuery: { data: assetList },
    },
  } = useAssetListState()
  const tokenPrices = useMemo(() => getSpotTokenPrices(assetList), [assetList])
  const tableData = useMemo<SubAccountTableRow[]>(() => {
    if (!address) return []
    return [
      {
        address,
        masterAddress: address,
        name: 'Master Account',
        type: 'master',
        perpsEquity: getPerpsAccountEquity(
          masterPerps.data?.clearinghouseStates,
          allPerpMetas,
          tokenPrices,
        ),
        spotEquity: getSpotAccountEquity(masterSpot.data, tokenPrices),
        isLoadingPerps: masterPerps.isLoading,
        isLoadingSpot: masterSpot.isLoading,
      },
      ...(subAccounts.data ?? []).map(
        (account): SubAccountTableRow => ({
          address: account.subAccountUser,
          masterAddress: address,
          name: account.name,
          type: 'sub',
          perpsEquity: getPerpsAccountEquity(
            account.dexToClearinghouseState,
            allPerpMetas,
            tokenPrices,
          ),
          spotEquity: getSpotAccountEquity(account.spotState, tokenPrices),
          isLoadingPerps: false,
          isLoadingSpot: false,
        }),
      ),
    ]
  }, [
    address,
    masterPerps.data,
    masterPerps.isLoading,
    masterSpot.data,
    masterSpot.isLoading,
    subAccounts.data,
    allPerpMetas,
    tokenPrices,
  ])
  const state = useMemo(
    (): Partial<TableState> => ({
      sorting: [],
      pagination: { pageIndex: 0, pageSize: tableData.length },
    }),
    [tableData.length],
  )

  if (!address) {
    return (
      <PerpsCard className="flex min-h-[420px] flex-col items-center justify-center gap-4 p-4 text-center">
        <p className="max-w-md text-sm text-perps-muted-50">
          Connect your wallet to view your sub-accounts.
        </p>
        <ConnectButton
          namespace="evm"
          className="mx-auto"
          variant="perps-default"
        />
      </PerpsCard>
    )
  }

  return (
    <PerpsCard key={address} className="py-3 px-2 lg:py-5 lg:px-0">
      {isLg ? (
        <DataTableVirtual
          state={state}
          loading={subAccounts.isLoading}
          columns={COLUMNS}
          data={tableData}
          thClassName="!h-8 !px-0"
          hideScrollbar={true}
          trClassName={tableRowClassName}
          scrollMode="window"
          testId="sub-accounts"
        />
      ) : (
        <MobileTable
          columns={COLUMNS}
          data={tableData}
          isLoading={subAccounts.isLoading}
          sorting={[]}
          isExpandedOverride={true}
          scrollMode="window"
        />
      )}
      {subAccounts.isError ? (
        <div
          role="alert"
          className="flex justify-center items-center gap-3 pt-4 text-sm"
        >
          <span>Unable to load sub-accounts.</span>
          <Button
            size="xs"
            variant="perps-secondary"
            onClick={() => void subAccounts.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : null}
      {subAccounts.isSuccess && !subAccounts.data?.length ? (
        <p className="pt-4 text-sm text-center text-perps-muted-50">
          No sub-accounts yet.
        </p>
      ) : null}
    </PerpsCard>
  )
}
