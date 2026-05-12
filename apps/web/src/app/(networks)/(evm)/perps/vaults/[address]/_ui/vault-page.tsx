'use client'
import type { EvmAddress } from 'sushi/evm'
import { VaultHeader } from './vault-header'

export const VaultPage = ({ vaultAddress }: { vaultAddress: string }) => {
  return (
    <div className="flex flex-col gap-2 mb-7">
      <VaultHeader vaultAddress={vaultAddress as EvmAddress} />
    </div>
  )
}
