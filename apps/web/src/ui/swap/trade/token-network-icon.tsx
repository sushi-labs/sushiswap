import { ArrowUpIcon } from '@heroicons/react-v1/solid'
import type { SearchToken } from '@sushiswap/graph-client/data-api'
import { Badge, Currency, LinkExternal } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { type EvmChainId, evmChains, shortenAddress } from 'sushi'
import { Token } from 'sushi/currency'

export const TokenNetworkIcon = ({ token }: { token?: SearchToken }) => {
  return (
    <div className="flex items-center gap-3.5 w-full">
      <Badge
        className="border border-slate-50 dark:border-slate-900 rounded-[4px] z-[11]"
        position="bottom-right"
        badgeContent={
          <NetworkIcon
            type="square"
            className="rounded-[3px]"
            // @TODO: fix this once we have the correct type
            chainId={(token?.chainId as EvmChainId) ?? 1}
            width={14}
            height={14}
          />
        }
      >
        <Currency.Icon
          disableLink
          currency={
            new Token({
              address:
                token?.address ?? '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
              name: token?.name ?? 'SushiToken',
              symbol: token?.symbol ?? 'SUSHI',
              // @TODO: fix this once we have the correct type
              chainId: (token?.chainId as EvmChainId) ?? 1,
              decimals: token?.decimals ?? 18,
            })
          }
          width={32}
          height={32}
        />
      </Badge>
      <div className="flex flex-col items-start">
        <div className="text-xs font-semibold dark:text-pink-100">
          {token?.symbol ?? 'SUSHI'}
        </div>
        <LinkExternal
          // @TODO: fix this once we have the correct type
          href={evmChains[(token?.chainId as EvmChainId) ?? 1].getTokenUrl(
            token?.address ?? '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
          )}
          className="text-xs flex items-center gap-0.5 !text-muted-foreground dark:text-pink-200"
        >
          {shortenAddress(
            token?.address ?? '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
          )}
          <ArrowUpIcon width={10} height={10} className="rotate-45" />
        </LinkExternal>
      </div>
    </div>
  )
}
