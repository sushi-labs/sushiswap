'use client'

import { ChevronRightIcon } from '@heroicons/react/20/solid'
import type {
  PoolChainId,
  TokenInfo as TokenInfoType,
} from '@sushiswap/graph-client/data-api'
import { Button, Container, LinkInternal } from '@sushiswap/ui'
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

  return (
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
            <div className="flex gap-6 flex-wrap">
              <div className="flex-grow">
                <TokenChart token={token} />
              </div>

              <div className="max-w-[420px]">
                <SwapWidget token1={token} />
              </div>
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
                  forcedTokenSymbols={token.symbol ? [token.symbol] : undefined}
                />
              </Container>
            </PoolsFiltersStateProvider>
          </div>
        </section>
      </div>
    </section>
  )
}
