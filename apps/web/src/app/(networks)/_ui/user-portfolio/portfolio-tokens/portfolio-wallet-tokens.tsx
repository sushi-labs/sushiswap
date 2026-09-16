import { getPortfolioWallet } from '@sushiswap/graph-client/data-api'
import {
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

    const filteredTotalUsd = filteredTokens.reduce(
      (acc, token) => acc + (token.amountUSD ?? 0),
      0,
    )
    if (!query && selectedChainId === 'All') {
      return {
        filteredTokens,
        filteredTotalUsd,
        filteredAmountUSD24Change: data?.amountUSD24Change ?? null,
        filteredPercentageChange24h: data?.percentageChange24h ?? null,
      }
    }

    // Use the API's dollar changes; missing history is not a zero change.
    const amountUSD24Change = filteredTokens.reduce<number | null>(
      (acc, token) =>
        acc === null || token.amountUSD24Change == null
          ? null
          : acc + token.amountUSD24Change,
      0,
    )
    const previousTotalUSD =
      amountUSD24Change !== null &&
      filteredTokens.every((token) => token.amountUSD !== null)
        ? filteredTotalUsd - amountUSD24Change
        : null
    const percentageChange24h =
      amountUSD24Change !== null &&
      previousTotalUSD !== null &&
      previousTotalUSD > 0
        ? amountUSD24Change / previousTotalUSD
        : null

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
    <div className="flex min-h-0 flex-1 flex-col gap-y-2 overflow-hidden">
      <div className="shrink-0 px-5">
        <div className="flex flex-col gap-y-3 bg-secondary rounded-xl px-5 py-3 border border-accent">
          <span className="text-sm text-muted-foreground">Total Balance</span>

          <div className="flex flex-col gap-y-2">
            {isLoading && !data && !isError ? (
              <>
                <SkeletonText fontSize="lg" className="!w-1/3" />
                <SkeletonText className="!w-1/2" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatUSD(filteredTotalUsd)}
                </div>

                {isError ? (
                  <div className="text-xs italic text-red-500">
                    An error occurred fetching token balances.
                  </div>
                ) : (
                  <div
                    className={classNames(
                      'text-sm',
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
          placeholder="Search by name, symbol, or address"
          className="bg-secondary !border !border-accent"
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
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex w-full items-center px-5 py-3 gap-x-5">
              <SkeletonCircle radius={28} />
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
        <div className="px-5 py-3 text-sm text-muted-foreground">
          No tokens found.
        </div>
      )}
    </div>
  )
}
