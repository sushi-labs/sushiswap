import { Currency } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { APRHoverCard } from 'src/ui/pool/APRHoverCard'
import { ProtocolBadge } from 'src/ui/pool/PoolNameCell'
import { SUSHI, USDC } from 'sushi/currency'
import { formatNumber } from 'sushi/format'
import type { SushiSwapProtocol } from 'sushi/types'
import { RangeBadge } from './range-badge'

const token0 = SUSHI[1]
const token1 = USDC[1]

export const ManageDialogHeader = ({ data }: { data: any }) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Currency.IconList
            iconWidth={32}
            iconHeight={32}
            className="border-[#FFFFFF14] -mr-1"
          >
            <Currency.Icon currency={token0} />
            <Currency.Icon currency={token1} />
          </Currency.IconList>
          <div className="border-[#E8E7EB] dark:border-[#222137] border rounded-[4px] overflow-hidden z-10 absolute bottom-[1px] -right-1">
            <NetworkIcon type="square" chainId={1} className="w-3 h-3" />
          </div>
        </div>
        <div className="flex flex-col items-start">
          <span className="font-medium text-sm">{`${token0.symbol}-${token1.symbol}`}</span>
          <div className="flex items-center gap-1">
            <ProtocolBadge
              protocol={data.protocol as SushiSwapProtocol}
              showFullName={false}
            />
            <div className="bg-[#F4F5F6] text-muted-foreground dark:bg-[#1E293B] dark:text-pink-200 text-xs px-2.5 py-1 rounded-full">
              {formatNumber(data.swapFee * 100)}%
            </div>
          </div>
        </div>
      </div>
      {data?.protocol === 'SUSHISWAP_V3' ? (
        <RangeBadge range="IN_RANGE" />
      ) : null}
      <div
        className={
          'bg-skyblue/10 font-medium dark:bg-blue/10 px-2 py-1 text-xs flex items-center gap-1 rounded-full'
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
    </div>
  )
}
