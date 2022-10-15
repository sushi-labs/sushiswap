import { FC } from 'react'

import { TableFiltersSearchToken } from './TableFiltersSearchToken'

export const TableFilters: FC = () => {
  return (
    <>
      <div className="flex justify-between gap-3">
        <TableFiltersSearchToken />
        {/*<div className="flex gap-3">*/}
        {/*  <Button*/}
        {/*    variant="outlined"*/}
        {/*    className="px-4"*/}
        {/*    onClick={() => setFilters({ myTokensOnly: !myTokensOnly })}*/}
        {/*    color={myTokensOnly ? 'blue' : 'gray'}*/}
        {/*  >*/}
        {/*    My Tokens*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    variant="outlined"*/}
        {/*    className="px-4"*/}
        {/*    onClick={() => setFilters({ singleSidedStakingOnly: !singleSidedStakingOnly })}*/}
        {/*    color={singleSidedStakingOnly ? 'blue' : 'gray'}*/}
        {/*  >*/}
        {/*    Single-sided staking*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    variant="outlined"*/}
        {/*    className="px-4"*/}
        {/*    onClick={() => setFilters({ stablePairsOnly: !stablePairsOnly })}*/}
        {/*    color={stablePairsOnly ? 'blue' : 'gray'}*/}
        {/*  >*/}
        {/*    Stable pairs*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </div>
    </>
  )
}
