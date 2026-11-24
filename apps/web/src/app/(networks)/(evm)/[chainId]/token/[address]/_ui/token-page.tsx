'use client'

import type {
  PoolChainId,
  SushiSwapChainId,
  TokenInfo as TokenInfoType,
} from '@sushiswap/graph-client/data-api'
import { SushiSwapChainIds } from '@sushiswap/graph-client/data-api'
import { useIsMounted, useMediaQuery } from '@sushiswap/hooks'
import { Button, Container, LinkInternal, Separator } from '@sushiswap/ui'
import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { type FC, useMemo } from 'react'
import { PoolsFiltersProvider } from 'src/app/(networks)/_ui/pools-filters-provider'
import { TableFiltersNetwork } from 'src/app/(networks)/_ui/table-filters-network'
import { TableFiltersSearchToken } from 'src/app/(networks)/_ui/table-filters-search-token'
import { EvmToken, type SerializedEvmToken, getEvmChainById } from 'sushi/evm'
import { PoolsTable } from '~evm/[chainId]/_ui/pools-table'
import { TableFiltersFarmsOnly } from '~evm/[chainId]/_ui/table-filters-farms-only'
import { TableFiltersPoolType } from '~evm/[chainId]/_ui/table-filters-pool-type'
import { TableFiltersResetButton } from '~evm/[chainId]/_ui/table-filters-reset-button'
import { TokenChart } from './charts/token-chart'
import { TokenHeader } from './token-header'
import { TokenInfo } from './token-info'

const SwapWidget = dynamic(() =>
  import('./swap-widget').then((module) => module.SwapWidget),
)

interface TokenPageProps {
  chainId: SushiSwapChainId
  token: SerializedEvmToken
  tokenInfo: TokenInfoType
}

export const TokenPage: FC<TokenPageProps> = ({
  chainId,
  token: _token,
  tokenInfo,
}) => {
  const token = useMemo(() => EvmToken.fromJSON(_token), [_token])

  const router = useRouter()

  const isMounted = useIsMounted()
  const isDesktop = useMediaQuery({ query: '(min-width: 854px)' })

  return (
    <>
      <Container
        maxWidth="7xl"
        className="flex flex-col gap-6 px-4 pt-6 md:pt-10 pb-[calc(6rem+env(safe-area-inset-bottom))] min-[854px]:pb-10"
      >
        <TokenHeader token={token} />
        <Separator className="hidden md:block" />
        <div className="grid grid-cols-1 items-start gap-6 min-[854px]:grid-cols-[minmax(0,1fr)_420px]">
          <TokenChart chainId={chainId} address={token.address} />
          <div className="hidden min-[854px]:block">
            <AnimatePresence>
              {isMounted && isDesktop ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <SwapWidget token1={token} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        <TokenInfo token={token} tokenInfo={tokenInfo} />
        <Separator />
        <section>
          <PoolsFiltersProvider url={false}>
            <div className="flex flex-wrap gap-3 md:mb-4">
              <TableFiltersSearchToken />
              <TableFiltersPoolType />
              <TableFiltersNetwork
                network={token.chainId}
                supportedNetworks={SushiSwapChainIds}
                unsupportedNetworkHref="/ethereum/explore/tokens"
                onSelect={(network) =>
                  router.push(
                    `/${getEvmChainById(network as SushiSwapChainId).key}/explore/tokens`,
                  )
                }
                className="lg:hidden block"
              />
              <TableFiltersFarmsOnly />
              <TableFiltersResetButton />
            </div>
            <PoolsTable
              chainId={token.chainId as PoolChainId}
              forcedTokenAddresses={token.address ? [token.address] : undefined}
            />
          </PoolsFiltersProvider>
        </section>
      </Container>
      <div className="fixed inset-x-0 bottom-0 z-[500] border-t border-accent bg-background p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] min-[854px]:hidden">
        <Button asChild fullWidth size="xl">
          <LinkInternal
            href={`/${getEvmChainById(token.chainId).key}/swap?token1=${token.address}`}
          >
            Swap
          </LinkInternal>
        </Button>
      </div>
    </>
  )
}
