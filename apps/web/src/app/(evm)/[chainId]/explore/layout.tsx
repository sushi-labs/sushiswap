import { GiftIcon } from '@heroicons/react-v1/outline'
import { Container } from '@sushiswap/ui'
import { LinkInternal } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Chip } from '@sushiswap/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@sushiswap/ui'
import { SelectIcon } from '@sushiswap/ui'
import React from 'react'
import { GlobalStatsCharts } from 'src/ui/explore/global-stats-charts'
import { PathnameButton } from 'src/ui/pathname-button'
import { PoolsFiltersProvider } from 'src/ui/pool'
import { ChainId } from 'sushi/chain'
import {
  SushiSwapV3ChainId,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/config'

export const metadata = {
  title: 'Pools 💦',
}

export default async function ExploreLayout({
  children,
  params,
}: { children: React.ReactNode; params: { chainId: string } }) {
  const chainId = +params.chainId as ChainId
  return (
    <>
      <Container maxWidth="7xl" className="px-4 p-10">
        <GlobalStatsCharts chainId={+params.chainId as ChainId} />
      </Container>
      <Container
        maxWidth="7xl"
        className="px-4 flex justify-between flex-wrap-reverse gap-4 pb-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <LinkInternal
            shallow={true}
            scroll={false}
            href={`/${params.chainId}/explore/pools`}
          >
            <PathnameButton
              id="all-pools"
              pathname={`/${params.chainId}/explore/pools`}
              asChild
              size="sm"
            >
              All Pools
            </PathnameButton>
          </LinkInternal>
          <LinkInternal
            shallow={true}
            scroll={false}
            href={`/${params.chainId}/explore/smart-pools`}
          >
            <PathnameButton
              id="smart-pools"
              pathname={`/${params.chainId}/explore/smart-pools`}
              asChild
              size="sm"
            >
              Smart Pools
            </PathnameButton>
          </LinkInternal>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-[unset] gap-4">
          <div className="flex items-center w-full">
            <Button
              asChild
              size="sm"
              className="flex-1 w-full sm:flex-0 sm:w-[unset] rounded-r-none"
            >
              <LinkInternal
                href={
                  isSushiSwapV3ChainId(chainId as SushiSwapV3ChainId)
                    ? `/${chainId}/pool/v3/add`
                    : isSushiSwapV2ChainId(chainId as SushiSwapV3ChainId)
                      ? `/${chainId}/pool/v2/add`
                      : ''
                }
              >
                I want to create a position
              </LinkInternal>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button asChild size="sm" className="rounded-l-none">
                  <SelectIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    disabled={
                      !isSushiSwapV3ChainId(chainId as SushiSwapV3ChainId)
                    }
                    asChild
                  >
                    <LinkInternal
                      href={`/${chainId}/pool/v3/add`}
                      className="flex flex-col !items-start gap-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-1 font-medium leading-none">
                        V3 Position
                        <Chip variant="secondary">
                          {isSushiSwapV3ChainId(chainId as SushiSwapV3ChainId)
                            ? 'New 🔥'
                            : 'Unavailable'}
                        </Chip>
                      </div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Provide liquidity to a V3 liquidity pool.
                      </p>
                    </LinkInternal>
                  </DropdownMenuItem>
                  {isSushiSwapV2ChainId(chainId as ChainId) ? (
                    <DropdownMenuItem asChild>
                      <LinkInternal
                        href={`/${chainId}/pool/v2/add`}
                        className="flex flex-col !items-start gap-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-1 font-medium leading-none">
                          V2 Position
                        </div>
                        <p className="text-sm leading-snug text-muted-foreground">
                          Provide liquidity to a V2 liquidity pool.
                        </p>
                      </LinkInternal>
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            fullWidth
            asChild
            icon={GiftIcon}
            variant="secondary"
            size="lg"
          >
            <LinkInternal
              className="text-sm"
              href={`/${chainId}/pool/incentivize`}
            >
              I want to incentivize a pool
            </LinkInternal>
          </Button>
        </div>
      </Container>
      <section className="flex flex-col flex-1">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-20 h-full">
          <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
        </div>
      </section>
    </>
  )
}
