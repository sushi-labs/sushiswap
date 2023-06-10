import { useIsMounted } from '@sushiswap/hooks'
import { Container, Skeleton, Typography } from '@sushiswap/ui'
import React, { FC } from 'react'
import { useQuery } from '@tanstack/react-query'

export const Stats: FC = () => {
  const isMounted = useIsMounted()
  const { data } = useQuery(['api/stats'], () => fetch('api/stats').then((response) => response.json()))
  return (
    <section className="overflow-x-hidden">
      <Container maxWidth="5xl" className="mx-auto px-4 pt-10">
        <div className="grid grid-cols-2 md:flex md:justify-between my-[120px] gap-10">
          <div className="flex items-center gap-3 px-6 lg:px-0">
            <div className="flex flex-col justify-center gap-1">
              {data?.stats?.price && isMounted ? (
                <Typography variant="h2" weight={600}>
                  {data?.stats?.price.formatted}
                </Typography>
              ) : (
                <Skeleton.Box className="bg-neutral-800 w-[120px] h-[28px] my-1" />
              )}
              <Typography variant="xs" weight={600} className="uppercase text-neutral-400 -mt-0.5">
                Price
              </Typography>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 lg:justify-center lg:px-0">
            <div className="flex flex-col justify-center gap-1">
              {data?.stats?.liquidity && isMounted ? (
                <Typography variant="h2" weight={600}>
                  {data?.stats?.liquidity.formatted}
                </Typography>
              ) : (
                <Skeleton.Box className="bg-neutral-800 w-[120px] h-[28px] my-1" />
              )}
              <Typography variant="xs" weight={600} className="uppercase text-neutral-400 -mt-0.5">
                Total Liquidity
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 lg:justify-center lg:px-0">
            <div className="flex flex-col justify-center gap-1">
              {data?.stats?.volume && isMounted ? (
                <Typography variant="h2" weight={600}>
                  {data?.stats?.volume.formatted}
                </Typography>
              ) : (
                <Skeleton.Box className="bg-neutral-800 w-[120px] h-[28px] my-1" />
              )}
              <Typography variant="xs" weight={600} className="uppercase text-neutral-400 -mt-0.5">
                Total Volume
              </Typography>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 lg:px-0">
            <div className="flex flex-col justify-center gap-1">
              {data?.stats?.pairs && isMounted ? (
                <Typography variant="h2" weight={600}>
                  {data?.stats?.pairs.formatted}
                </Typography>
              ) : (
                <Skeleton.Box className="bg-neutral-800 w-[120px] h-[28px] my-1" />
              )}
              <Typography variant="xs" weight={600} className="uppercase text-neutral-400 -mt-0.5">
                Total Pairs
              </Typography>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
