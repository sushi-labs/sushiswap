import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  LinkInternal,
} from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { type ChainId, getChainById } from 'sushi'
import { isSushiSwapV2ChainId, isSushiSwapV3ChainId } from 'sushi/evm'

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
      <DropdownMenuContent className="w-76" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={!isSushiSwapV3ChainId(chainId)} asChild>
            <LinkInternal
              href={`/${getChainById(chainId).key}/pool/v3/add`}
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
          {isSushiSwapV2ChainId(chainId) ? (
            <DropdownMenuItem asChild>
              <LinkInternal
                href={`/${getChainById(chainId).key}/pool/v2/add`}
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
  )
}
