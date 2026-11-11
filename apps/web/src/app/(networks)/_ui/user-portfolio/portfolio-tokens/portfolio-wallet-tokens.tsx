import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { getPortfolioWallet } from '@sushiswap/graph-client/data-api'
import {
  SkeletonBox,
  SkeletonCircle,
  SkeletonText,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useCallback, useMemo, useState } from 'react'
import { useAccounts } from 'src/lib/wallet/hooks/use-accounts'
import { formatPercent, formatUSD } from 'sushi'
import { getPortfolioTokenTotals } from './get-portfolio-token-totals'
import { NetworkFilter, type NetworkFilterType } from './network-filter'
import { PortfolioTokensList } from './portfolio-tokens-list'

function usePortfolioWallet(
  addresses: {
    evmAddress: ReturnType<typeof useAccounts>['evm']['address']
    svmAddress: ReturnType<typeof useAccounts>['svm']['address']
    stellarAddress: ReturnType<typeof useAccounts>['stellar']['address']
  },
  refetchInterval = ms('10m'),
) {
  return useQuery({
    queryKey: ['portfolio-wallet', addresses],
    queryFn: async () => {
      if (
        !addresses.evmAddress &&
        !addresses.svmAddress &&
        !addresses.stellarAddress
      )
        return null
      const data = await getPortfolioWallet(addresses)
      return data
    },
    enabled:
      !!addresses.evmAddress ||
      !!addresses.svmAddress ||
      !!addresses.stellarAddress,
    refetchInterval,
  })
}

export function PortfolioWalletTokens() {
  const { evm, svm, stellar } = useAccounts()
  const [selectedChainId, setSelectedChainId] =
    useState<NetworkFilterType>('All')
  const [search, setSearch] = useState('')
  const addresses = useMemo(
    () => ({
      evmAddress: evm.address,
      svmAddress: svm.address,
      stellarAddress: stellar.address,
    }),
    [evm.address, svm.address, stellar.address],
  )

  const { data, isLoading, isError, refetch } = usePortfolioWallet(addresses)

  const uniqueChainIds = useMemo(() => {
    if (!data) return []
    const chainIds = data.tokens.map((token) => token.chainId)
    return Array.from(new Set(chainIds))
  }, [data])

  const {
    filteredTokens,
    filteredTotalUsd,
    filteredAmountUSD24Change,
    filteredPercentageChange24h,
  } = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filteredTokens =
      data?.tokens.filter((token) => {
        const matchesSearch =
          token.name.toLowerCase().includes(query) ||
          token.symbol.toLowerCase().includes(query) ||
          token.address.toLowerCase().includes(query)
        const matchesChainId =
          selectedChainId === 'All' || token.chainId === selectedChainId
        return matchesSearch && matchesChainId
      }) ?? []

    const {
      totalUSD: filteredTotalUsd,
      amountUSD24Change,
      percentageChange24h,
    } = getPortfolioTokenTotals(filteredTokens)
    if (!query && selectedChainId === 'All') {
      return {
        filteredTokens,
        filteredTotalUsd,
        filteredAmountUSD24Change: data?.amountUSD24Change ?? null,
        filteredPercentageChange24h: data?.percentageChange24h ?? null,
      }
    }

    return {
      filteredTokens,
      filteredTotalUsd,
      filteredAmountUSD24Change: amountUSD24Change,
      filteredPercentageChange24h: percentageChange24h,
    }
  }, [data, search, selectedChainId])

  const handleTransferConfirmed = useCallback(async (): Promise<void> => {
    await refetch()
  }, [refetch])

  return (
    <div className="flex flex-col gap-y-4">
      <div className="shrink-0 px-7 pt-4">
        <div className="flex flex-col">
          <span className="sr-only">Total Balance</span>

          <div className="flex flex-col gap-y-1">
            {isLoading && !data && !isError ? (
              <>
                <SkeletonBox className="!h-12 !w-1/2" />
                <SkeletonBox className="!h-6 !w-1/2" />
              </>
            ) : (
              <>
                <div className="text-4xl font-medium">
                  {formatUSD(filteredTotalUsd)}
                </div>

                {isError ? (
                  <div className="text-xs italic text-red-500">
                    An error occurred fetching token balances.
                  </div>
                ) : (
                  <div
                    className={classNames(
                      'text-sm tabular-nums',
                      (filteredAmountUSD24Change ?? 0) > 0
                        ? 'text-green'
                        : (filteredAmountUSD24Change ?? 0) < 0
                          ? 'text-red'
                          : 'text-muted-foreground',
                    )}
                  >
                    {filteredAmountUSD24Change === null
                      ? '24h change unavailable'
                      : `${filteredAmountUSD24Change > 0 ? '+' : ''}${formatUSD(
                          filteredAmountUSD24Change,
                        )} (${
                          filteredPercentageChange24h === null
                            ? '—'
                            : formatPercent(filteredPercentageChange24h)
                        })`}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-2 px-5">
        <TextField
          type="text"
          aria-label="Search tokens"
          placeholder="Search tokens"
          icon={MagnifyingGlassIcon}
          wrapperClassName="min-w-0"
          className="!bg-muted !border-0 !rounded-lg !font-normal text-base placeholder:text-muted-foreground"
          onChange={(event) => setSearch(event.target.value)}
          value={search}
        />
        <NetworkFilter
          options={['All', ...uniqueChainIds]}
          selectedChainId={selectedChainId}
          onSelectChainId={setSelectedChainId}
        />
      </div>

      {/* TOKEN LIST SECTION */}
      {isError ? // Hide skeletons + hide tokens list on error
      null : isLoading ? (
        <div>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex min-h-[60px] w-full items-center px-7 py-2 gap-x-6"
            >
              <SkeletonCircle radius={36} />
              <div className="flex w-full justify-between items-center gap-x-3">
                <div className="basis-3/4 flex flex-col gap-y-1">
                  <SkeletonText fontSize="sm" />
                  <SkeletonText fontSize="xs" />
                </div>
                <div className="basis-1/4 flex flex-col gap-y-1">
                  <SkeletonText fontSize="sm" />
                  <SkeletonText fontSize="xs" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredTokens.length ? (
        <PortfolioTokensList
          tokens={filteredTokens}
          onTransferConfirmed={handleTransferConfirmed}
        />
      ) : (
        <div className="px-7 py-3 text-sm text-muted-foreground">
          No tokens found.
        </div>
      )}
    </div>
  )
}
