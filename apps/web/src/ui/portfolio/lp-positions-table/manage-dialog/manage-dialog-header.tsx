import { Currency } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { formatNumber } from 'sushi'
import { SUSHI, type SushiSwapProtocol, USDC } from 'sushi/evm'
import { APRHoverCard } from '~evm/[chainId]/_ui/apr-hover-card'
import { ProtocolBadge } from '~evm/[chainId]/_ui/protocol-badge'
import { RangeBadge } from './range-badge'

const token0 = SUSHI[1]
const token1 = USDC[1]

export const ManageDialogHeader = ({
  data,
  hideApr,
}: { data: any; hideApr?: boolean }) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Currency.IconList
            iconWidth={32}
            iconHeight={32}
            className="!border-0"
          >
            <Currency.Icon currency={token0} />
            <Currency.Icon currency={token1} />
          </Currency.IconList>
          <div className="border-[#E8E7EB] dark:border-[#252A3C] border rounded-[4px] overflow-hidden z-10 absolute -bottom-0.5 -right-1.5">
            <NetworkIcon type="square" chainId={1} className="w-3 h-3" />
          </div>
        </div>
        <div className="flex flex-col items-start">
          <span className="font-medium text-sm">{`${token0.symbol}-${token1.symbol}`}</span>
          <div className="flex items-center gap-1">
            {/* @TODO remove typecast once data is typed */}
            {ProtocolBadge[data.protocol as SushiSwapProtocol]}
            <div className="bg-[#F4F5F6] text-muted-foreground dark:bg-[#1E293B] dark:text-pink-200 text-xs px-2.5 py-1 rounded-full">
              {formatNumber(data.swapFee * 100)}%
            </div>
          </div>
        </div>
      </div>
      {data?.protocol === 'SUSHISWAP_V3' ? (
        <RangeBadge range="IN_RANGE" />
      ) : null}
      {hideApr ? null : (
        <div
          className={
            'bg-skyblue/10 font-medium dark:bg-[#8A80FF08] px-2 py-1 text-xs flex items-center gap-1 rounded-full'
          }
        >
          <APRHoverCard pool={data}>
            <div className="flex items-center gap-1">
              <span>APR: </span>
              <span className="underline decoration-dotted underline-offset-2">
                {formatNumber(data.apr)}%
              </span>
              {data?.rewards?.map((i: any, idx: number) => (
                <Currency.Icon
                  key={idx}
                  currency={i.token}
                  width={14}
                  height={14}
                />
              ))}
            </div>
          </APRHoverCard>
        </div>
      )}
    </div>
  )
}
