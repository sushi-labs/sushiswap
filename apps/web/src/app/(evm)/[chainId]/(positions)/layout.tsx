'use client'

import { GiftIcon } from '@heroicons/react-v1/outline'
import { Container, LinkInternal } from '@sushiswap/ui'
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
import { useSearchParams } from 'next/navigation'
import { PathnameButton } from 'src/ui/pathname-button'
import { PoolsFiltersProvider } from 'src/ui/pool'
import { ChainId, ChainKey, isChainId } from 'sushi/chain'
import {
  SushiSwapV3ChainId,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/config'
import { Hero } from './hero'

export default function TabsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { chainId: string }
}) {
  const chainId = +params.chainId as ChainId
  const searchParams = useSearchParams()

  if (!isChainId(chainId)) {
    throw new Error('Must be a valid chain id')
  }

  return (
    <>
      <Container maxWidth="7xl" className="px-4 pt-16 pb-4">
        <Hero />
      </Container>
      <Container
        maxWidth="7xl"
        className="px-4 flex justify-between flex-wrap-reverse gap-4 pb-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <LinkInternal
            shallow={true}
            scroll={false}
            href={`/${ChainKey[chainId]}/pool?${searchParams.toString()}`}
          >
            <PathnameButton
              id="my-positions"
              pathname={`/${ChainKey[chainId]}/pool`}
              asChild
              size="sm"
            >
              My Positions
            </PathnameButton>
          </LinkInternal>
          <LinkInternal
            shallow={true}
            scroll={false}
            href={`/${ChainKey[chainId]}/rewards?${searchParams.toString()}`}
          >
            <PathnameButton
              id="my-rewards"
              pathname={`/${ChainKey[chainId]}/rewards`}
              asChild
              size="sm"
            >
              My Rewards
            </PathnameButton>
          </LinkInternal>
          <LinkInternal
            shallow={true}
            scroll={false}
            href={`/${ChainKey[chainId]}/migrate?${searchParams.toString()}`}
          >
            <PathnameButton
              id="migrate"
              pathname={`/${ChainKey[chainId]}/migrate`}
              asChild
              size="sm"
            >
              Migrate
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
                    ? `/${ChainKey[chainId]}/pool/v3/add`
                    : isSushiSwapV2ChainId(chainId as SushiSwapV3ChainId)
                      ? `/${ChainKey[chainId]}/pool/v2/add`
                      : `/${ChainKey[ChainId.ETHEREUM]}/pool/v3/add`
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
                      href={`/${ChainKey[chainId]}/pool/v3/add`}
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
                        href={`/${ChainKey[chainId]}/pool/v2/add`}
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
            size="sm"
          >
            <LinkInternal
              className="text-sm"
              href={`/${ChainKey[chainId]}/pool/incentivize`}
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
