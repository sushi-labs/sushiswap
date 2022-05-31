import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import SortIcon from 'app/components/SortIcon'
import Typography from 'app/components/Typography'
import { TABLE_TR_TH_CLASSNAME, TABLE_WRAPPER_DIV_CLASSNAME } from 'app/features/trident/constants'
import { classNames } from 'app/functions/styling'
import { useSortableData } from 'app/hooks'
import { useInfiniteScroll } from 'app/hooks/useInfiniteScroll'
import { useRouter } from 'next/router'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useKashiMediumRiskLendingPositions } from './hooks'
import KashiLendingListItem from './KashiLendingListItem'

export const KashiLendingList = () => {
  const { i18n } = useLingui()
  const router = useRouter()
  const account = router.query.account as string
  const positions = useKashiMediumRiskLendingPositions(account)
  const { items, requestSort, sortConfig } = useSortableData(positions, {
    key: 'currentSupplyAPR',
    direction: 'descending',
  })
  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(items)
  return (
    <div className="flex flex-col w-full gap-3">
      <div className={classNames(TABLE_WRAPPER_DIV_CLASSNAME)}>
        <div className="grid grid-cols-6 min-w-[768px]">
          <div className={classNames('flex gap-1 items-center cursor-pointer', TABLE_TR_TH_CLASSNAME(0, 6))}>
            <Typography variant="sm" weight={700}>
              {i18n._(t`Asset / Collateral`)}
            </Typography>
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(1, 6))}
          >
            <Typography variant="sm" weight={700} onClick={() => requestSort('currentUserAssetAmount')}>
              {i18n._(t`Supplied`)}
            </Typography>
            <SortIcon
              id={sortConfig.key}
              direction={sortConfig.direction}
              active={sortConfig.key === 'currentUserAssetAmount'}
            />
          </div>
          <div className={classNames(TABLE_TR_TH_CLASSNAME(2, 6))} onClick={() => requestSort('currentBorrowAmount')}>
            <Typography variant="sm" weight={700}>
              {i18n._(t`Borrowed`)}
            </Typography>
            <SortIcon
              id={sortConfig.key}
              direction={sortConfig.direction}
              active={sortConfig.key === 'currentBorrowAmount'}
            />
          </div>
          <div className={classNames(TABLE_TR_TH_CLASSNAME(3, 6))} onClick={() => requestSort('totalAssetAmount')}>
            <Typography variant="sm" weight={700}>
              {i18n._(t`Available`)}
            </Typography>
            <SortIcon
              id={sortConfig.key}
              direction={sortConfig.direction}
              active={sortConfig.key === 'totalAssetAmount'}
            />
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(4, 6))}
            onClick={() => requestSort('utilization')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Utilization`)}
            </Typography>
            <SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'utilization'} />
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(5, 6))}
            onClick={() => requestSort('currentSupplyAPR')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Supply APR`)}
            </Typography>
            <SortIcon
              id={sortConfig.key}
              direction={sortConfig.direction}
              active={sortConfig.key === 'currentSupplyAPR'}
            />
          </div>
        </div>
        <InfiniteScroll
          dataLength={numDisplayed}
          next={() => setNumDisplayed(numDisplayed + 5)}
          hasMore={true}
          loader={null}
        >
          {items.slice(0, numDisplayed).map((market, index) => (
            <KashiLendingListItem market={market} key={index} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  )
}
