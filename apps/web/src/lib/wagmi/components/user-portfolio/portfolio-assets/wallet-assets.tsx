import { FormattedNumber, classNames } from '@sushiswap/ui'
import React from 'react'
import { formatPercent, formatUSD } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import { useAccount } from 'wagmi'
import { usePortfolioWallet } from '../hooks/use-portfolio-wallet'
import { PortfolfioAccordion } from '../portfolio-accordion'
import { PortfolioInfoRowSkeleton } from '../portfolio-info-row-skeleton'
import type { PortfolioAssetsProps } from './portfolio-assets'
import { PortfolioInfoRow } from '../portfolio-info-row'

export const WalletAssets = (props: PortfolioAssetsProps) => {
  const { value, onValueChange } = props
  const { address } = useAccount()

  const { data, isError, isLoading } = usePortfolioWallet({ address })

  return (
    <PortfolfioAccordion
      value={value}
      onValueChange={onValueChange}
      accordionValue="wallet"
      triggerChildren={
        <>
          <span>Wallet</span>
          <span className="text-muted-foreground">
            {formatUSD(data?.totalUSD ?? 0)}
          </span>
        </>
      }
    >
      {isError ? (
        <div className="text-center text-red text-sm pt-4">
          Could Not Fetch Wallet Holdings
        </div>
      ) : isLoading ? (
        <PortfolioInfoRowSkeleton amount={12} />
      ) : data?.tokens.length === 0 ? (
        <div className="text-sm mt-2 text-[#64748B] text-center">
          No Tokens Found
        </div>
      ) : (
        data?.tokens?.map((token) => {
          return (
            <PortfolioInfoRow
              key={`${token.chainId}:${token.id}`}
              chainId={token.chainId as EvmChainId}
              icon={
                <img
                  className="rounded-full"
                  src={token?.logoUrl === '' ? undefined : token.logoUrl}
                  width={28}
                  height={28}
                  alt={token.symbol ?? token.name}
                />
              }
              leftContent={
                <React.Fragment>
                  <div className="text-sm font-medium overflow-hidden overflow-ellipsis">
                    {token.name ?? token.symbol}
                  </div>
                  <div className="text-xs text-muted-foreground overflow-hidden overflow-ellipsis">
                    <FormattedNumber number={token.amount.toString()} />{' '}
                    {token.symbol}
                  </div>
                </React.Fragment>
              }
              rightContent={
                <React.Fragment>
                  <div className="text-sm font-medium overflow-hidden overflow-ellipsis">
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
                    {`${token.price24hChange > 0 ? '+' : ''}${formatPercent(token.price24hChange)}`}
                  </div>
                </React.Fragment>
              }
            />
          )
        })
      )}
    </PortfolfioAccordion>
  )
}
