import type {
  SearchToken,
  TokenListV2ChainId,
} from '@sushiswap/graph-client/data-api'
import { usePinnedTokens } from '@sushiswap/hooks'
import { Button, SkeletonBox, SkeletonCircle, classNames } from '@sushiswap/ui'
import { useCallback, useMemo } from 'react'
import { NativeAddress } from 'src/lib/constants'
import { getChangeSign, getTextColor } from 'src/lib/helpers'
import { useSearchTokens } from 'src/lib/hooks/react-query/search-tokens/useSearchTokens'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { TokenSelectorV2 } from 'src/lib/wagmi/components/token-selector/token-selector-v2'
import { formatUSD } from 'sushi'
import type { Address } from 'sushi'
import type { Type } from 'sushi/currency'
import { formatNumber, formatPercent } from 'sushi/format'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { FavoriteButton } from '../favorite-button'
import { TokenNetworkIcon } from '../token-network-icon'

export const Favorite = () => {
  const { address } = useAccount()
  const { data: _pinnedTokens } = usePinnedTokens()

  const { tokens, uniqueChainIds } = useMemo(() => {
    const tokens = Object.values(_pinnedTokens)
      .flat()
      .map((i) => {
        const currencyId = i
        const chainId = currencyId?.split(':')[0]
        const _contractAddress = currencyId?.split(':')[1]
        const contractAddress =
          _contractAddress === 'NATIVE' ? NativeAddress : _contractAddress

        return {
          // chainId: Number(chainId) as TokenListV2ChainId,
          chainId: Number(chainId) as unknown,
          address: contractAddress as Address,
        }
      })
    const uniqueChainIds = Array.from(
      new Set(tokens.map((token) => Number(token.chainId))),
    )

    return { tokens, uniqueChainIds }
  }, [_pinnedTokens])

  const {
    data: favorites,
    isLoading,
    isError,
  } = useSearchTokens({
    walletAddress: address,
    chainIds: uniqueChainIds as TokenListV2ChainId[],
    search: '',
    tokens: tokens,
  })

  const onSelect = useCallback((token: Type) => {
    // Handle token selection
    console.log('Selected token:', token)
  }, [])

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
          <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-slate-900 md:dark:bg-slate-800">
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
      <div className="flex flex-col items-center justify-center w-full gap-4 mt-8">
        <TokenSelectorV2
          selected={undefined}
          chainId={1}
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
            You haven&apos;t selected any favorite tokens.
          </p>
        ) : null}
      </div>
    </div>
  )
}

const FavoriteItem = ({ token }: { token: SearchToken }) => {
  return (
    <tr className="text-xs">
      <td className="max-w-[25px] py-3 md:py-4">
        <FavoriteButton currencyId={`${token.chainId}:${token.address}`} />
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
            {formatNumber(formatUnits(BigInt(token.balance), token.decimals))}{' '}
            {token.symbol}
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
