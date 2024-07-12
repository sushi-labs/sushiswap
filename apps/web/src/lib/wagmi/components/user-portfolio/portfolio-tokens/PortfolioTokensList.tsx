import { PortfolioWalletToken } from '@sushiswap/graph-client/data-api'
import { Badge, FormattedNumber, classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import React, { FC } from 'react'
import { formatPercent, formatUSD } from 'sushi/format'

interface PortfolioTokensListProps {
  tokens: PortfolioWalletToken[]
}

export const PortfolioTokensList: FC<PortfolioTokensListProps> = ({
  tokens,
}) => (
  <div className="overflow-y-auto h-full cursor-default">
    {tokens.map((token) => {
      return (
        <div
          id={`${token.chainId}:${token.id}`}
          className="flex justify-between items-center hover:bg-muted px-5 py-3 gap-x-4"
        >
          <div className="flex gap-x-4 items-center whitespace-nowrap overflow-hidden">
            <div className="flex-shrink-0">
              <Badge
                className="border-1 border-background bg-background rounded-full"
                position="bottom-right"
                badgeContent={
                  <NetworkIcon chainId={token.chainId} width={14} height={14} />
                }
              >
                <img
                  className="rounded-full"
                  src={token.logoUrl}
                  width={28}
                  height={28}
                  alt={token.symbol ?? token.name}
                />
              </Badge>
            </div>
            <div className="overflow-hidden flex flex-col gap-y-1">
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
)
