'use client'
import { SkeletonText } from '@sushiswap/ui'
import { useMemo } from 'react'
import { currencyFormatter, useAllVaults } from 'src/lib/perps'
import { PerpsCard } from '~evm/perps/_ui/_common'

export const TVL = () => {
  const { data, isLoading } = useAllVaults()
  const totalTvl = useMemo(() => {
    return (
      data?.reduce((acc, vault) => {
        if (vault.summary.relationship.type === 'child') return acc
        return acc + Number(vault.summary.tvl)
      }, 0) ?? 0
    )
  }, [data])

  return (
    <div className="md:w-fit">
      <PerpsCard className="p-3 gap-2 flex flex-col justify-between md:pr-20">
        <div className="text-perps-muted-50 text-xs lg:text-sm">
          Total Value Locked
        </div>
        {isLoading ? (
          <div className="w-24 h-8">
            <SkeletonText fontSize="xl" />
          </div>
        ) : (
          <div className="font-medium text-lg md:text-2xl text-ellipsis overflow-hidden text-perps-muted">
            {currencyFormatter.format(totalTvl).replaceAll(/\.[0-9]+/g, '')}
          </div>
        )}
      </PerpsCard>
    </div>
  )
}
