import { ArrowRightIcon } from '@heroicons/react-v1/solid'
import { Button, Collapsible, classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useState } from 'react'
import { formatNumber, formatUSD } from 'sushi/format'
import { ChainOptionsSelector } from '../../chain-options-selector'
import { FavoriteButton } from '../favorite-button'
import { TokenNetworkIcon } from '../token-network-icon'

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
          'grid col-span-4 grid-cols-[30px_200px_auto_auto] py-2 pr-2 rounded-lg',
          isHovered && 'bg-blue-500/10',
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <FavoriteButton />
        <TokenNetworkIcon />
        {isHovered ? (
          <div className="flex items-center col-span-4 gap-2 px-8 mt-3 md:col-span-2 md:mt-0 md:ml-auto md:px-0">
            <Button
              size="xs"
              className="text-slate-50 w-full md:w-fit !rounded-full bg-green-500 font-semibold hover:bg-green-500 active:bg-green-500/95 focus:bg-green-500"
            >
              BUY
            </Button>
            <Button
              size="xs"
              className="text-slate-50 w-full md:w-fit bg-red-100 !rounded-full font-semibold hover:bg-red-100 active:bg-red-100/95 focus:bg-red-500"
            >
              SELL
            </Button>
            <Button
              onClick={() => {
                toggleBridgeView('open')
              }}
              size="xs"
              className="text-slate-50 w-full md:w-fit !rounded-full bg-blue font-semibold"
            >
              Bridge
            </Button>
          </div>
        ) : (
          <>
            <div className="mx-auto flex flex-col w-full items-end text-slate-900 dark:text-[#FFF5FA]">
              <span>{formatUSD(0.87)}</span>
              <span className="font-medium text-red">-5.5%</span>
            </div>

            <div className="ml-auto w-full flex flex-col items-end text-slate-900 dark:text-[#FFF5FA]">
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
            <div className="flex flex-col w-full col-span-4 gap-4">
              <div className="flex items-end gap-2">
                <div className="flex flex-col items-start justify-between h-full gap-2 pb-1">
                  <span className="text-slate-450 dark:text-slate-500 text-[10px]">
                    Bridge From
                  </span>
                  <div className="flex items-center gap-1 font-medium text-muted-foreground">
                    <NetworkIcon
                      type="square"
                      className="rounded-[3px] border border-[#E8E7EB] dark:border-[#222137]"
                      chainId={1}
                      width={16}
                      height={16}
                    />
                    <span className="text-xs">Ethereum</span>
                  </div>
                </div>
                <div className="pb-1 ml-10 mr-3">
                  <ArrowRightIcon
                    width={16}
                    height={16}
                    className="text-slate-450 dark:text-slate-500"
                  />
                </div>
                <div className="flex flex-col items-start justify-between w-full h-full gap-2">
                  <span className="text-slate-450 dark:text-slate-500 text-[10px]">
                    Bridge To
                  </span>
                  <ChainOptionsSelector />
                </div>
              </div>
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
