import { ArrowUpIcon, StarIcon } from '@heroicons/react-v1/solid'
import {
  Badge,
  Button,
  Collapsible,
  Currency,
  LinkExternal,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useState } from 'react'
import { shortenAddress } from 'sushi'
import { Token } from 'sushi/currency'
import { formatNumber, formatUSD } from 'sushi/format'

export const SearchItem = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isBridgeViewOpen, setIsBridgeViewOpen] = useState(false)

  const toggleBridgeView = (value: 'open' | 'close') => {
    if (value === 'open') {
      if (isBridgeViewOpen) return
      setIsBridgeViewOpen(true)
      setIsHovered(false)
    }
    if (value === 'close') {
      setIsBridgeViewOpen(false)
    }
  }

  return (
    <>
      <div
        className={classNames(
          'grid col-span-4 grid-cols-[30px_auto_auto_auto] py-2 pr-2 rounded-lg',
          isHovered && 'bg-blue-500/10',
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <FavoriteButton />
        <div className="flex items-center gap-3.5">
          <Badge
            className="border border-slate-50 dark:border-slate-900 rounded-full z-[11]"
            position="bottom-right"
            badgeContent={<NetworkIcon chainId={1} width={16} height={16} />}
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
            <div className="text-sm font-semibold">SUSHI</div>
            <LinkExternal
              href="https://etherscan.io/token/0x6b3595068778dd592e39a122f4f5a5cf09c90fe2"
              className="text-xs flex items-center gap-0.5 !text-muted-foreground"
            >
              {shortenAddress('0x6b3595068778dd592e39a122f4f5a5cf09c90fe2')}
              <ArrowUpIcon width={10} height={10} className="rotate-45" />
            </LinkExternal>
          </div>
        </div>
        {isHovered ? (
          <div className="col-span-2 gap-2 ml-auto items-center flex ">
            <Button
              size="xs"
              className="text-slate-50 !rounded-full bg-green-500 font-semibold hover:bg-green-500 active:bg-green-500/95 focus:bg-green-500"
            >
              BUY
            </Button>
            <Button
              size="xs"
              className="text-slate-50 bg-red-100 !rounded-full font-semibold hover:bg-red-100 active:bg-red-100/95 focus:bg-red-500"
            >
              SELL
            </Button>
            <Button
              onClick={() => {
                toggleBridgeView('open')
              }}
              size="xs"
              className="text-slate-50 !rounded-full bg-blue font-semibold"
            >
              Bridge
            </Button>
          </div>
        ) : (
          <>
            <div className="mx-auto flex flex-col items-end text-slate-900 dark:text-[#FFF5FA]">
              <span>{formatUSD(0.87)}</span>
              <span className="font-medium text-red">-5.5%</span>
            </div>

            <div className="ml-auto flex flex-col items-end text-slate-900 dark:text-[#FFF5FA]">
              <span>{formatUSD(16232.5)}</span>
              <span className="font-medium text-muted-foreground">
                {formatNumber(82.2)} SUSHI
              </span>
            </div>
          </>
        )}
      </div>
      <div className="col-span-4">
        <Collapsible open={isBridgeViewOpen}>
          {/* TODO: make this its own component file */}
          <div
            className={classNames(
              'grid col-span-4 grid-cols-[30px_auto_auto_auto] border border-black/5 dark:border-white/5 py-3 px-4 rounded-lg bg-skyblue/10',
            )}
          >
            <div className="flex w-full col-span-4 flex-col gap-4">
              <div>TODO: bridge info</div>
              <div className="flex items-center gap-5">
                <Button
                  className="w-1/2"
                  size="sm"
                  variant="secondary"
                  onClick={() => toggleBridgeView('close')}
                >
                  Close
                </Button>
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => toggleBridgeView('close')}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </Collapsible>
      </div>
    </>
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

const FavoriteButton = () => {
  const [isFavorited, setIsFavorited] = useState(false)
  const toggleFavorite = () => {
    setIsFavorited((prev) => !prev)
  }
  return (
    <button
      className={classNames(
        'text-[#0000001F] dark:text-[#FFFFFF1F] p-2 hover:text-black/20 dark:hover:text-white/20 rounded-full flex items-center justify-center',
        'transition-colors duration-200 ease-in-out',
      )}
      onClick={toggleFavorite}
      aria-label="Toggle Favorite"
      type="button"
    >
      <StarIcon
        width={16}
        height={16}
        className={classNames(isFavorited ? 'text-yellow' : '')}
      />
    </button>
  )
}
