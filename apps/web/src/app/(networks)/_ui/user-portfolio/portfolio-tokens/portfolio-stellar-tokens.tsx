import {
  Currency,
  FormattedNumber,
  SkeletonCircle,
  SkeletonText,
} from '@sushiswap/ui'
import { Fragment, useMemo } from 'react'
import { useMyTokens } from 'src/lib/wagmi/components/token-selector/hooks/use-my-tokens'
import { useAccount } from 'src/lib/wallet'
import { type Amount, formatPercent, formatUSD } from 'sushi'
import { StellarChainId, type StellarToken } from 'sushi/stellar'
import { useCurrencyPrice } from '~evm/_common/ui/price-provider/price-provider/use-currency-price'
import { PortfolioInfoRow } from '../portfolio-info-row'

export const PortfolioStellarTokens = () => {
  const account = useAccount('stellar')
  const { data, isLoading, isError } = useMyTokens({
    chainId: StellarChainId.STELLAR,
    account,
  })

  const tokens = useMemo(() => {
    return data.tokens.flatMap((token) => {
      const balance = data.balanceMap?.get(token.address)
      if (!balance || !balance.gt(0n)) return []

      return balance as Amount<StellarToken>
    })
  }, [data])

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
      ) : tokens.length ? (
        tokens.map((amount, idx) => (
          <_TokenRow
            key={`${amount.currency.chainId}:${amount.currency.address}:${idx}`}
            amount={amount}
          />
        ))
      ) : (
        <div className="text-xs italic text-center text-muted-foreground">
          No tokens found.
        </div>
      )}
    </div>
  )
}

const _TokenRow = ({ amount }: { amount: Amount<StellarToken> }) => {
  const token = amount.currency
  const { data: tokenPrice } = useCurrencyPrice({
    currency: token,
  })

  const amountUsd = tokenPrice ? Number(amount.toString()) * tokenPrice : 0

  return (
    <PortfolioInfoRow
      key={`${token.chainId}:${token.address}`}
      chainId={token.chainId}
      icon={
        <Currency.Icon disableLink width={28} height={28} currency={token} />
      }
      leftContent={
        <Fragment>
          <div className="text-sm font-medium overflow-hidden overflow-ellipsis">
            {token.symbol}
          </div>
          <div className="text-xs text-muted-foreground overflow-hidden overflow-ellipsis">
            <FormattedNumber number={amount.toString()} /> {token.symbol}
          </div>
        </Fragment>
      }
      rightContent={
        <Fragment>
          <div className="text-sm font-medium overflow-hidden overflow-ellipsis">
            {formatUSD(amountUsd)}
          </div>
        </Fragment>
      }
    />
  )
}
