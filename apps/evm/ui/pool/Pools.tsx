'use client'

import { ChevronRightIcon } from '@heroicons/react-v1/solid'
import { ChainId } from '@sushiswap/chain'
import { isRouteProcessor3ChainId } from '@sushiswap/route-processor'
import { isTridentChainId } from '@sushiswap/trident-sdk'
import { Button } from '@sushiswap/ui/components/button'
import { Carousel } from '@sushiswap/ui/components/Carousel'
import { Chip } from '@sushiswap/ui/components/chip'
import { Container } from '@sushiswap/ui/components/container'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@sushiswap/ui/components/dropdown-menu'
import { DiscordIcon } from '@sushiswap/ui/components/icons'
import { SelectIcon } from '@sushiswap/ui/components/select'
import { isSushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { isSushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useAccount, useNetwork } from '@sushiswap/wagmi'
import React, { FC } from 'react'

import { PoolFilters, PoolsFiltersProvider, PoolsSection } from '.'
import { PositionCard, PositionCardSkeleton } from './MigratePage/PositionCard'
import { PositionCardList } from './MigratePage/PositionCardList'

export const Pools: FC<{ filters?: Partial<PoolFilters> }> = ({ filters }) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const chainId = chain?.id || ChainId.ETHEREUM

  return (
    <>
      <Container maxWidth="7xl" className="mx-auto px-4 pt-[80px] lg:pb-[54px]">
        <section className="flex flex-col justify-between gap-12 lg:flex-row lg:items-center">
          <div className="flex flex-col items-center flex-grow gap-6 lg:items-start">
            <div className="flex flex-col gap-2">
              <span className="text-5xl font-semibold tracking-tight text-center text-gray-800 lg:text-left dark:text-slate-200">
                Provide Liquidity
                <span className="font-medium text-gray-500 dark:text-slate-500">
                  <br /> and receive fees & rewards
                </span>
              </span>
            </div>
            <div className="relative z-10 group">
              <div className="flex items-center w-full">
                <Button asChild size="lg" className="rounded-r-none">
                  <a
                    href={
                      isRouteProcessor3ChainId(chainId) ? `/pools/add?chainId=${chainId}` : `/pools/add/v2/${chainId}`
                    }
                  >
                    Create Position
                  </a>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button asChild size="lg" className="rounded-l-none">
                      <SelectIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80">
                    <DropdownMenuGroup>
                      <DropdownMenuItem disabled={!isRouteProcessor3ChainId(chainId)} asChild>
                        <a
                          href={`/pools/add?chainId=${chainId}`}
                          className="flex flex-col !items-start gap-1 cursor-pointer"
                        >
                          <div className="flex items-center gap-1 font-medium leading-none">
                            V3 Position
                            <Chip variant="secondary">
                              {isRouteProcessor3ChainId(chainId) ? 'New 🔥' : 'Unavailable'}
                            </Chip>
                          </div>
                          <p className="text-sm leading-snug text-muted-foreground">
                            Provide highly-efficient concentrated liquidity.
                          </p>
                        </a>
                      </DropdownMenuItem>

                      {isSushiSwapV2ChainId(chainId as ChainId) ? (
                        <DropdownMenuItem asChild>
                          <a
                            href={`/pools/add/v2/${chainId}`}
                            className="flex flex-col !items-start gap-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-1 font-medium leading-none">V2 Position</div>
                            <p className="text-sm leading-snug text-muted-foreground">
                              Create a legacy V2 liquidity position.
                            </p>
                          </a>
                        </DropdownMenuItem>
                      ) : null}
                      {isTridentChainId(chainId as ChainId) ? (
                        <DropdownMenuItem asChild>
                          <a
                            href={`/pools/add/trident/${chainId}`}
                            className="flex flex-col !items-start gap-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-1 font-medium leading-none">
                              Trident Position <Chip variant="secondary">Deprecated 💀</Chip>
                            </div>
                            <p className="text-sm leading-snug text-muted-foreground">
                              If you prefer creating a trident liquidity position.
                            </p>
                          </a>
                        </DropdownMenuItem>
                      ) : null}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 lg:items-end">
            <div className="flex flex-col items-center gap-1 lg:items-end">
              <span className="font-semibold lg:text-sm">Looking for a partnership with Sushi?</span>
              <Button icon={ChevronRightIcon} variant="link" size="sm" asChild>
                <a href="https://rbieu62gj0f.typeform.com/to/KkrPkOFe" rel="noreferrer noopener" target="_blank">
                  Join Onsen
                </a>
              </Button>
            </div>
            <div className="flex flex-col items-center gap-1 lg:items-end">
              <span className="font-semibold lg:text-sm">Need Help?</span>
              <Button icon={DiscordIcon} variant="link" size="sm" asChild>
                <a href="https://discord.gg/NVPXN4e" rel="noreferrer noopener" target="_blank">
                  Join our discord
                </a>
              </Button>
            </div>
          </div>
        </section>
      </Container>
      {address && (
        <PositionCardList>
          {({ positions, isLoading }) => {
            const slides = positions?.filter((position) => isSushiSwapV3ChainId(position?.chainId as ChainId))
            return !isLoading && slides.length > 0 ? (
              <section className="flex flex-col gap-3 py-10 lg:py-[54px]">
                <Container maxWidth="7xl" className="px-4 mx-auto">
                  <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-slate-200 lg:text-start">
                    Migrate <span className="text-gray-500 dark:text-slate-500">for increased efficiency.</span>
                  </h1>
                </Container>
                <div className="pl-4 xl:pl-2">
                  <Carousel
                    slideWidth={320}
                    slides={slides}
                    render={(position) => (isLoading ? <PositionCardSkeleton /> : <PositionCard position={position} />)}
                  />
                </div>
              </section>
            ) : (
              <></>
            )
          }}
        </PositionCardList>
      )}
      <PoolsFiltersProvider passedFilters={filters}>
        <PoolsSection />
      </PoolsFiltersProvider>
    </>
  )
}

export default Pools
