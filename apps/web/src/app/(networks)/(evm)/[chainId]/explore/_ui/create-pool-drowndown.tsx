import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  LinkInternal,
} from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { type ChainId, getChainById } from 'sushi'
import {
  isMerklChainId,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/evm'

export const CreatePoolDropdown = ({
  chainId,
  children,
}: {
  chainId: ChainId
  children: ReactNode
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full rounded-full">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="!max-w-[300px]" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <LinkInternal
              href={`/${isSushiSwapV3ChainId(chainId) ? getChainById(chainId).key : 'ethereum'}/pool/v3/add`}
              className="flex flex-col !items-start gap-1 cursor-pointer"
            >
              <div className="flex items-center gap-1 font-medium leading-none">
                V3 Position
              </div>
              <p className="text-sm leading-snug text-muted-foreground">
                Provide liquidity to a V3 liquidity pool.
              </p>
            </LinkInternal>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <LinkInternal
              href={`/${isSushiSwapV2ChainId(chainId) ? getChainById(chainId).key : 'ethereum'}/pool/v2/add`}
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
          <DropdownMenuItem asChild>
            <LinkInternal
              href={`/${isMerklChainId(chainId) && isSushiSwapV3ChainId(chainId) ? getChainById(chainId).key : 'ethereum'}/pool/incentivize`}
              className="flex flex-col !items-start gap-1 cursor-pointer"
            >
              <div className="flex items-center gap-1 font-medium leading-none">
                Incentivize a Pool
              </div>
              <p className="text-sm leading-snug text-muted-foreground">
                Add rewards to a pool to incentivize liquidity providers joining
                in.
              </p>
            </LinkInternal>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
