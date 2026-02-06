import type { PortfolioWalletToken } from '@sushiswap/graph-client/data-api'
import { Currency, FormattedNumber, classNames } from '@sushiswap/ui'
import React, { useMemo, type FC } from 'react'
import { formatPercent, formatUSD } from 'sushi'
import {
  type EvmChainId,
  EvmNative,
  EvmToken,
  isEvmAddress,
  isEvmChainId,
} from 'sushi/evm'
import {
  type SvmChainId,
  SvmNative,
  SvmToken,
  svmAddress,
  svmNativeAddress,
} from 'sushi/svm'
import { PortfolioInfoRow } from '../portfolio-info-row'

interface PortfolioTokensListProps {
  tokens: PortfolioWalletToken[]
}

export const PortfolioTokensList: FC<PortfolioTokensListProps> = ({
  tokens,
}) => (
  <div className="overflow-y-auto h-full cursor-default">
    {tokens.map((token) => {
      const currency = useMemo(() => {
        if (isEvmChainId(token.chainId) && !isEvmAddress(token.id)) {
          return EvmNative.fromChainId(token.chainId as EvmChainId)
        } else if (isEvmChainId(token.chainId)) {
          return new EvmToken({
            chainId: token.chainId as EvmChainId,
            address: token.id as `0x${string}`,
            decimals: token.decimals,
            symbol: token.symbol,
            name: token.name,
          })
        } else if (token.id === svmNativeAddress) {
          return SvmNative.fromChainId(token.chainId as SvmChainId)
        } else {
          return new SvmToken({
            chainId: token.chainId as SvmChainId,
            address: svmAddress(token.id),
            decimals: token.decimals,
            symbol: token.symbol,
            name: token.name,
          })
        }
      }, [token.chainId, token.id, token.decimals, token.symbol, token.name])

      return (
        <PortfolioInfoRow
          key={`${token.chainId}:${token.id}`}
          chainId={token.chainId as EvmChainId | SvmChainId}
          icon={<Currency.Icon currency={currency} width={28} height={28} />}
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
