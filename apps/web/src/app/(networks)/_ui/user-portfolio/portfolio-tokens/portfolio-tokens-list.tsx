import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import type { PortfolioWalletToken } from '@sushiswap/graph-client/data-api'
import {
  Currency,
  FormattedNumber,
  IconButton,
  classNames,
} from '@sushiswap/ui'
import React, { useCallback, useMemo, useState } from 'react'
import { useWallets } from 'src/lib/wallet/hooks/use-wallets'
import {
  ChainId,
  formatPercent,
  formatUSD,
  getChainById,
  getNativeAddress,
} from 'sushi'
import {
  EvmChainId,
  EvmNative,
  EvmToken,
  SUSHI,
  USDC,
  evmNativeAddress,
  isEvmAddress,
  isEvmChainId,
} from 'sushi/evm'
import {
  StellarToken,
  isStellarChainId,
  isStellarContractAddress,
} from 'sushi/stellar'
import {
  type SvmChainId,
  SvmNative,
  SvmToken,
  isSvmAddress,
  isSvmChainId,
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
  if (isEvmChainId(token.chainId) && isEvmAddress(token.address)) {
    if (token.address === getNativeAddress(token.chainId)) {
      return EvmNative.fromChainId(token.chainId)
    }

    return new EvmToken({
      chainId: token.chainId,
      address: token.address,
      decimals: token.decimals,
      symbol: token.symbol,
      name: token.name,
    })
  } else if (isSvmChainId(token.chainId) && isSvmAddress(token.address)) {
    if (token.address === getNativeAddress(token.chainId)) {
      return SvmNative.fromChainId(token.chainId as SvmChainId)
    }

    return new SvmToken({
      chainId: token.chainId,
      address: token.address,
      decimals: token.decimals,
      symbol: token.symbol,
      name: token.name,
    })
  } else if (
    isStellarChainId(token.chainId) &&
    isStellarContractAddress(token.address)
  ) {
    return new StellarToken({
      chainId: token.chainId,
      address: token.address,
      decimals: token.decimals,
      symbol: token.symbol,
      name: token.name,
    })
  }
}

const nativeAddressAliases = {
  [ChainId.CELO]: '0x471ece3750da237f93b8e339c536989b8978a438',
  [ChainId.MANTLE]: '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000',
  [ChainId.POLYGON]: '0x0000000000000000000000000000000000001010',
} as Partial<Record<ChainId, `0x${string}`>>

function hasSushiToken(chainId: ChainId): chainId is keyof typeof SUSHI {
  return Object.hasOwn(SUSHI, chainId)
}

function getToken0Param(
  token: PortfolioWalletToken,
  currency: ReturnType<typeof getCurrency>,
): string {
  if (hasSushiToken(token.chainId)) {
    return ''
  }

  if (token.chainId === EvmChainId.ARC && token.address === evmNativeAddress) {
    return `token0=${USDC[token.chainId].address}`
  }
  if (nativeAddressAliases?.[token.chainId]) {
    return `token0=NATIVE`
  }
  if (currency?.type === 'native') {
    return `token0=NATIVE`
  }
  return `token0=${token.address}`
}

function getToken1Param(token: PortfolioWalletToken): string {
  if (hasSushiToken(token.chainId)) {
    return `token1=${SUSHI[token.chainId].address}`
  }
  return ''
}

function getTokenParams(
  token: PortfolioWalletToken,
  currency: ReturnType<typeof getCurrency>,
): string {
  return `${getToken0Param(token, currency)}${getToken1Param(token)}`
}

export function PortfolioTokensList({
  tokens: _tokens,
  onTransferConfirmed,
}: PortfolioTokensListProps) {
  const wallets = useWallets()
  const [selectedCurrency, setSelectedCurrency] = useState<NonNullable<
    ReturnType<typeof getCurrency>
  > | null>(null)
  const handleDialogOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) setSelectedCurrency(null)
  }, [])

  const tokens = useMemo(
    () =>
      _tokens.flatMap((token) => {
        const currency = getCurrency(token)
        if (!currency) return []

        return {
          currency,
          onSend: () => setSelectedCurrency(currency),
          token,
        }
      }),
    [_tokens],
  )

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain cursor-default">
        {tokens.map(({ currency, onSend, token }) => {
          const canSend = Boolean(
            (isEvmChainId(currency.chainId) && wallets.evm?.account) ||
              (isSvmChainId(currency.chainId) && wallets.svm?.account) ||
              (isStellarChainId(currency.chainId) && wallets.stellar?.account),
          )

          const url = `/${getChainById(token.chainId).key}/swap?${getTokenParams(token, currency)}`

          return (
            <PortfolioInfoRow
              chainId={token.chainId}
              key={`${token.chainId}:${token.address}`}
              href={url}
              icon={
                <Currency.Icon currency={currency} width={28} height={28} />
              }
              leftContent={
                <React.Fragment>
                  <div className="text-sm font-medium overflow-hidden overflow-ellipsis max-w-[120px]">
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
                  {canSend ? (
                    <IconButton
                      size="xs"
                      variant="ghost"
                      icon={PaperAirplaneIcon}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSend()
                      }}
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
