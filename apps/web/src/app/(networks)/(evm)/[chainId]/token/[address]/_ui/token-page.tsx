'use client'

import { ChevronRightIcon } from '@heroicons/react/20/solid'
import type {
  PoolChainId,
  TokenInfo as TokenInfoType,
} from '@sushiswap/graph-client/data-api'
import { useIsMounted } from '@sushiswap/hooks'
import { Button, Container, LinkInternal } from '@sushiswap/ui'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC, useMemo } from 'react'
import { PoolsFiltersProvider } from 'src/app/(networks)/_ui/pools-filters-provider'
import { TableFiltersNetwork } from 'src/app/(networks)/_ui/table-filters-network'
import { TableFiltersSearchToken } from 'src/app/(networks)/_ui/table-filters-search-token'
import {
  EvmToken,
  SUSHISWAP_SUPPORTED_CHAIN_IDS,
  type SerializedEvmToken,
  type SushiSwapChainId,
  getEvmChainById,
} from 'sushi/evm'
import { PoolsTable } from '~evm/[chainId]/_ui/pools-table'
import { TableFiltersFarmsOnly } from '~evm/[chainId]/_ui/table-filters-farms-only'
import { TableFiltersPoolType } from '~evm/[chainId]/_ui/table-filters-pool-type'
import { TableFiltersResetButton } from '~evm/[chainId]/_ui/table-filters-reset-button'
import { TokenInfo } from './token-info'
import { TokenChart } from './charts/token-chart'
import { SwapWidget } from './swap-widget'

interface TokenPageProps {
  token: SerializedEvmToken
  tokenInfo: TokenInfoType
}

export const TokenPage: FC<TokenPageProps> = ({ token: _token, tokenInfo }) => {
  const token = useMemo(() => EvmToken.fromJSON(_token), [_token])

  const router = useRouter()

  const isMounted = useIsMounted()

  return (
    <>
      <section className="flex flex-col flex-1">
        <div className="bg-gray-100 dark:bg-white/[0.02] pt-4 h-full">
          <Container maxWidth="7xl" className="px-4">
            <div className="flex gap-x-1.5 items-center text-sm py-4">
              <Button
                variant="link"
                size="sm"
                className="!font-normal hover:underline !text-accent-foreground"
              >
                <LinkInternal href="/">Home</LinkInternal>
              </Button>
              <ChevronRightIcon
                width={16}
                height={16}
                className="text-muted-foreground"
              />
              <Button
                variant="link"
                size="sm"
                className={
                  'hover:underline !inline !font-normal !text-muted-foreground capitalize whitespace-nowrap'
                }
              >
                <LinkInternal
                  href={`/${getEvmChainById(token.chainId).key}/explore/tokens`}
                >
                  Explore
                </LinkInternal>
              </Button>
              <ChevronRightIcon
                width={16}
                height={16}
                className="text-muted-foreground"
              />
              <Button
                variant="link"
                size="sm"
                className="hover:underline !inline capitalize whitespace-nowrap !font-medium !text-gray-900 dark:!text-slate-50"
              >
                <LinkInternal
                  href={`/${getEvmChainById(token.chainId).key}/token/${token.address}`}
                >
                  {token.symbol}
                </LinkInternal>
              </Button>
            </div>

            <div className="flex flex-col gap-10 mt-6">
              <div className="flex gap-6">
                <div className="flex-auto min-w-0">
                  <TokenChart token={token} />
                </div>
                <div className="min-[854px]:w-[420px] max-[854px]:hidden">
                  <AnimatePresence>
                    {isMounted ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      >
                        <div className="w-[420px] flex-none">
                          <SwapWidget token1={token} />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>

              <TokenInfo token={token} tokenInfo={tokenInfo} />
            </div>
          </Container>
          <section className="flex flex-col flex-1 mt-10">
            <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-10 min-h-screen">
              <PoolsFiltersProvider url={false}>
                <Container maxWidth="7xl" className="px-4">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <TableFiltersSearchToken />
                    <TableFiltersPoolType />
                    <TableFiltersNetwork
                      network={token.chainId}
                      supportedNetworks={SUSHISWAP_SUPPORTED_CHAIN_IDS}
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
                    forcedTokenSymbols={
                      token.symbol ? [token.symbol] : undefined
                    }
                  />
                </Container>
              </PoolsFiltersProvider>
            </div>
          </section>
        </div>
      </section>
      <div className="w-full bottom-0 index-x-0 fixed p-4 z-[500] min-[854px]:hidden">
        <Link
          href={`/${getEvmChainById(token.chainId).key}/swap?token1=${token.address}`}
        >
          <Button fullWidth size="xl">
            Swap
          </Button>
        </Link>
      </div>
    </>
  )
}
