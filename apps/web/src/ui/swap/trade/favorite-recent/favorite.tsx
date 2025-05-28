import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { formatUSD } from 'sushi'
import { formatNumber } from 'sushi/format'
import { useAccount } from 'wagmi'
import { FavoriteButton } from '../favorite-button'
import { TokenNetworkIcon } from '../token-network-icon'
// import { Button } from "@sushiswap/ui";

export const Favorite = () => {
  const { address } = useAccount()

  if (!address) {
    return <ConnectButton className="w-full" variant="secondary" />
  }

  // if(favorites.length === 0) {
  // return (
  // 	<div className="flex items-center justify-center w-full flex-col gap-4 mt-8">
  // 		<Button
  // 			onClick={() => {
  // 				alert("TODO: Build browse tokens component");
  // 			}}
  // 			variant="secondary"
  // 			className="w-full">
  // 			Browse Tokens
  // 		</Button>
  // 		<p className="italic text-sm text-muted-foreground dark:text-pink-200">
  // 			You haven&apos;t selected any favorite tokens.
  // 		</p>
  // 	</div>
  // );
  // }

  return (
    <table className="w-full">
      <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-slate-900 md:dark:bg-slate-800">
        <tr className="text-xs text-slate-700 dark:text-pink-100">
          <th />
          <th className="text-left font-medium">Token</th>
          <th className="text-left font-medium hidden md:table-cell">Price</th>
          <th className="text-left font-medium hidden md:table-cell">24h%</th>
          <th className="font-medium text-left table-cell md:hidden">
            Price/24%
          </th>
          <th className="text-right font-medium">Holdings</th>
        </tr>
      </thead>
      <tbody className="">
        <FavoriteItem />
        <FavoriteItem />
        <FavoriteItem />
        <FavoriteItem />
        <FavoriteItem />
        <FavoriteItem />
        <FavoriteItem />
        <FavoriteItem />
        <FavoriteItem />
        <FavoriteItem />
        <FavoriteItem />
        <FavoriteItem />
        <FavoriteItem />
        <FavoriteItem />
      </tbody>
    </table>
  )
}

const FavoriteItem = () => {
  return (
    <tr className="text-xs">
      <td className="max-w-[25px] py-3 md:py-4">
        <FavoriteButton />
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
        <span className="font-medium text-green">+5.5%</span>
      </td>

      <td className="table-cell md:hidden text-left">
        <div className="flex flex-col items-start">
          <span className="text-slate-900 dark:text-pink-100">
            {formatUSD(0.87)}
          </span>
          <span className="font-medium text-green">+5.5%</span>
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
