import { getPortfolioWallet } from '@sushiswap/graph-client/data-api'
import { SkeletonCircle, SkeletonText, classNames } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useAccounts } from 'src/lib/wallet/hooks/use-accounts'
import { formatPercent, formatUSD } from 'sushi'
import { PortfolioTokensList } from './portfolio-tokens-list'

function usePortfolioWallet(
  addresses: {
    evmAddress: ReturnType<typeof useAccounts>['evm']['address']
    svmAddress: ReturnType<typeof useAccounts>['svm']['address']
  },
  refetchInterval?: 600_000,
) {
  return useQuery({
    queryKey: ['portfolio-wallet', addresses],
    queryFn: async () => {
      if (!addresses.evmAddress && !addresses.svmAddress) return null
      const data = await getPortfolioWallet(addresses)
      return data
    },
    enabled: !!addresses.evmAddress || !!addresses.svmAddress,
    refetchInterval,
  })
}

export const PortfolioEvmSvmTokens = () => {
  const { evm, svm } = useAccounts()

  const addresses = useMemo(
    () => ({ evmAddress: evm.address, svmAddress: svm.address }),
    [evm.address, svm.address],
  )

  const { data, isLoading, isError, refetch } = usePortfolioWallet(addresses)

  const handleTransferConfirmed = useCallback(async (): Promise<void> => {
    await refetch()
  }, [refetch])

  return (
    <div className="flex flex-col gap-y-5 h-[calc(100%-180px)] overflow-hidden">
      <div className="px-5">
        <div className="flex flex-col gap-y-3 bg-secondary rounded-xl px-5 py-3">
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
                  {formatUSD(data?.totalUSD ?? 0)}
                </div>

                {isError ? (
                  <div className="text-xs italic text-red-500">
                    An error occurred fetching token balances.
                  </div>
                ) : (
                  <div
                    className={classNames(
                      'text-sm',
                      (data?.amountUSD24Change ?? 0) > 0
                        ? 'text-green'
                        : (data?.amountUSD24Change ?? 0) < 0
                          ? 'text-red'
                          : 'text-muted-foreground',
                    )}
                  >
                    {`${(data?.amountUSD24Change ?? 0) > 0 ? '+' : ''}${formatUSD(
                      data?.amountUSD24Change ?? 0,
                    )} (${formatPercent(data?.percentageChange24h ?? 0)})`}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* TOKEN LIST SECTION */}
      {isError ? // Hide skeletons + hide tokens list on error
      null : isLoading ? (
        <div>
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
      ) : data?.tokens?.length ? (
        <PortfolioTokensList
          tokens={data.tokens}
          onTransferConfirmed={handleTransferConfirmed}
        />
      ) : null}
    </div>
  )
}
