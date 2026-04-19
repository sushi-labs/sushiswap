'use client'

import { Button, Card, LinkInternal, SkeletonText } from '@sushiswap/ui'
import { useSushiPointsOverview } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { formatNumber } from 'sushi'

export function Points() {
  const address = useAccount('evm')
  const { data, isLoading, error } = useSushiPointsOverview({ address })

  return (
    <Card className="p-2 lg:p-4 !rounded-md flex !bg-[#18223B] border-transparent flex-col lg:flex-row gap-6 justify-between w-full">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        <div className="text-muted-foreground font-medium lg:text-lg">
          Points (Season 1)
        </div>
        <div className="flex gap-2 lg:gap-8 flex-col lg:flex-row">
          <_Item
            label="Total Points Earned"
            value={data?.totalPoints}
            isLoading={isLoading}
            error={Boolean(error)}
          />
          <_Item
            label="Points Earned (7D)"
            value={data?.points7d}
            isLoading={isLoading}
            error={Boolean(error)}
          />
          <_Item
            label="Points Earned (30D)"
            value={data?.points30d}
            isLoading={isLoading}
            error={Boolean(error)}
          />
        </div>
      </div>
      <LinkInternal href="/perps/points" className="lg:!my-auto">
        <Button variant="perps-default" className="w-full">
          Dashboard
        </Button>
      </LinkInternal>
    </Card>
  )
}

const _Item = ({
  label,
  value,
  isLoading,
  error,
}: {
  label: string
  value: number | undefined
  isLoading: boolean
  error: boolean
}) => {
  return (
    <div>
      <div className="text-muted-foreground text-xs lg:text-sm">{label}</div>
      {isLoading ? (
        <div className="w-24 h-8">
          <SkeletonText fontSize="xl" />
        </div>
      ) : error ? (
        <div className="font-medium text-lg md:text-2xl text-red-500">
          Error
        </div>
      ) : (
        <div className="font-medium text-lg md:text-2xl">
          {value ? formatNumber(value, 0) : '0'}
        </div>
      )}
    </div>
  )
}
