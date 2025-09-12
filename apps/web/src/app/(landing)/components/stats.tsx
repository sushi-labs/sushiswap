import { useIsMounted } from '@sushiswap/hooks'
import { Container, SkeletonText } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import React, { type FC } from 'react'

export const Stats: FC = () => {
  const isMounted = useIsMounted()
  const { data } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: () => fetch('/api/stats').then((response) => response.json()),
  })

  return (
    <section className="overflow-x-hidden">
      <Container maxWidth="5xl" className="px-4 pt-10 mx-auto">
        <div className="grid grid-cols-2 md:flex md:justify-between my-[120px] gap-10">
          <div className="flex items-center gap-3 px-6 lg:px-0">
            <div className="flex flex-col justify-center gap-1">
              {data?.stats?.price && isMounted ? (
                <span className="text-3xl font-semibold">
                  {data?.stats?.price.formatted}
                </span>
              ) : (
                <SkeletonText fontSize="3xl" className="w-[120px]" />
              )}
              <span className="text-xs font-medium uppercase text-neutral-400 -mt-0.5">
                Price
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 lg:justify-center lg:px-0">
            <div className="flex flex-col justify-center gap-1">
              {data?.stats?.liquidity && isMounted ? (
                <span className="text-3xl font-semibold">
                  {data?.stats?.liquidity.formatted}
                </span>
              ) : (
                <SkeletonText fontSize="3xl" className="w-[120px]" />
              )}
              <span className="text-xs font-medium uppercase text-neutral-400 -mt-0.5">
                Total Liquidity
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 lg:justify-center lg:px-0">
            <div className="flex flex-col justify-center gap-1">
              {data?.stats?.volume && isMounted ? (
                <span className="text-3xl font-semibold">
                  {data?.stats?.volume.formatted}
                </span>
              ) : (
                <SkeletonText fontSize="3xl" className="w-[120px]" />
              )}
              <span className="text-xs font-medium uppercase text-neutral-400 -mt-0.5">
                Total Volume
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 lg:px-0">
            <div className="flex flex-col justify-center gap-1">
              {data?.stats?.pairs && isMounted ? (
                <span className="text-3xl font-semibold">
                  {data?.stats?.pairs.formatted}
                </span>
              ) : (
                <SkeletonText fontSize="3xl" className="w-[120px]" />
              )}
              <span className="text-xs font-medium uppercase text-neutral-400 -mt-0.5">
                Total Pairs
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
