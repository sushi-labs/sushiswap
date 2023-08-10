'use client'

import { ChevronRightIcon, GiftIcon } from '@heroicons/react-v1/outline'
import { ChainId } from '@sushiswap/chain'
import { isRouteProcessor3ChainId } from '@sushiswap/route-processor'
import { isTridentChainId } from '@sushiswap/trident-sdk'
import { typographyVariants } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Chip } from '@sushiswap/ui/components/chip'
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
import { useNetwork } from '@sushiswap/wagmi'
import Link from 'next/link'
import { FC } from 'react'

export const Hero: FC = () => {
  const { chain } = useNetwork()
  const chainId = chain?.id || ChainId.ETHEREUM
  return (
    <section className="flex flex-col justify-between gap-12 lg:flex-row lg:items-start">
      <div className="flex flex-col items-center flex-grow gap-6 lg:items-start">
        <div className="flex flex-col">
          <h1 className={typographyVariants({ variant: 'h1' })}>
            Put your funds <br /> to work by <br /> providing liquidity.
          </h1>
          <p className={typographyVariants({ variant: 'lead', className: 'max-w-[500px]' })}>
            Providing liquidity to a pool allows you to earn a percentage of the pools traded volume as well as any
            extra rewards if the pool is incentivized.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center w-full">
            <Button asChild size="lg" className="rounded-r-none">
              <Link
                href={isRouteProcessor3ChainId(chainId) ? `/pool/add?chainId=${chainId}` : `/pool/add/v2/${chainId}`}
              >
                I want to create a position
              </Link>
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
                    <Link
                      href={`/pool/add?chainId=${chainId}`}
                      className="flex flex-col !items-start gap-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-1 font-medium leading-none">
                        V3 Position
                        <Chip variant="secondary">{isRouteProcessor3ChainId(chainId) ? 'New 🔥' : 'Unavailable'}</Chip>
                      </div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Provide liquidity to a V3 liquidity pool.
                      </p>
                    </Link>
                  </DropdownMenuItem>
                  {isSushiSwapV2ChainId(chainId as ChainId) ? (
                    <DropdownMenuItem asChild>
                      <a href={`/pools/add/v2/${chainId}`} className="flex flex-col !items-start gap-1 cursor-pointer">
                        <div className="flex items-center gap-1 font-medium leading-none">V2 Position</div>
                        <p className="text-sm leading-snug text-muted-foreground">
                          Provide liquidity to a V2 liquidity pool.
                        </p>
                      </a>
                    </DropdownMenuItem>
                  ) : null}
                  {isTridentChainId(chainId as ChainId) ? (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/pool/add/trident/${chainId}`}
                        className="flex flex-col !items-start gap-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-1 font-medium leading-none">
                          Trident Position <Chip variant="secondary">Deprecated 💀</Chip>
                        </div>
                        <p className="text-sm leading-snug text-muted-foreground">
                          Provide liquidity to a Trident liquidity pool.
                        </p>
                      </Link>
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button asChild icon={GiftIcon} variant="secondary" size="lg">
            <Link href="/pools/incentivize">I want to incentivize a pool</Link>
          </Button>
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
  )
}
