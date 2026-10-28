import type { SmartPoolChainId } from '@sushiswap/graph-client/data-api'
import { Container, SkeletonBox } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import {
  SteerBaseStrategy,
  type SteerVaultPool,
} from 'src/lib/steer/components/steer-strategies'
import { getVaultGenerics } from 'src/lib/steer/fetchers/get-vault-generics'
import type { Address, Hex } from 'viem'
import { getCachedVault } from './get-cached-vaults'

interface SmartVaultParams {
  chainId: SmartPoolChainId
  vaultAddress: Address
}

export async function SmartVaultLayout({
  chainId,
  vaultAddress,
  children,
}: SmartVaultParams & { children: ReactNode }) {
  const vault = await getCachedVault({ chainId, vaultAddress })

  if (!vault) {
    return notFound()
  }

  return (
    <Container maxWidth="5xl" className="px-4">
      {vault.isDeprecated && (
        <div className="text-center text-red dark:text-red-600 w-full pb-8">
          <div className=" font-medium">This vault is deprecated.</div>
          <div className="text-sm">
            {"It will not accrue any fees and won't be readjusted."}
          </div>
        </div>
      )}
      {children}
    </Container>
  )
}

export async function SmartVault({
  chainId,
  vaultAddress,
  poolAddress,
  pool,
}: SmartVaultParams & { poolAddress: Hex; pool: SteerVaultPool }) {
  const vault = await getCachedVault({ chainId, vaultAddress })

  if (!vault || vault.poolAddress.toLowerCase() !== poolAddress.toLowerCase()) {
    return notFound()
  }

  const generics = await getVaultGenerics(vault)

  return <SteerBaseStrategy pool={pool} vault={vault} generic={generics} />
}

export function SmartVaultLoading() {
  return (
    <div className="w-full flex justify-center gap-4">
      <SkeletonBox className="h-[745px] w-[516px]" />
      <SkeletonBox className="h-[745px] w-[460px]" />
    </div>
  )
}
