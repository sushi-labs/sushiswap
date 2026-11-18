'use client'
import { Button, LinkInternal } from '@sushiswap/ui'
import { type ChainId, getChainById } from 'sushi'
import {
  EvmChainId,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/evm'
import { CreatePoolDropdown } from '../explore/_ui/create-pool-drowndown'
import { LiquidityNavDesktop, LiquidityNavMobile } from './liquidity-nav'

const getAddPositionHref = (chainId: ChainId) => {
  if (isSushiSwapV3ChainId(chainId)) {
    return `/${getChainById(chainId).key}/pool/v3/add`
  }

  if (isSushiSwapV2ChainId(chainId)) {
    return `/${getChainById(chainId).key}/pool/v2/add`
  }

  return `/${getChainById(EvmChainId.ETHEREUM).key}/pool/v3/add`
}

export const LiquidityHero = ({ chainId }: { chainId: ChainId }) => {
  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-2">
        <div className="flex flex-col md:gap-2">
          <h1 className="text-2xl md:text-4xl font-medium">Liquidity</h1>

          <p className="md:text-lg !max-w-[790px] text-muted-foreground">
            Explore pools and manage your liquidity on{' '}
            {getChainById(chainId).name}.
          </p>
        </div>
        <div className="flex md:hidden w-full">
          <LiquidityNavMobile chainId={chainId} />
        </div>
        <div className="flex items-center gap-2 md:w-fit">
          <LinkInternal className="w-full" href={getAddPositionHref(chainId)}>
            <Button className="!w-full md:w-fit md:!px-10" asChild>
              New Position
            </Button>
          </LinkInternal>
          <CreatePoolDropdown chainId={chainId}>
            <Button
              asChild
              variant="secondary"
              className="!w-full md:w-fit md:!px-8"
            >
              Create Pool
            </Button>
          </CreatePoolDropdown>
        </div>
      </div>
      <div className="hidden md:block">
        <LiquidityNavDesktop chainId={chainId} />
      </div>
    </div>
  )
}
