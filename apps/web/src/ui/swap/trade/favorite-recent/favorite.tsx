import { usePinnedTokens } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui'
import { useCallback, useMemo } from 'react'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { TokenSelectorV2 } from 'src/lib/wagmi/components/token-selector/token-selector-v2'
import { formatUSD } from 'sushi'
import type { Address, ID } from 'sushi'
import type { Type } from 'sushi/currency'
import { formatNumber } from 'sushi/format'
import { useAccount } from 'wagmi'
import { FavoriteButton } from '../favorite-button'
import { TokenNetworkIcon } from '../token-network-icon'
// import { useSearchTokens } from "src/lib/hooks/react-query/search-tokens/useSearchTokens";
// import { NativeAddress } from "src/lib/constants";
// import { TokenListV2ChainId } from "@sushiswap/graph-client/data-api";

export const Favorite = () => {
  const { address } = useAccount()
  const { data: _pinnedTokens } = usePinnedTokens()

  //@DEV commented out until the backend is fixed
  // const { tokens, uniqueChainIds } = useMemo(() => {
  // 	const tokens = Object.values(_pinnedTokens)
  // 		.flat()
  // 		.map((i) => {
  // 			const currencyId = i;
  // 			const chainId = currencyId?.split(":")[0];
  // 			const _contractAddress = currencyId?.split(":")[1];
  // 			const contractAddress = _contractAddress === "NATIVE" ? NativeAddress : _contractAddress;

  // 			return {
  // 				// chainId: Number(chainId) as TokenListV2ChainId,
  // 				chainId: Number(chainId) as unknown,
  // 				address: contractAddress as Address,
  // 			};
  // 		});
  // 	const uniqueChainIds = Array.from(new Set(tokens.map((token) => Number(token.chainId))));

  // 	return { tokens, uniqueChainIds };
  // }, [_pinnedTokens]);

  // const {
  // 	data: favorites,
  // 	isLoading,
  // 	isError,
  // } = useSearchTokens({
  // 	walletAddress: address,
  // 	chainIds: uniqueChainIds as TokenListV2ChainId[],
  // 	search: "",
  // 	tokens: tokens,
  // });

  const pinnedTokensArray = useMemo(() => {
    return Object.values(_pinnedTokens)
      .flat()
      .map((i) => {
        const currencyId = i
        const chainId = currencyId?.split(':')[0]
        const contractAddress = currencyId?.split(':')[1]
        const isNative = currencyId === 'NATIVE'
        return {
          currencyId,
          chainId,
          contractAddress,
          isNative,
        }
      })
  }, [_pinnedTokens])

  const onSelect = useCallback((token: Type) => {
    // Handle token selection
    console.log('Selected token:', token)
  }, [])

  if (!address) {
    return <ConnectButton className="w-full" variant="secondary" />
  }

  return (
    <div>
      {pinnedTokensArray?.length !== 0 ? (
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
            {pinnedTokensArray?.map((i, idx) => (
              <FavoriteItem currencyId={i.currencyId as ID} key={idx} />
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
        {pinnedTokensArray?.length === 0 ? (
          <p className="text-sm italic text-muted-foreground dark:text-pink-200">
            You haven&apos;t selected any favorite tokens.
          </p>
        ) : null}
      </div>
    </div>
  )
}

const FavoriteItem = ({ currencyId }: { currencyId: ID }) => {
  return (
    <tr className="text-xs">
      <td className="max-w-[25px] py-3 md:py-4">
        <FavoriteButton currencyId={currencyId} />
      </td>
      <td>
        <TokenNetworkIcon />
      </td>
      <td className="hidden md:table-cell">
        <span className="text-slate-900 dark:text-pink-100">
          {formatUSD(0.87)}
        </span>
      </td>
      <td className="hidden md:table-cell">
        <span className="font-medium text-[#1DA67D]">+5.5%</span>
      </td>

      <td className="table-cell text-left md:hidden">
        <div className="flex flex-col items-start">
          <span className="text-slate-900 dark:text-pink-100">
            {formatUSD(0.87)}
          </span>
          <span className="font-medium text-[#1DA67D]">+5.5%</span>
        </div>
      </td>
      <td className="">
        <div className="flex flex-col items-end ml-auto">
          <span className="text-slate-900 dark:text-pink-100 !font-medium">
            {formatUSD(16232.5)}
          </span>
          <span className="text-muted-foreground">
            {formatNumber(82.2)} SUSHI
          </span>
        </div>
      </td>
    </tr>
  )
}

/* @DEV: FOR LATER WHEN WE HAVE DATA <div
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
	</div> */
