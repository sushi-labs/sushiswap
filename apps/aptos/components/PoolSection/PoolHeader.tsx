import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { LinkExternal } from '@sushiswap/ui'
import { Icon } from 'components/Icon'
import { IconList } from 'components/IconList'
import { providerNetwork } from 'lib/constants'
import { FC } from 'react'
import { Pool } from 'utils/usePools'
import { useTokensFromPools } from 'utils/useTokensFromPool'

interface PoolHeader {
  row: Pool
}

const CONTRACT_ADDRESS =
  process.env['NEXT_PUBLIC_SWAP_CONTRACT'] ||
  process.env['NEXT_PUBLIC_SWAP_CONTRACT']

export const PoolHeader: FC<PoolHeader> = ({ row }) => {
  const { token0, token1 } = useTokensFromPools(row)
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex gap-2">
            <IconList iconWidth={44} iconHeight={44}>
              <Icon currency={token0} />
              <Icon currency={token1} />
            </IconList>
            <LinkExternal
              className="flex flex-col !no-underline group"
              href={`https://explorer.aptoslabs.com/account/${CONTRACT_ADDRESS}/coins?network=${providerNetwork}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold flex items-center gap-1 text-gray-900 dark:text-slate-50 group-hover:text-blue-400">
                  {token0.symbol} / {token1.symbol}
                  <ArrowTopRightOnSquareIcon height={20} width={20} />
                </span>
              </div>
              <span className="text-xs text-gray-600 dark:text-slate-300">
                Fee: {'0.00%'}
              </span>
            </LinkExternal>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 dark:text-slate-400 sm:text-right">
              APR:{' '}
              <span className="font-semibold text-gray-900 dark:text-slate-50">
                {'0.00%'}
              </span>
            </span>
            <div className="flex gap-2">
              <span className="text-sm text-gray-600 dark:text-slate-400">
                Rewards: {'0.00%'}
              </span>
              <span className="text-sm text-gray-600 dark:text-slate-400">
                Fees: {'0.00%'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex gap-3 p-3 bg-white rounded-lg dark:bg-slate-800">
          <Icon currency={token0} width={20} height={20} />
          <span className="text-sm text-gray-600 dark:text-slate-300">
            {token0.symbol} = {'$0.00'}
          </span>
        </div>
        <div className="flex gap-3 p-3 bg-white rounded-lg dark:bg-slate-800">
          <Icon currency={token1} width={20} height={20} />
          <span className="text-sm text-gray-600 dark:text-slate-300">
            {token1.symbol} = {'$0.00'}
          </span>
        </div>
      </div>
    </div>
  )
}
