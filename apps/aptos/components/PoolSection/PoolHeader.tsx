import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { AppearOnMount, Link, Typography } from '@sushiswap/ui'
// import {} from '@heroicons/react/'
import { FC } from 'react'

interface PoolHeader {}

export const PoolHeader: FC<PoolHeader> = ({}) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex gap-1">
          <Typography variant="xs" className="text-gray-600 dark:text-slate-500">
            {}
          </Typography>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex">
            <Link.External className="flex flex-col !no-underline group" href={''}>
              <div className="flex items-center gap-2">
                <Typography
                  variant="lg"
                  className="flex items-center gap-1 text-gray-900 dark:text-slate-50 group-hover:text-blue-400"
                  weight={600}
                >
                  {}
                  <ArrowTopRightOnSquareIcon height={20} width={20} />
                </Typography>
              </div>
              <Typography variant="xs" className="text-gray-600 dark:text-slate-300">
                Fee: {}
              </Typography>
            </Link.External>
          </div>
          <div className="flex flex-col gap-1">
            <Typography
              weight={400}
              as="span"
              className="text-gray-500 dark:text-slate-400 text-slate-600 sm:text-right"
            >
              APR:{''}
              <span className="font-semibold text-gray-900 dark:text-slate-50">{}</span>
            </Typography>
            <div className="flex gap-2">
              {
                <Typography
                  variant="sm"
                  weight={400}
                  as="span"
                  className="text-gray-600 dark:text-slate-400 text-slate-600"
                >
                  Rewards:{}
                </Typography>
              }
              <Typography
                variant="sm"
                weight={400}
                as="span"
                className="text-gray-600 dark:text-slate-400 text-slate-600"
              >
                Fees:{}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex gap-3 p-3 bg-white rounded-lg dark:bg-slate-800">
          <Typography variant="sm" weight={600} className="text-gray-600 dark:text-slate-300">
            <AppearOnMount>$0.00</AppearOnMount>
          </Typography>
        </div>
        <div className="flex gap-3 p-3 bg-white rounded-lg dark:bg-slate-800">
          <Typography variant="sm" weight={600} className="text-gray-600 dark:text-slate-300">
            <AppearOnMount>$0.00</AppearOnMount>
          </Typography>
        </div>
      </div>
    </div>
  )
}
