'use client'

import { usePool } from '@sushiswap/client/hooks'
import { unsanitize } from '@sushiswap/format'
import { useMemo } from 'react'
import { SteerPoolCard } from 'ui/pool/Steer/SteerPoolCard'

export default async function PositionsCreatePage({ params }: { params: { id: string } }) {
  const poolId = unsanitize(params.id)

  const { data: pool, isLoading } = usePool({ args: poolId })

  const enabledVaults = useMemo(() => {
    if (isLoading) return []

    return pool?.steerVaults?.filter((vault) => vault.isEnabled)
  }, [pool, isLoading])

  console.log(enabledVaults)

  return (
    <div className="flex justify-center gap-4">
      {(pool && enabledVaults)?.map((vault) => (
        <SteerPoolCard key={vault.id} pool={pool} vault={vault} />
      ))}
    </div>
  )
}
