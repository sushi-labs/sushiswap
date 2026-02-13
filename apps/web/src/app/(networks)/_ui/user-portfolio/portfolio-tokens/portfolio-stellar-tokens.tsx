import {
  FormattedNumber,
  SkeletonCircle,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import { Fragment, useMemo } from 'react'
import { useAccount } from 'src/lib/wallet'
import { formatPercent, formatUSD } from 'sushi'
import type { StellarChainId } from 'sushi/stellar'
import { useStablePrice } from '~stellar/_common/lib/hooks/price/use-stable-price'
import { getStellarPortfolioWallet } from '~stellar/_common/lib/hooks/token/get-stellar-portfolio-wallet'
import { TokenIcon } from '~stellar/_common/ui/General/TokenIcon'
import { PortfolioInfoRow } from '../portfolio-info-row'

function usePortfolioStellarWallet(
  address: `G${string}` | undefined,
  refetchInterval?: 600_000,
) {
  return useQuery({
    queryKey: ['portfolio-wallet-stellar', address],
    queryFn: async () => {
      if (!address) return null
      const data = await getStellarPortfolioWallet(address)
      return data
    },
    enabled: !!address,
    refetchInterval,
  })
}

type PortfolioStellarWalletToken = NonNullable<
  ReturnType<typeof usePortfolioStellarWallet>['data']
>[number]

export const PortfolioStellarTokens = () => {
  const account = useAccount('stellar')

  const { data, isLoading, isError } = usePortfolioStellarWallet(account)
  //need StellarToken and amountUSD support to use PortfolioTokensList
  return (
    <div className="flex flex-col h-[calc(100%-50px)] overflow-hidden">
      {!account ? (
        <div className="text-xs italic text-center text-muted-foreground">
          No Stellar account connected.
        </div>
      ) : isError ? // Hide skeletons + hide tokens list on error
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
      ) : data?.length ? (
        data?.map((token, idx) => (
          <_TokenRow
            key={`${token.chainId}:${token.id}:${idx}`}
            token={token}
          />
        ))
      ) : null}
    </div>
  )
}

const _TokenRow = ({ token }: { token: PortfolioStellarWalletToken }) => {
  //not ideal, currently no price api for stellar
  const { data: tokenPrice } = useStablePrice({ token: token.token })

  const _amountUsd = useMemo(() => {
    return tokenPrice ? token.amount * tokenPrice : 0
  }, [token.amount, tokenPrice])

  return (
    <PortfolioInfoRow
      key={`${token.chainId}:${token.id}`}
      chainId={token.chainId as StellarChainId}
      icon={<TokenIcon width={28} height={28} currency={token.token} />}
      leftContent={
        <Fragment>
          <div className="text-sm font-medium overflow-hidden overflow-ellipsis">
            {token.name ?? token.symbol}
          </div>
          <div className="text-xs text-muted-foreground overflow-hidden overflow-ellipsis">
            <FormattedNumber number={token.amount.toString()} /> {token.symbol}
          </div>
        </Fragment>
      }
      rightContent={
        <Fragment>
          <div className="text-sm font-medium overflow-hidden overflow-ellipsis">
            {formatUSD(_amountUsd)}
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
        </Fragment>
      }
    />
  )
}
