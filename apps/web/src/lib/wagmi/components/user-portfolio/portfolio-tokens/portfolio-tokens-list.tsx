import type { PortfolioWalletToken } from '@sushiswap/graph-client/data-api'
import { Currency, FormattedNumber, classNames } from '@sushiswap/ui'
import React, { type FC } from 'react'
import { formatPercent, formatUSD } from 'sushi'
import { type EvmChainId, EvmNative, EvmToken, isEvmAddress } from 'sushi/evm'
import { PortfolioInfoRow } from '../portfolio-info-row'

interface PortfolioTokensListProps {
  tokens: PortfolioWalletToken[]
}

export const PortfolioTokensList: FC<PortfolioTokensListProps> = ({
  tokens,
}) => (
  <div className="overflow-y-auto h-full cursor-default">
    {tokens.map((token) => {
      const isNative = !isEvmAddress(token.id) //for native tokens, the id is the chainname in lowercase

      return (
        <PortfolioInfoRow
          key={`${token.chainId}:${token.id}`}
          chainId={token.chainId as EvmChainId}
          icon={
            <Currency.Icon
              currency={
                isNative
                  ? EvmNative.fromChainId(token.chainId as EvmChainId)
                  : new EvmToken({
                      chainId: token.chainId as EvmChainId,
                      address: token.id as `0x${string}`,
                      decimals: token.decimals,
                      symbol: token.symbol,
                      name: token.name,
                    })
              }
              width={28}
              height={28}
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
