import { ArrowUpIcon } from '@heroicons/react-v1/solid'
import type { SearchToken } from '@sushiswap/graph-client/data-api'
import { Badge, Currency, LinkExternal } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { getChainById } from 'sushi'
import { type EvmChainId, shortenEvmAddress } from 'sushi/evm'
import { EvmToken } from 'sushi/evm'

export const TokenNetworkIcon = ({ token }: { token: SearchToken }) => {
  return (
    <div className="flex items-center gap-3.5 w-full">
      <Badge
        className="border border-slate-200 dark:border-slate-750 rounded-[4px] z-[11] -right-[17%] bottom-[2%]"
        position="bottom-right"
        badgeContent={
          <NetworkIcon
            type="square"
            className="rounded-[3px]"
            chainId={token?.chainId as EvmChainId}
            width={15}
            height={15}
          />
        }
      >
        <Currency.Icon
          disableLink
          currency={
            new EvmToken({
              address: token?.address,
              name: token?.name,
              symbol: token?.symbol,
              chainId: token?.chainId as EvmChainId,
              decimals: token?.decimals,
            })
          }
          width={32}
          height={34}
        />
      </Badge>
      <div className="flex flex-col items-start">
        <div className="text-xs font-semibold dark:text-pink-100">
          {token?.symbol}
        </div>
        <LinkExternal
          href={getChainById(token?.chainId as EvmChainId).getTokenUrl(
            token?.address,
          )}
          className="text-xs flex items-center gap-0.5 !text-muted-foreground dark:text-pink-200"
        >
          {shortenEvmAddress(token?.address)}
          <ArrowUpIcon width={10} height={10} className="rotate-45" />
        </LinkExternal>
      </div>
    </div>
  )
}
