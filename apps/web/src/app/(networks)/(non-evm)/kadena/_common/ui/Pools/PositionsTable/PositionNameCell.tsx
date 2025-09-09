import { Currency, classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useBaseTokens } from '~kadena/_common/lib/hooks/use-base-tokens'
import type { WalletPosition } from '~kadena/_common/types/get-positions'
import { Icon } from '../../General/Icon'

export const PositionNameCell = ({ data }: { data: WalletPosition }) => {
  const { data: baseTokens } = useBaseTokens()
  const token0 = useMemo(() => {
    const _token0 = baseTokens?.find(
      (token) =>
        token?.tokenAddress?.toLowerCase() ===
        data.pair?.token0?.address?.toLowerCase(),
    )
    if (_token0) {
      return _token0
    }

    return {
      tokenAddress: data.pair.token0.address,
      tokenSymbol: data.pair.token0.name?.slice(0, 4)?.toUpperCase(),
      tokenDecimals: 12,
      tokenName: data.pair.token0.name,
      tokenImage: '',
    }
  }, [data.pair.token0, baseTokens])

  const token1 = useMemo(() => {
    const _token1 = baseTokens?.find(
      (token) =>
        token?.tokenAddress?.toLowerCase() ===
        data.pair?.token1?.address?.toLowerCase(),
    )
    if (_token1) {
      return _token1
    }

    return {
      tokenAddress: data.pair.token1.address,
      tokenSymbol: data.pair.token1.name?.slice(0, 4)?.toUpperCase(),
      tokenDecimals: 12,
      tokenName: data.pair.token1.name,
      tokenImage: '',
    }
  }, [data.pair.token1, baseTokens])

  return (
    <div className="flex items-center gap-1">
      <div className="flex min-w-[54px]">
        {token0 && token1 && (
          <Currency.IconList iconWidth={26} iconHeight={26}>
            <Icon currency={token0} />
            <Icon currency={token1} />
          </Currency.IconList>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {token0?.tokenSymbol}
          <span className="font-normal text-gray-900 dark:text-slate-500">
            /
          </span>
          {token1?.tokenSymbol}
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
