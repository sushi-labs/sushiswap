import Button from '@sushiswap/ui/button/Button'
import { FC } from 'react'

import { usePoolFilters } from '../../PoolsProvider'
import { PoolsTableSearchTokensFilter } from './PoolsTableSearchTokensFilter'

export const PoolsTableFilters: FC = () => {
  const { myTokensOnly, singleSidedStakingOnly, stablePairsOnly, setFilters } = usePoolFilters()

  return (
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
  )
}
