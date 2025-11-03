import { GiftIcon } from '@heroicons/react-v1/outline'
import { isBladeChainId } from '@sushiswap/graph-client/data-api'
import {
  Button,
  Chip,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  LinkInternal,
  SelectIcon,
  classNames,
} from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import {
  EvmChainId,
  getEvmChainById,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/evm'

const getAddPositionHref = (chainId: EvmChainId) => {
  if (isSushiSwapV3ChainId(chainId)) {
    return `/${getEvmChainById(chainId).key}/pool/v3/add`
  }

  if (isSushiSwapV2ChainId(chainId)) {
    return `/${getEvmChainById(chainId).key}/pool/v2/add`
  }

  if (isBladeChainId(chainId)) {
    return `/${getEvmChainById(chainId).key}/explore/blade-pools`
  }

  return `/${getEvmChainById(EvmChainId.ETHEREUM).key}/pool/v3/add`
}

export const Hero: FC<{ chainId: EvmChainId }> = ({ chainId }) => {
  const canIncentivize = useMemo(
    () => isSushiSwapV3ChainId(chainId) || isSushiSwapV2ChainId(chainId),
    [chainId],
  )

  const isBladeChain = isBladeChainId(chainId)

  return (
    <section className="flex flex-col gap-6">
      <span className="text-5xl font-bold">Manage Liquidity Positions</span>
      <div className="flex justify-between flex-wrap gap-6">
        <span className="text-xl w-[720px] text-muted-foreground">
          You can adjust and claim rewards for your liquidity positions on the
          connected network. For V2 pools, you can migrate to increase capital
          efficiency.
        </span>
        <div className="flex flex-col w-full sm:w-[unset] gap-4">
          <div className="flex items-center w-full">
            <Button
              asChild
              size="sm"
              className="flex-1 w-full sm:flex-0 sm:w-[unset] rounded-r-none"
            >
              <LinkInternal href={getAddPositionHref(chainId)}>
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
                  <DropdownMenuItem disabled={!isBladeChain} asChild>
                    <LinkInternal
                      href={`/${getEvmChainById(chainId).key}/explore/blade-pools`}
                      className="flex flex-col !items-start gap-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-1 font-medium leading-none">
                        Blade Position
                        <Chip variant="secondary">
                          {isBladeChain ? 'New 🔥' : 'Unavailable'}
                        </Chip>
                      </div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Provide liquidity to a Blade liquidity pool.
                      </p>
                    </LinkInternal>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={!isSushiSwapV3ChainId(chainId)}
                    asChild
                  >
                    <LinkInternal
                      href={`/${getEvmChainById(chainId).key}/pool/v3/add`}
                      className="flex flex-col !items-start gap-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-1 font-medium leading-none">
                        V3 Position
                        <Chip variant="secondary">
                          {isSushiSwapV3ChainId(chainId)
                            ? 'New 🔥'
                            : 'Unavailable'}
                        </Chip>
                      </div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Provide liquidity to a V3 liquidity pool.
                      </p>
                    </LinkInternal>
                  </DropdownMenuItem>
                  {isSushiSwapV2ChainId(chainId) ? (
                    <DropdownMenuItem asChild>
                      <LinkInternal
                        href={`/${getEvmChainById(chainId).key}/pool/v2/add`}
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
            className={classNames(!canIncentivize && 'invisible')}
            size="sm"
          >
            <LinkInternal
              className="text-sm"
              href={`/${getEvmChainById(chainId).key}/pool/incentivize`}
            >
              I want to incentivize a pool
            </LinkInternal>
          </Button>
        </div>
      </div>
    </section>
  )
}
