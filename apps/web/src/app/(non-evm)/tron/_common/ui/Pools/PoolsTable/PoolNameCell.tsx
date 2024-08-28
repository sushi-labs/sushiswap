import { Currency, SkeletonText, classNames } from '@sushiswap/ui'
import { useTokenInfo } from '~tron/_common/lib/hooks/useTokenInfo'
import { getBase58Address } from '~tron/_common/lib/utils/helpers'
import { Icon } from '../../General/Icon'
import { IRowData } from './PoolsTable'

export const PoolNameCell = ({ data }: { data: IRowData }) => {
  const { token0Address, token1Address } = data
  const { data: token0Data, isLoading: isLoadingToken0 } = useTokenInfo({
    tokenAddress: getBase58Address(token0Address),
  })

  const { data: token1Data, isLoading: isLoadingToken1 } = useTokenInfo({
    tokenAddress: getBase58Address(token1Address),
  })

  return (
    <div className="flex items-center gap-1">
      <div className="flex min-w-[54px]">
        {token0Address && token1Address && (
          <Currency.IconList iconWidth={26} iconHeight={26}>
            <Icon currency={token0Data} />
            <Icon currency={token1Data} />
          </Currency.IconList>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {isLoadingToken0 ? (
            <SkeletonText className="!w-10" fontSize="default" />
          ) : (
            token0Data?.symbol
          )}
          <span className="font-normal text-gray-900 dark:text-slate-500">
            /
          </span>
          {isLoadingToken1 ? (
            <SkeletonText className="!w-10" fontSize="default" />
          ) : (
            token1Data?.symbol
          )}
          <div
            className={classNames(
              'text-[10px] bg-gray-200 dark:bg-slate-700 rounded-lg px-1 ml-1',
            )}
          />
        </span>
      </div>
    </div>
  )
}
