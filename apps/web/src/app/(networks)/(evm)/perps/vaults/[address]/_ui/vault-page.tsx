'use client'
import { useState } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { SummaryRow } from './summary-row'
import { VaultCharts } from './vault-charts'
import { VaultDetails } from './vault-details'
import { VaultHeader } from './vault-header'
import { VaultTables } from './vault-tables'

export const TIMEFRAMES = ['24h', '7D', '30D', 'All-time'] as const
export type Timeframe = (typeof TIMEFRAMES)[number]

export const VaultPage = ({ vaultAddress }: { vaultAddress: string }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('All-time')
  return (
    <div className="flex flex-col gap-1 mb-14">
      <VaultHeader vaultAddress={vaultAddress as EvmAddress} />
      <div className="mt-2">
        <SummaryRow vaultAddress={vaultAddress as EvmAddress} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
        <VaultDetails
          vaultAddress={vaultAddress as EvmAddress}
          timeframe={timeframe}
        />
        <VaultCharts
          vaultAddress={vaultAddress as EvmAddress}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />
      </div>
      <div className="min-h-[300px]">
        <VaultTables vaultAddress={vaultAddress as EvmAddress} />
      </div>
    </div>
  )
}
