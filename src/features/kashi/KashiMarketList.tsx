import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Search from 'app/components/Search'
import SortIcon from 'app/components/SortIcon'
import Typography from 'app/components/Typography'
import KashiMarketListItem from 'app/features/kashi/KashiMarketListItem'
import { TABLE_TR_TH_CLASSNAME, TABLE_WRAPPER_DIV_CLASSNAME } from 'app/features/trident/constants'
import { classNames } from 'app/functions'
import { useFuse, useSortableData } from 'app/hooks'
import { useInfiniteScroll } from 'app/hooks/useInfiniteScroll'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, memo, ReactNode } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useKashiMediumRiskLendingPairs, useKashiPairAddresses } from './hooks'
import { KashiMediumRiskLendingPair } from './KashiMediumRiskLendingPair'

interface KashiMarketList {}

const KashiMarketList: FC<KashiMarketList> = () => {
  const { account } = useActiveWeb3React()
  const addresses = useKashiPairAddresses()
  const markets = useKashiMediumRiskLendingPairs(account, addresses)

  const { i18n } = useLingui()
  const { result, term, search } = useFuse<KashiMediumRiskLendingPair>({
    data: markets,
    options: {
      keys: ['asset.token.symbol', 'collateral.token.symbol'],
      threshold: 0.2,
      shouldSort: false,
      useExtendedSearch: false,
    },
  })

  // console.log({ result })

  const { items, requestSort, sortConfig } = useSortableData(result, {
    key: 'currentAllAssetsUSD',
    direction: 'descending',
  })

  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(items)

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Search search={(val) => search(val.toUpperCase())} term={term} />
      </div>
      <div className={classNames(TABLE_WRAPPER_DIV_CLASSNAME)}>
        <div className="grid grid-cols-7 min-w-[1024px]">
          <div
            className={classNames('flex gap-1 items-center cursor-pointer', TABLE_TR_TH_CLASSNAME(0, 7))}
            // onClick={() => requestSort('pair.token0.symbol')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Asset / Collateral`)}
            </Typography>
            {/*<SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'symbol'} />*/}
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(1, 7))}
            onClick={() => requestSort('currentAllAssetsUSD')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`TVL`)}
            </Typography>
            <SortIcon
              id={sortConfig.key}
              direction={sortConfig.direction}
              active={sortConfig.key === 'currentAllAssetsUSD'}
            />
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(2, 7))}
            onClick={() => requestSort('currentBorrowAmountUSD')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Borrowed`)}
            </Typography>
            <SortIcon
              id={sortConfig.key}
              direction={sortConfig.direction}
              active={sortConfig.key === 'currentBorrowAmountUSD'}
            />
          </div>

          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(3, 7))}
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

          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(4, 7))}
            onClick={() => requestSort('totalAssetAmountUSD')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Available`)}
            </Typography>
            <SortIcon
              id={sortConfig.key}
              direction={sortConfig.direction}
              active={sortConfig.key === 'totalAssetAmountUSD'}
            />
          </div>

          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(5, 7))}
            onClick={() => requestSort('currentInterestPerYear')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Borrow APR`)}
            </Typography>
            <SortIcon
              id={sortConfig.key}
              direction={sortConfig.direction}
              active={sortConfig.key === 'currentInterestPerYear'}
            />
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(6, 7))}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Actions`)}
            </Typography>
          </div>
        </div>
        <div className="min-w-[1024px]">
          <InfiniteScroll
            dataLength={numDisplayed}
            next={() => setNumDisplayed(numDisplayed + 10)}
            hasMore={numDisplayed <= items.length}
            loader={null}
          >
            <>
              {items.slice(0, numDisplayed).reduce<ReactNode[]>((acc, market, index) => {
                if (market) acc.push(<KashiMarketListItem market={market} key={index} i18n={i18n} />)
                return acc
              }, [])}
            </>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  )
}

export default memo(KashiMarketList)
