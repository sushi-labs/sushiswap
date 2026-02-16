import {
  type PortfolioFarmClaim,
  getPortfolioClaimables,
} from '@sushiswap/graph-client/data-api'
import { Accordion, SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { formatUSD } from 'sushi'
import type { Address } from 'viem'
import { useConnection } from 'wagmi'
import { PortfolioFarmClaimables } from './portfolio-farm-claimables'
import { PortfolioFuroClaimables } from './portfolio-furo-claimables'

function usePortfolioClaimables(
  address: Address | undefined,
  refetchInterval?: 600_000,
) {
  return useQuery({
    queryKey: ['portfolio-claimables', address],
    queryFn: async () => {
      const id = address as string
      const data = await getPortfolioClaimables({ id })
      return data
    },
    enabled: !!address,
    refetchInterval,
  })
}

export const PortfolioClaimables = () => {
  const { address } = useConnection()
  const { data, isLoading, isError } = usePortfolioClaimables(address)

  const farmClaimables: PortfolioFarmClaim[] = useMemo(
    () =>
      data ? [...data.v2PositionClaimables, ...data.v3PositionClaimables] : [],
    [data],
  )

  return (
    <div className="flex flex-col h-full overflow-hidden gap-y-5">
      <div className="px-5">
        <div className="flex flex-col px-5 py-3 gap-y-3 bg-secondary rounded-xl">
          <span className="text-sm text-muted-foreground">Total Balance</span>
          {isLoading && !data && !isError ? (
            <SkeletonText fontSize="lg" className="!w-1/3" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {formatUSD(data?.totalUSD ?? 0)}
              </div>
              {isError ? (
                <div className="text-xs italic text-red-500">
                  An error occurred fetching claimables.
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
      {isError ? // Hide skeletons + hide claimable list on error
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
              <SkeletonCircle radius={28} />
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
          defaultValue={['v2', 'v3', 'alm', 'furo']}
        >
          {farmClaimables.length ? (
            <PortfolioFarmClaimables claimables={farmClaimables} />
          ) : null}
          {data.furoClaimables.length ? (
            <PortfolioFuroClaimables claimables={data.furoClaimables} />
          ) : null}
        </Accordion>
      )}
    </div>
  )
}
