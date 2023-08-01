import { Typography } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import { FC } from 'react'

export const PoolMyRewards: FC<> = ({}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-900/5 dark:border-slate-200/5">
          <Typography weight={600} className="dark:text-slate-50 text-gray-900">
            My Rewards
          </Typography>
          <div className="flex flex-col">
            <Typography variant="sm" weight={600} className="text-right dark:text-slate-50 text-gray-900">
              {`$0.00`}
            </Typography>
          </div>
        </div>
        <div className="flex flex-col gap-3 px-5 py-4">
          {() => {
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Typography variant="sm" weight={600} className="dark:text-slate-300 text-gray-700">
                    {}
                  </Typography>
                </div>
                <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600 text-gray-600">
                  {`$0.00`}
                </Typography>
              </div>
            )
          }}
        </div>
      </div>
      <Button size="xl" fullWidth onClick={() => {}}>
        Claim
      </Button>
    </div>
  )
}
