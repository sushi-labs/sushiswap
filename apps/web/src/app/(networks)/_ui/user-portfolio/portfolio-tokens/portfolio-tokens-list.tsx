import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import type { PortfolioWalletToken } from '@sushiswap/graph-client/data-api'
import {
  Currency,
  FormattedNumber,
  IconButton,
  classNames,
} from '@sushiswap/ui'
import React, { useCallback, useMemo, useState } from 'react'
import { useWallets } from 'src/lib/wallet'
import { formatPercent, formatUSD, getNativeAddress } from 'sushi'
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
} from 'sushi/svm'
import { formatUnits } from 'viem'
import { BalanceProvider } from '~evm/_common/ui/balance-provider/balance-provider'
import { PortfolioInfoRow } from '../portfolio-info-row'
import { SendTokenDialog } from './send-token-dialog'

interface PortfolioTokensListProps {
  tokens: PortfolioWalletToken[]
  onTransferConfirmed(): Promise<void>
}
const getCurrency = (token: PortfolioWalletToken) => {
  if (isEvmChainId(token.chainId)) {
    if (token.address === getNativeAddress(token.chainId)) {
      return EvmNative.fromChainId(token.chainId)
    }

    if (!isEvmAddress(token.address)) return null

    return new EvmToken({
      chainId: token.chainId,
      address: token.address,
      decimals: token.decimals,
      symbol: token.symbol,
      name: token.name,
    })
  } else if (isSvmChainId(token.chainId)) {
    if (token.address === getNativeAddress(token.chainId)) {
      return SvmNative.fromChainId(token.chainId as SvmChainId)
    }

    return new SvmToken({
      chainId: token.chainId as SvmChainId,
      address: svmAddress(token.address),
      decimals: token.decimals,
      symbol: token.symbol,
      name: token.name,
    })
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
  onTransferConfirmed,
}: PortfolioTokensListProps) {
  const wallets = useWallets()
  const [selectedCurrency, setSelectedCurrency] = useState<NonNullable<
    ReturnType<typeof getCurrency>
  > | null>(null)
  const handleSelectCurrency = useCallback(
    (currency: NonNullable<ReturnType<typeof getCurrency>>) => {
      setSelectedCurrency(currency)
    },
    [],
  )
  const handleDialogOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) setSelectedCurrency(null)
  }, [])

  const tokens = useMemo(
    () =>
      _tokens.map((token) => {
        const currency = getCurrency(token)

        return {
          currency,
          onSend: currency ? () => handleSelectCurrency(currency) : undefined,
          token,
        }
      }),
    [_tokens, handleSelectCurrency],
  )

  return (
    <>
      <div className="overflow-y-auto h-full cursor-default">
        {tokens.map(({ currency, onSend, token }) => {
          const canSend = Boolean(
            currency &&
              ((isEvmChainId(currency.chainId) && wallets.evm?.account) ||
                (isSvmChainId(currency.chainId) && wallets.svm?.account)),
          )

          return (
            <PortfolioInfoRow
              key={`${token.chainId}:${token.id}`}
              chainId={
                token.chainId as EvmChainId | SvmChainId | StellarChainId
              }
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
                    <FormattedNumber
                      number={formatUnits(
                        BigInt(token.balance),
                        token.decimals,
                      )}
                    />{' '}
                    {token.symbol}
                  </div>
                </React.Fragment>
              }
              rightContent={
                <div className="flex items-center justify-end gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium overflow-hidden overflow-ellipsis">
                      {formatUSD(token.amountUSD ?? 0)}
                    </div>
                    <div
                      className={classNames(
                        'text-xs',
                        (token.price24hChange ?? 0) > 0
                          ? 'text-green'
                          : (token.price24hChange ?? 0) < 0
                            ? 'text-red'
                            : 'text-muted-foreground',
                      )}
                    >
                      {`${(token.price24hChange ?? 0) > 0 ? '+' : ''}${formatPercent(
                        token.price24hChange ?? 0,
                      )}`}
                    </div>
                  </div>
                  {canSend && currency ? (
                    <IconButton
                      size="xs"
                      variant="ghost"
                      icon={PaperAirplaneIcon}
                      onClick={onSend}
                      description={`Send ${currency.symbol ?? 'token'}`}
                      name={`Send ${currency.symbol ?? 'token'}`}
                    />
                  ) : null}
                </div>
              }
            />
          )
        })}
      </div>
      {selectedCurrency ? (
        <BalanceProvider>
          <SendTokenDialog
            currency={selectedCurrency}
            open
            onOpenChange={handleDialogOpenChange}
            onTransferConfirmed={onTransferConfirmed}
          />
        </BalanceProvider>
      ) : null}
    </>
  )
}
