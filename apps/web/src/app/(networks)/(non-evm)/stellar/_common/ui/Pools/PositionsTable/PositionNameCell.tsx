import {
  Currency,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
} from '@sushiswap/ui'
import { formatFee } from '~stellar/_common/lib/utils/format'
import { TokenIcon } from '~stellar/_common/ui/General/TokenIcon'
import type { IPositionRowData } from './PositionsTable'

export const PositionNameCell = ({ data }: { data: IPositionRowData }) => {
  const { token0, token1, fee } = data

  return (
    <div className="flex items-center gap-1">
      <div className="flex min-w-[54px]">
        <Currency.IconList iconWidth={26} iconHeight={26}>
          <TokenIcon currency={token0} />
          <TokenIcon currency={token1} />
        </Currency.IconList>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {token0.code}
          <span className="font-normal text-gray-900 dark:text-slate-500">
            /
          </span>
          {token1.code}
          <div
            className={classNames(
              'text-[10px] bg-gray-200 dark:bg-slate-700 rounded-lg px-1 ml-1',
            )}
          />
        </span>
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] px-2 rounded-full">
                  {formatFee(fee)}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Swap fee</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>{' '}
      </div>
    </div>
  )
}
