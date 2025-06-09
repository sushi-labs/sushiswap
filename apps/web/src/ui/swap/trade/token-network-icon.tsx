import { ArrowUpIcon } from '@heroicons/react-v1/solid'
import { Badge, Currency, LinkExternal } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { shortenAddress } from 'sushi'
import { Token } from 'sushi/currency'

export const TokenNetworkIcon = () => {
  return (
    <div className="flex items-center gap-3.5 w-full">
      <Badge
        className="border border-slate-50 dark:border-slate-900 rounded-[4px] z-[11]"
        position="bottom-right"
        badgeContent={
          <NetworkIcon
            type="square"
            className="rounded-[3px]"
            chainId={1}
            width={14}
            height={14}
          />
        }
      >
        <Currency.Icon
          disableLink
          currency={
            new Token({
              address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
              name: 'SushiToken',
              symbol: 'SUSHI',
              chainId: 1,
              decimals: 18,
            })
          }
          width={32}
          height={32}
        />
      </Badge>
      <div className="flex flex-col items-start">
        <div className="text-sm font-semibold dark:text-pink-100">SUSHI</div>
        <LinkExternal
          href="https://etherscan.io/token/0x6b3595068778dd592e39a122f4f5a5cf09c90fe2"
          className="text-xs flex items-center gap-0.5 !text-muted-foreground dark:text-pink-200"
        >
          {shortenAddress('0x6b3595068778dd592e39a122f4f5a5cf09c90fe2')}
          <ArrowUpIcon width={10} height={10} className="rotate-45" />
        </LinkExternal>
      </div>
    </div>
  )
}
