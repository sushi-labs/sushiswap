'use client'

import { ChevronRightIcon } from '@heroicons/react-v1/solid'
import { ChainId } from '@sushiswap/chain'
import { isRouteProcessor3ChainId } from '@sushiswap/route-processor'
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
import { TRIDENT_ENABLED_NETWORKS } from 'config'
import Link from 'next/link'
import { FC } from 'react'

export const Hero: FC = () => {
  const { chain } = useNetwork()
  const chainId = chain?.id || ChainId.ETHEREUM
  return (
    <section className="flex flex-col justify-between gap-12 lg:flex-row lg:items-center">
      <div className="flex flex-col items-center flex-grow gap-6 lg:items-start">
        <div className="flex flex-col gap-2">
          <span className="tracking-tight text-center lg:text-left font-semibold text-5xl text-gray-800 dark:text-slate-200">
            Provide Liquidity
            <span className="font-medium text-gray-500 dark:text-slate-500">
              <br /> and receive fees & rewards<sup className="text-sm top-[-24px]">1</sup>
            </span>
          </span>
        </div>
        <div className="relative z-10 group">
          <div className="flex items-center w-full">
            <Button asChild size="lg" className="rounded-r-none">
              <Link
                href={isRouteProcessor3ChainId(chainId) ? `/pool/add?chainId=${chainId}` : `/pool/add/v2/${chainId}`}
              >
                Create Position
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
                        Provide highly-efficient concentrated liquidity.
                      </p>
                    </Link>
                  </DropdownMenuItem>

                  {isSushiSwapV2ChainId(chainId as ChainId) ? (
                    <DropdownMenuItem asChild>
                      <a href={`/pools/add/v2/${chainId}`} className="flex flex-col !items-start gap-1 cursor-pointer">
                        <div className="flex items-center gap-1 font-medium leading-none">V2 Position</div>
                        <p className="text-sm leading-snug text-muted-foreground">
                          Create a legacy V2 liquidity position.
                        </p>
                      </a>
                    </DropdownMenuItem>
                  ) : null}
                  {TRIDENT_ENABLED_NETWORKS.includes(chainId as (typeof TRIDENT_ENABLED_NETWORKS)[number]) ? (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/pool/add/trident/${chainId}`}
                        className="flex flex-col !items-start gap-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-1 font-medium leading-none">
                          Trident Position <Chip variant="secondary">Deprecated 💀</Chip>
                        </div>
                        <p className="text-sm leading-snug text-muted-foreground">
                          If you prefer creating a trident liquidity position.
                        </p>
                      </Link>
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
  )
}
