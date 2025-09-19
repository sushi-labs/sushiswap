import type { SearchToken } from '@sushiswap/graph-client/data-api'
import type { PinnedTokenId } from '@sushiswap/hooks'
import { Button, Collapsible, classNames } from '@sushiswap/ui'
import { useState } from 'react'
import { getChangeSign, getTextColor } from 'src/lib/helpers'
import { useSwapTokenSelect } from 'src/lib/hooks/useTokenSelect'
import { formatNumber, formatPercent, formatUSD } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import { EvmToken } from 'sushi/evm'
import { formatUnits } from 'viem'
import { FavoriteButton } from '../favorite-button'
import { TokenNetworkIcon } from '../token-network-icon'
import { SearchItemBridgeView } from './search-item-bridge-view'

export const SearchItem = ({ token }: { token: SearchToken }) => {
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

  const priceUsd = token.priceUSD ?? 0
  const balance = formatUnits(BigInt(token.balance ?? '0'), token.decimals)
  const balanceUsd = token.balanceUSD ?? 0
  const price24h = (token.priceChange1d ?? 0) / 100

  return (
    <>
      <div
        className={classNames(
          'grid col-span-4 grid-cols-[30px_200px_auto_auto] py-2 pr-2 rounded-lg',
          isHovered && 'bg-[#4217FF14] dark:bg-[#FFFFFF14]',
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <FavoriteButton
          currencyId={
            `${token.chainId}:${token.address}:${token?.symbol}` as PinnedTokenId
          }
        />
        <TokenNetworkIcon token={token} />
        {isHovered ? (
          <div className="flex items-center col-span-4 gap-2 px-8 mt-3 md:col-span-2 md:mt-0 md:ml-auto md:px-0">
            <ActionButtons token={token} />
            {token?.bridgeInfo?.length > 0 ? (
              <Button
                onClick={() => {
                  toggleBridgeView('open')
                }}
                size="xs"
                className="text-slate-50 w-full md:w-fit !rounded-full bg-blue font-semibold"
              >
                Bridge
              </Button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="flex flex-col items-end justify-center text-slate-900 dark:text-[#FFF5FA] w-[80px] ml-auto">
              <span>{formatUSD(priceUsd)}</span>
              <span
                className={classNames(
                  'font-medium text-xs ',
                  getTextColor(price24h, 'text-muted-foreground'),
                )}
              >
                {`${getChangeSign(price24h)}${formatPercent(price24h)}`}
              </span>
            </div>

            <div className="ml-auto flex flex-col items-end text-slate-900 dark:text-[#FFF5FA] w-[109px]">
              <span>{formatUSD(balanceUsd)}</span>
              <span className="font-medium text-muted-foreground">
                {formatNumber(balance)} {token.symbol}
              </span>
            </div>
          </>
        )}
      </div>
      <div className="col-span-4">
        <Collapsible open={isBridgeViewOpen}>
          <SearchItemBridgeView
            token={token}
            toggleBridgeView={toggleBridgeView}
          />
        </Collapsible>
      </div>
    </>
  )
}

const ActionButtons = ({
  token,
  onClose,
}: { token: SearchToken; onClose?: () => void }) => {
  const { handleTokenInput, handleTokenOutput } = useSwapTokenSelect()

  return (
    <div className="flex items-center justify-end w-full col-span-5 gap-2 md:col-span-2">
      <Button
        onClick={async () => {
          await handleTokenOutput({
            token: new EvmToken({
              chainId: token.chainId as EvmChainId,
              address: token.address,
              decimals: token.decimals,
              symbol: token.symbol,
              name: token.name,
            }),
          })
          onClose?.()
        }}
        size="xs"
        className="text-slate-50 w-full md:w-fit !rounded-full bg-green-500 font-semibold hover:bg-green-500 active:bg-green-500/95 focus:bg-green-500"
      >
        BUY
      </Button>

      <Button
        onClick={async () => {
          await handleTokenInput({
            token: new EvmToken({
              chainId: token.chainId as EvmChainId,
              address: token.address,
              decimals: token.decimals,
              symbol: token.symbol,
              name: token.name,
            }),
          })
          onClose?.()
        }}
        size="xs"
        className="text-slate-50 w-full md:w-fit bg-red-100 !rounded-full font-semibold hover:bg-red-100 active:bg-red-100/95 focus:bg-red-500"
      >
        SELL
      </Button>
    </div>
  )
}
