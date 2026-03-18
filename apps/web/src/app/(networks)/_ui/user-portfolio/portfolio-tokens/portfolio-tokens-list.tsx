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
import type { StellarChainId } from 'sushi/stellar'
import {
  type SvmChainId,
  SvmNative,
  SvmToken,
  isSvmChainId,
  svmAddress,
  svmNativeAddress,
} from 'sushi/svm'
import { PortfolioInfoRow } from '../portfolio-info-row'

interface PortfolioTokensListProps {
  tokens: PortfolioWalletToken[]
}
const getCurrency = (token: PortfolioWalletToken) => {
  if (isEvmChainId(token.chainId)) {
    if (!isEvmAddress(token.id)) {
      return EvmNative.fromChainId(token.chainId)
    } else {
      return new EvmToken({
        chainId: token.chainId,
        address: token.id,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name,
      })
    }
  } else if (isSvmChainId(token.chainId)) {
    if (token.id === svmNativeAddress) {
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
  } else {
    //stellar token goes here
    return null
    // return new StellarToken({
    //   chainId: token.chainId as StellarChainId,
    //   address: svmAddress(token.id),
    //   decimals: token.decimals,
    //   symbol: token.symbol,
    //   name: token.name,
    // })
  }
}

export function PortfolioTokensList({
  tokens: _tokens,
}: PortfolioTokensListProps) {
  const tokens = useMemo(
    () =>
      _tokens.map((token) => ({
        currency: getCurrency(token),
        token,
      })),
    [_tokens],
  )

  return (
    <div className="overflow-y-auto h-full cursor-default">
      {tokens.map(({ currency, token }) => {
        return (
          <PortfolioInfoRow
            key={`${token.chainId}:${token.id}`}
            chainId={token.chainId as EvmChainId | SvmChainId | StellarChainId}
            icon={
              currency ? (
                <Currency.Icon currency={currency} width={28} height={28} />
              ) : (
                <></>
              )
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
}
