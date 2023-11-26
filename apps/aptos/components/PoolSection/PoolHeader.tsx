import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { AppearOnMount, Link, Typography } from '@sushiswap/ui'
import { IconList } from 'components/IconList'
import { Icon } from 'components/Icon'
import { FC } from 'react'
import { Pool } from 'utils/usePools'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { useNetwork } from 'utils/useNetwork'
import { networkNameToNetwork } from 'config/chains'

interface PoolHeader {
  row: Pool
}

export const PoolHeader: FC<PoolHeader> = ({ row }) => {
  const {
    network,
    contracts: { swap: swapContract },
  } = useNetwork()

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
            <Link.External
              className="flex flex-col !no-underline group"
              href={`https://explorer.aptoslabs.com/account/${swapContract}/coins?network=${networkNameToNetwork(
                network
              )}`}
            >
              <div className="flex items-center gap-2">
                <Typography
                  variant="lg"
                  className="flex items-center gap-1 text-gray-900 dark:text-slate-50 group-hover:text-blue-400"
                  weight={600}
                >
                  {token0.symbol} / {token1.symbol}
                  <ArrowTopRightOnSquareIcon height={20} width={20} />
                </Typography>
              </div>
              <Typography variant="xs" className="text-gray-600 dark:text-slate-300">
                Fee: {'0.00%'}
              </Typography>
            </Link.External>
          </div>
          <div className="flex flex-col gap-1">
            <Typography weight={400} as="span" className="text-gray-500 dark:text-slate-400 sm:text-right">
              APR: <span className="font-semibold text-gray-900 dark:text-slate-50">{'0.00%'}</span>
            </Typography>
            <div className="flex gap-2">
              {
                <Typography variant="sm" weight={400} as="span" className="text-gray-600 dark:text-slate-400">
                  Rewards: {'0.00%'}
                </Typography>
              }
              <Typography variant="sm" weight={400} as="span" className="text-gray-600 dark:text-slate-400">
                Fees: {'0.00%'}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex gap-3 p-3 bg-white rounded-lg dark:bg-slate-800">
          <Icon currency={token0} width={20} height={20} />
          <Typography variant="sm" weight={600} className="text-gray-600 dark:text-slate-300">
            <AppearOnMount>
              {token0.symbol} = {'$0.00'}
              {}
            </AppearOnMount>
          </Typography>
        </div>
        <div className="flex gap-3 p-3 bg-white rounded-lg dark:bg-slate-800">
          <Icon currency={token1} width={20} height={20} />
          <Typography variant="sm" weight={600} className="text-gray-600 dark:text-slate-300">
            <AppearOnMount>
              {token1.symbol} = {'$0.00'}
              {}
            </AppearOnMount>
          </Typography>
        </div>
      </div>
    </div>
  )
}
