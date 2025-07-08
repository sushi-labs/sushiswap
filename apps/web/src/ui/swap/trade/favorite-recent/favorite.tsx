import type { SearchToken } from '@sushiswap/graph-client/data-api'
import { type PinnedTokenId, usePinnedTokens } from '@sushiswap/hooks'
import { Button, SkeletonBox, SkeletonCircle, classNames } from '@sushiswap/ui'
import { useCallback } from 'react'
import { getChangeSign, getTextColor } from 'src/lib/helpers'
import { useFavorites } from 'src/lib/hooks/useFavorites'
import { getNetworkKey } from 'src/lib/network'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { TokenSelectorV2 } from 'src/lib/wagmi/components/token-selector/token-selector-v2'
import { formatUSD } from 'sushi'
import type { EvmChainId } from 'sushi/chain'
import type { Type } from 'sushi/currency'
import { WNATIVE } from 'sushi/currency'
import { formatNumber, formatPercent } from 'sushi/format'
import { getAddress } from 'viem'
import { useAccount } from 'wagmi'
import { FavoriteButton } from '../favorite-button'
import { TokenNetworkIcon } from '../token-network-icon'
import { useNetworkContext } from './network-provider'

export const Favorite = () => {
  const { address } = useAccount()
  const { favorites, isLoading, isError } = useFavorites()
  const {
    state: { selectedNetwork },
  } = useNetworkContext()

  const { hasToken, mutate } = usePinnedTokens()

  const onSelect = useCallback(
    (_token: Type) => {
      const currencyId: PinnedTokenId = `${_token?.id}:${_token?.symbol}`
      const isOnList = !currencyId ? false : hasToken(currencyId)
      if (!currencyId) return
      mutate(isOnList ? 'remove' : 'add', currencyId)
    },
    [hasToken, mutate],
  )

  if (!address) {
    return <ConnectButton className="w-full" variant="secondary" />
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array(5)
            .fill(null)
            .map((_, idx) => (
              <FavoriteSkeleton key={idx} />
            ))}
        </div>
      ) : isError ? (
        <div className="text-center text-sm text-red mt-4">
          An error occurred loading favorites
        </div>
      ) : favorites?.length !== 0 ? (
        <table className="w-full">
          <thead className="sticky top-0 z-[19] bg-slate-50 dark:bg-slate-900 md:dark:bg-slate-800">
            <tr className="text-xs text-slate-700 dark:text-pink-100">
              <th />
              <th className="font-medium text-left">Token</th>
              <th className="hidden font-medium text-left md:table-cell">
                Price
              </th>
              <th className="hidden font-medium text-left md:table-cell">
                24h%
              </th>
              <th className="table-cell font-medium text-left md:hidden">
                Price/24%
              </th>
              <th className="font-medium text-right">Holdings</th>
            </tr>
          </thead>
          <tbody>
            {favorites?.map((token, idx) => (
              <FavoriteItem token={token} key={idx} />
            ))}
          </tbody>
        </table>
      ) : null}
      <div className="flex flex-col items-center justify-center w-full gap-4 mt-6">
        <TokenSelectorV2
          selected={undefined}
          chainId={1}
          selectedNetwork={
            selectedNetwork ? (selectedNetwork as EvmChainId) : undefined
          }
          onSelect={onSelect}
          includeNative={true}
          hidePinnedTokens={false}
          isBrowse={true}
          type="buy"
        >
          <Button variant="secondary" className="w-full">
            Browse Tokens
          </Button>
        </TokenSelectorV2>
        {!isLoading && !isError && favorites?.length === 0 ? (
          <p className="text-sm italic text-muted-foreground dark:text-pink-200">
            You haven&apos;t selected any favorite tokens{' '}
            {selectedNetwork
              ? `on ${getNetworkKey(selectedNetwork as EvmChainId)}`
              : ''}
            .
          </p>
        ) : null}
      </div>
    </div>
  )
}

const FavoriteItem = ({ token }: { token: SearchToken }) => {
  const wrappedAddress = WNATIVE[Number(token.chainId) as EvmChainId].address
  return (
    <tr className="text-xs">
      <td className="max-w-[35px] py-3 md:py-4">
        <FavoriteButton
          currencyId={`${token.chainId}:${
            token.address === wrappedAddress
              ? 'NATIVE'
              : getAddress(token.address)
          }:${token.symbol}`}
        />
      </td>
      <td>
        <TokenNetworkIcon token={token} />
      </td>
      <td className="hidden md:table-cell">
        <span className="text-slate-900 dark:text-pink-100">
          {formatUSD(token.priceUSD)}
        </span>
      </td>
      <td className="hidden md:table-cell">
        <span
          className={classNames(
            'font-medium',
            getTextColor(token.priceChange1d),
          )}
        >
          {getChangeSign(token.priceChange1d)}
          {formatPercent(token.priceChange1d / 100)}
        </span>
      </td>

      <td className="table-cell text-left md:hidden">
        <div className="flex flex-col items-start">
          <span className="text-slate-900 dark:text-pink-100">
            {formatUSD(token.priceUSD)}
          </span>
          <span
            className={classNames(
              'font-medium',
              getTextColor(token.priceChange1d),
            )}
          >
            {getChangeSign(token.priceChange1d)}
            {formatPercent(token.priceChange1d / 100)}
          </span>
        </div>
      </td>
      <td className="">
        <div className="flex flex-col items-end ml-auto">
          <span className="text-slate-900 dark:text-pink-100 !font-medium">
            {formatUSD(token.balanceUSD)}
          </span>
          <span className="text-muted-foreground">
            {formatNumber(token.balance)} {token.symbol}
          </span>
        </div>
      </td>
    </tr>
  )
}

const FavoriteSkeleton = () => {
  return (
    <div className="text-xs flex items-center gap-2 justify-between">
      <div className="max-w-[25px] py-3 md:py-4">
        <SkeletonBox className="w-3 h-3 rounded-sm" />
      </div>
      <div className="flex items-center gap-3.5">
        <div className="relative">
          <SkeletonCircle radius={32} />
          <SkeletonBox className="w-3 h-3 rounded-sm absolute -right-[3%] -bottom-[3%]" />
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <SkeletonBox className="w-10 h-3 rounded-sm" />
          <SkeletonBox className="w-24 h-3 rounded-sm" />
        </div>
      </div>
      <div className="hidden md:block">
        <SkeletonBox className="w-12 h-3 rounded-sm" />
      </div>
      <div className="hidden md:block">
        <span className={classNames('font-medium')}>
          <SkeletonBox className="w-12 h-3 rounded-sm" />
        </span>
      </div>

      <div className="block text-left md:hidden mx-auto">
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-slate-900 dark:text-pink-100">
            <SkeletonBox className="w-10 h-3 rounded-sm" />
          </span>
          <span className={classNames('font-medium')}>
            <SkeletonBox className="w-6 h-3 rounded-sm" />
          </span>
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-0.5 items-end ml-auto">
          <span className="text-slate-900 dark:text-pink-100 !font-medium">
            <SkeletonBox className="w-12 md:w-16 h-3 rounded-sm" />
          </span>
          <span className="text-muted-foreground">
            <SkeletonBox className="w-16 md:w-20 h-3 rounded-sm" />
          </span>
        </div>
      </div>
    </div>
  )
}
