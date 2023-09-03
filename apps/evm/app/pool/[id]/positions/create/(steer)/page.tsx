import { getPool } from '@sushiswap/client'
import { unsanitize } from '@sushiswap/format'
import { SteerPoolCard } from 'ui/pool/Steer/SteerPoolCard'

export default async function PositionsCreatePage({ params }: { params: { id: string } }) {
  const poolId = unsanitize(params.id)

  const pool = await getPool(poolId)

  const enabledVaults = pool?.steerVaults?.filter((vault) => vault.isEnabled)
  // const vaultsTags = await getSteerVaultsTags({ payloadHashes: enabledVaults.map((vault) => vault.payloadHash) })
  // console.log(enabledVaults, vaultsTags)

  return (
    <div className="flex justify-center gap-4">
      {(pool && enabledVaults)?.map((vault) => (
        <SteerPoolCard key={vault.id} pool={pool} vault={vault} />
      ))}
    </div>
  )
}
