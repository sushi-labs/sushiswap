'use client'

import { ChevronRightIcon } from '@heroicons/react/20/solid'
import type {
  PoolChainId,
  TokenInfo as TokenInfoType,
} from '@sushiswap/graph-client/data-api'
import { useIsMounted, useMediaQuery } from '@sushiswap/hooks'
import { Button, Container, LinkInternal, classNames } from '@sushiswap/ui'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC, useMemo } from 'react'
import { EvmChainKey } from 'sushi/chain'
import {
  SUSHISWAP_SUPPORTED_CHAIN_IDS,
  type SushiSwapChainId,
} from 'sushi/config'
import { type SerializedToken, Token } from 'sushi/currency'
import { PoolsFiltersStateProvider } from '../pool'
import { PoolsTable } from '../pool/PoolsTable'
import { TableFiltersSmartPoolsOnly } from '../pool/TableFilterSmartPoolsOnly'
import { TableFiltersFarmsOnly } from '../pool/TableFiltersFarmsOnly'
import { TableFiltersNetwork } from '../pool/TableFiltersNetwork'
import { TableFiltersPoolType } from '../pool/TableFiltersPoolType'
import { TableFiltersResetButton } from '../pool/TableFiltersResetButton'
import { TableFiltersSearchToken } from '../pool/TableFiltersSearchToken'
import { useSidebar } from '../sidebar'
import { SwapWidget } from '../swap/widget/swap-widget'
import { TokenInfo } from './TokenInfo'
import { TokenChart } from './charts/TokenChart'

interface TokenPageProps {
  token: SerializedToken
  tokenInfo: TokenInfoType
}

export const TokenPage: FC<TokenPageProps> = ({ token: _token, tokenInfo }) => {
  const token = useMemo(() => new Token(_token), [_token])

  const router = useRouter()

  const isMounted = useIsMounted()

  const { isOpen: isSidebarOpen } = useSidebar()

  const isLg = useMediaQuery({
    query: `(min-width: 1080px)`,
  })

  const isMd = useMediaQuery({
    query: `(min-width: 854px)`,
  })

  const showWidget = isSidebarOpen ? isLg : isMd

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
                  href={`/${EvmChainKey[token.chainId]}/explore/tokens`}
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
                  href={`/${EvmChainKey[token.chainId]}/token/${token.address}`}
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
                <AnimatePresence>
                  {isMounted && showWidget ? (
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

              <TokenInfo token={token} tokenInfo={tokenInfo} />
            </div>
          </Container>
          <section className="flex flex-col flex-1 mt-10">
            <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-10 min-h-screen">
              <PoolsFiltersStateProvider>
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
                          `/${EvmChainKey[network as SushiSwapChainId]}/explore/tokens`,
                        )
                      }
                      className="lg:hidden block"
                    />
                    <TableFiltersFarmsOnly />
                    <TableFiltersSmartPoolsOnly />
                    <TableFiltersResetButton />
                  </div>
                  <PoolsTable
                    chainId={token.chainId as PoolChainId}
                    forcedTokenSymbols={
                      token.symbol ? [token.symbol] : undefined
                    }
                  />
                </Container>
              </PoolsFiltersStateProvider>
            </div>
          </section>
        </div>
      </section>
      {isMounted && !showWidget ? (
        <div
          className={classNames(
            'absolute inset-x-0 bottom-0 p-4 z-[10]',
            isSidebarOpen ? 'lg:ml-56' : '',
          )}
        >
          <Link
            href={`/${EvmChainKey[token.chainId]}/swap?token1=${token.address}`}
          >
            <Button fullWidth size="xl">
              Swap
            </Button>
          </Link>
        </div>
      ) : null}
    </>
  )
}
