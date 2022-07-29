import { Chip, classNames, Loader } from '@sushiswap/ui'
import Button from '@sushiswap/ui/button/Button'
import { FC } from 'react'
import useSWR from 'swr'
import { useAccount } from 'wagmi'

import { User } from '../../../.graphclient'
import { usePoolFilters } from '../../PoolsProvider'
import { PoolsTableSearchTokensFilter } from './PoolsTableSearchTokensFilter'

export const PoolsTableFilters: FC = () => {
  const { address } = useAccount()
  const { myTokensOnly, myPositionsOnly, singleSidedStakingOnly, stablePairsOnly, setFilters } = usePoolFilters()
  const { data: user, isValidating } = useSWR<User>(`/pool/api/user/${address}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  return (
    <>
      <div className="flex gap-12 items-center">
        <button
          onClick={() => setFilters({ myPositionsOnly: false })}
          className={classNames(!myPositionsOnly ? 'text-slate-50' : 'text-slate-500', 'font-medium')}
        >
          All Yields
        </button>
        <button
          onClick={() => setFilters({ myPositionsOnly: !myPositionsOnly })}
          className={classNames(
            myPositionsOnly ? 'text-slate-50' : 'text-slate-500',
            'flex items-center gap-2 font-medium'
          )}
        >
          My Positions{' '}
          {isValidating ? (
            <Loader size={16} />
          ) : (
            <Chip label={user?.liquidityPositions?.length || '0'} size="sm" color="blue" />
          )}
        </button>
      </div>
      <div className="flex justify-between gap-3">
        <PoolsTableSearchTokensFilter />
        <div className="flex gap-3">
          <Button
            variant="outlined"
            className="px-4"
            onClick={() => setFilters({ myTokensOnly: !myTokensOnly })}
            color={myTokensOnly ? 'blue' : 'gray'}
          >
            My Tokens
          </Button>
          <Button
            variant="outlined"
            className="px-4"
            onClick={() => setFilters({ singleSidedStakingOnly: !singleSidedStakingOnly })}
            color={singleSidedStakingOnly ? 'blue' : 'gray'}
          >
            Single-sided staking
          </Button>
          <Button
            variant="outlined"
            className="px-4"
            onClick={() => setFilters({ stablePairsOnly: !stablePairsOnly })}
            color={stablePairsOnly ? 'blue' : 'gray'}
          >
            Stable pairs
          </Button>
        </div>
      </div>
    </>
  )
}
