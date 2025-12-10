import { getPortfolioPositions } from '@sushiswap/graph-client/data-api'
import { Accordion, SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { formatUSD } from 'sushi'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'
import { PortfolioV2Positions } from './portfolio-v2-positions'
import { PortfolioV3Positions } from './portfolio-v3-positions'

function usePortfolioPositions(
  address: Address | undefined,
  refetchInterval?: 600_000,
) {
  return useQuery({
    queryKey: ['portfolio-positions', address],
    queryFn: async () => {
      const id = address as string
      const data = await getPortfolioPositions({ id })
      return data
    },
    enabled: !!address,
    refetchInterval,
  })
}

export const PortfolioPositions = () => {
  const id = useAccount()
  const { data, isLoading, error } = usePortfolioPositions(id.address)
  const hasError = Boolean(error)

  return (
    <div className="flex flex-col h-full overflow-hidden gap-y-5">
      <div className="px-5">
        <div className="flex flex-col px-5 py-3 gap-y-3 bg-secondary rounded-xl">
          <span className="text-sm text-muted-foreground">Total Balance</span>
          <div className="">
            {isLoading && !data && !hasError ? (
              <SkeletonText fontSize="lg" className="!w-1/3" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatUSD(data?.totalUSD ?? 0)}
                </div>
                {hasError ? (
                  <div className="text-xs italic text-red-500">
                    An error occurred fetching positions.
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
      {hasError ? // Hide skeletons + hide pos list on error
      null : isLoading || !data ? (
        <div>
          <div className="px-5 py-4">
            <SkeletonText />
          </div>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`${i}`}
              className="flex items-center w-full px-5 py-3 gap-x-7"
            >
              <div className="flex items-center">
                <SkeletonCircle radius={28} />
                <SkeletonCircle radius={28} className="-ml-[12px]" />
              </div>
              <div className="flex items-center justify-between w-full gap-x-3">
                <div className="flex flex-col basis-3/4 gap-y-1">
                  <SkeletonText fontSize="sm" />
                  <SkeletonText fontSize="xs" />
                </div>
                <div className="flex flex-col basis-1/4 gap-y-1">
                  <SkeletonText fontSize="sm" />
                  <SkeletonText fontSize="xs" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Accordion
          type="multiple"
          className="h-full overflow-y-auto"
          defaultValue={['v2', 'v3', 'alm']}
        >
          {data.v2Positions.length ? (
            <PortfolioV2Positions positions={data.v2Positions} />
          ) : null}
          {data.v3Positions.length ? (
            <PortfolioV3Positions positions={data.v3Positions} />
          ) : null}
        </Accordion>
      )}
    </div>
  )
}
