import { getPortfolioWallet } from '@sushiswap/graph-client/data-api'
import { FormattedNumber, SkeletonText, classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { formatPercent, formatUSD } from 'sushi/format'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

function usePortfolioWallet(
  address: Address | undefined,
  refetchInterval?: 600_000,
) {
  return useQuery({
    queryKey: ['portfolio-wallet', address],
    queryFn: async () => {
      const id = address as string
      const data = await getPortfolioWallet({ id })
      return data
    },
    enabled: !!address,
    refetchInterval,
  })
}

export const PortfolioTokens = () => {
  const { address } = useAccount()
  const { data, isLoading } = usePortfolioWallet(address)

  return (
    <div className="flex flex-col gap-y-5 h-full">
      <div className="px-5">
        <div className="bg-secondary rounded-xl px-5 py-3">
          <span className="text-sm text-muted-foreground">Total Balance</span>
          <div className="">
            {isLoading ? (
              <>
                <SkeletonText />
                <SkeletonText />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatUSD(data!.totalUSD)}
                </div>
                <div
                  className={classNames(
                    'text-sm',
                    data!.amountUSD24Change > 0
                      ? 'text-green'
                      : data!.amountUSD24Change < 0
                        ? 'text-red'
                        : 'text-muted-foreground',
                  )}
                >
                  {`${data!.amountUSD24Change > 0 ? '+' : ''}${formatUSD(
                    data!.amountUSD24Change,
                  )} (${formatPercent(data!.percentageChange24h)})`}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-y-auto h-full cursor-default">
        {data?.tokens.map((token) => {
          return (
            <div className="flex justify-between items-center hover:bg-muted px-4 py-3 gap-x-4">
              <div className="flex gap-x-2 items-center whitespace-nowrap overflow-hidden">
                <div className="relative">
                  <div className="h-7 w-7">
                    <img
                      className="rounded-full"
                      src={token.logoUrl}
                      width={28}
                      height={28}
                      alt={token.symbol ?? token.name}
                    />
                  </div>
                  <NetworkIcon
                    chainId={token.chainId}
                    className="-right-1 bottom-0 absolute border rounded-full border-background"
                    height={14}
                    width={14}
                  />
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-medium overflow-ellipsis overflow-hidden">
                    {token.name ?? token.symbol}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    <FormattedNumber number={token.amount.toString()} />{' '}
                    {token.symbol}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {formatUSD(token.amountUSD)}
                </div>
                <div
                  className={classNames(
                    'text-xs',
                    token.price24hChange > 0
                      ? 'text-green'
                      : token.price24hChange < 0
                        ? 'text-red'
                        : 'text-muted-foreground',
                  )}
                >
                  {`${token.price24hChange > 0 ? '+' : ''}${formatPercent(
                    token.price24hChange,
                  )}`}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
