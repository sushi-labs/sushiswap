import { getPortfolioPositions } from '@sushiswap/graph-client/data-api'
import { Accordion, SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import React from 'react'
import { formatUSD } from 'sushi'
import type { Address } from 'viem'
import { useConnection } from 'wagmi'
import { PortfolioV2Positions } from './portfolio-v2-positions'
import { PortfolioV3Positions } from './portfolio-v3-positions'

function usePortfolioPositions(
  address: Address | undefined,
  refetchInterval = ms('10m'),
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
  const id = useConnection()
  const { data, isLoading, isError } = usePortfolioPositions(id.address)

  return (
    <div className="flex flex-col gap-y-4">
      <div className="shrink-0 px-7 pt-4">
        <div className="flex flex-col">
          <span className="sr-only">Total Balance</span>
          <div className="">
            {isLoading && !data && !isError ? (
              <SkeletonText fontSize="lg" className="!h-12 !w-1/2" />
            ) : (
              <>
                <div className="text-[40px] leading-[48px] font-medium tracking-tight tabular-nums">
                  {formatUSD(data?.totalUSD ?? 0)}
                </div>
                {isError ? (
                  <div className="text-xs italic text-red-500">
                    An error occurred fetching positions.
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
      {isError ? // Hide skeletons + hide pos list on error
      null : isLoading ? (
        <div>
          <div className="px-7 py-4">
            <SkeletonText />
          </div>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`${i}`}
              className="flex items-center w-full px-7 py-2.5 gap-x-6"
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
        <Accordion type="multiple" defaultValue={['v2', 'v3', 'alm']}>
          {data?.v2Positions.length ? (
            <PortfolioV2Positions positions={data.v2Positions} />
          ) : null}
          {data?.v3Positions.length ? (
            <PortfolioV3Positions positions={data.v3Positions} />
          ) : null}
        </Accordion>
      )}
    </div>
  )
}
