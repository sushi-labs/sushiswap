import type { PortfolioWalletToken } from '@sushiswap/graph-client/data-api'
import { FormattedNumber, classNames } from '@sushiswap/ui'
import React, { type FC } from 'react'
import { formatPercent, formatUSD } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import { PortfolioInfoRow } from '../PortfolioInfoRow'

interface PortfolioTokensListProps {
  tokens: PortfolioWalletToken[]
}

export const PortfolioTokensList: FC<PortfolioTokensListProps> = ({
  tokens,
}) => (
  <div className="overflow-y-auto h-full cursor-default">
    {tokens.map((token) => {
      return (
        <PortfolioInfoRow
          key={`${token.chainId}:${token.id}`}
          chainId={token.chainId as EvmChainId}
          icon={
            <img
              className="rounded-full"
              src={token.logoUrl}
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
                {`${token.price24hChange > 0 ? '+' : ''}${formatPercent(
                  token.price24hChange,
                )}`}
              </div>
            </React.Fragment>
          }
        />
      )
    })}
  </div>
)
