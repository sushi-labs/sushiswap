import { LinkIcon } from '@heroicons/react/24/outline'
import { getTokenInfo } from '@sushiswap/graph-client/data-api/queries'
import { Breadcrumb, Container, LinkExternal } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { PoolsFiltersProvider, PoolsFiltersStateProvider } from 'src/ui/pool'
import { PoolsTable } from 'src/ui/pool/PoolsTable'
import { TableFiltersSmartPoolsOnly } from 'src/ui/pool/TableFilterSmartPoolsOnly'
import { TableFiltersFarmsOnly } from 'src/ui/pool/TableFiltersFarmsOnly'
import { TableFiltersNetwork } from 'src/ui/pool/TableFiltersNetwork'
import { TableFiltersPoolType } from 'src/ui/pool/TableFiltersPoolType'
import { TableFiltersResetButton } from 'src/ui/pool/TableFiltersResetButton'
import { TableFiltersSearchToken } from 'src/ui/pool/TableFiltersSearchToken'
import { UniversalSwap } from 'src/ui/swap/universal/universal-swap'
import { TokenCollapsedDescription } from 'src/ui/tokens/TokenCollapsedDescription'
import { TokenPageClient } from 'src/ui/tokens/TokenPageClient'
import { EvmChain, type EvmChainId } from 'sushi'
import { isSushiSwapV3ChainId } from 'sushi/config'
import { Token } from 'sushi/currency'
import { isAddress } from 'viem'

export default async function TokenPage(props: {
  params: Promise<{ chainId: string; tokenAddress: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, tokenAddress } = params
  const chainId = +_chainId as EvmChainId

  if (
    !isSushiSwapV3ChainId(chainId) ||
    !isAddress(tokenAddress, { strict: false })
  ) {
    return notFound()
  }

  const tokenInfo = await unstable_cache(
    async () =>
      await getTokenInfo({
        chainId,
        chainIdInt: chainId,
        address: tokenAddress,
      }),
    ['token', `${chainId}:${tokenAddress}`],
    {
      revalidate: 60 * 15,
    },
  )()

  const token = new Token({
    chainId,
    address: tokenAddress,
    decimals: tokenInfo.token.decimals,
    symbol: tokenInfo.token.symbol,
    name: tokenInfo.token.name,
  })

  const { info } = tokenInfo

  return (
    <main className="flex flex-col h-full flex-1">
      <section className="flex flex-col flex-1">
        <div className="bg-gray-100 dark:bg-white/[0.02] border-t border-accent pt-4 pb-10 min-h-screen">
          <Container maxWidth="7xl" className="px-4">
            <Breadcrumb
              replace={{
                '-': ' ',
                [tokenAddress]: token.symbol ?? token.name ?? '',
              }}
              truncate={false}
            />
            <div className="flex flex-col gap-10 mt-6">
              {/* Chart and Trading Interface */}
              <div className="flex gap-6">
                <div className="flex-grow">
                  <TokenPageClient token={token.serialize()} />
                </div>

                {/* Trading Interface */}
                <div className="w-[420px]">
                  <UniversalSwap
                    chainId={token.chainId}
                    defaultToken0={token}
                  />
                </div>
              </div>

              {/* About Section */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium">About {token?.name}</h2>

                  <div className="flex items-center gap-4">
                    <LinkExternal
                      href={EvmChain.tokenUrl(token.chainId, token.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex items-center gap-1 text-blue-500 hover:underline">
                        <span className="text-sm">Explorer</span>
                        <LinkIcon width={16} height={16} />
                      </div>
                    </LinkExternal>
                    {info.website ? (
                      <LinkExternal
                        href={info.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center gap-1 text-blue-500 hover:underline">
                          <span className="text-sm">Website</span>
                          <LinkIcon width={16} height={16} />
                        </div>
                      </LinkExternal>
                    ) : null}
                    {info.twitter ? (
                      <LinkExternal
                        href={`https://twitter.com/${info.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center gap-1 text-blue-500 hover:underline">
                          <span className="text-sm">Twitter</span>
                          <LinkIcon width={16} height={16} />
                        </div>
                      </LinkExternal>
                    ) : null}
                    {info.telegram ? (
                      <LinkExternal
                        href={`https://t.me/${info.telegram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center gap-1 text-blue-500 hover:underline">
                          <span className="text-sm">Telegram</span>
                          <LinkIcon width={16} height={16} />
                        </div>
                      </LinkExternal>
                    ) : null}
                    {info.discord ? (
                      <LinkExternal
                        href={`https://discord.com/${info.discord}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center gap-1 text-blue-500 hover:underline">
                          <span className="text-sm">Discord</span>
                          <LinkIcon width={16} height={16} />
                        </div>
                      </LinkExternal>
                    ) : null}
                  </div>
                </div>
                {info.description ? (
                  <TokenCollapsedDescription description={info.description} />
                ) : null}
              </div>
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
                      network={chainId}
                      supportedNetworks={POOL_SUPPORTED_NETWORKS}
                      unsupportedNetworkHref="/ethereum/explore/pools"
                      className="lg:hidden block"
                    />
                    <TableFiltersFarmsOnly />
                    <TableFiltersSmartPoolsOnly />
                    <TableFiltersResetButton />
                  </div>
                  <PoolsTable
                    chainId={chainId}
                    {...(token.symbol && {
                      tokenSymbols: [token.symbol],
                    })}
                  />
                </Container>
              </PoolsFiltersStateProvider>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
