import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Dots from 'app/components/Dots'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import { OnsenModalView } from 'app/features/onsen/enum'
import FarmListItemDetails from 'app/features/onsen/FarmListItemDetails'
import { usePositions } from 'app/features/onsen/hooks'
import { selectOnsen, setOnsenModalOpen, setOnsenModalState, setOnsenModalView } from 'app/features/onsen/onsenSlice'
import { TABLE_TR_TH_CLASSNAME, TABLE_WRAPPER_DIV_CLASSNAME } from 'app/features/trident/constants'
import { classNames } from 'app/functions'
import { useInfiniteScroll } from 'app/hooks/useInfiniteScroll'
import useSortableData from 'app/hooks/useSortableData'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC, useCallback, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import FarmListItem from './FarmListItem'

const SortIcon: FC<{ id?: string; direction?: 'ascending' | 'descending'; active: boolean }> = ({
  id,
  active,
  direction,
}) => {
  if (!id || !direction || !active) return <></>
  if (direction === 'ascending') return <ChevronUpIcon width={12} height={12} />
  if (direction === 'descending') return <ChevronDownIcon width={12} height={12} />
  return <></>
}

// @ts-ignore TYPE NEEDS FIXING
const FarmList = ({ farms, term }) => {
  const { items, requestSort, sortConfig } = useSortableData(farms, { key: 'roiPerYear', direction: 'descending' })
  const { chainId } = useActiveWeb3React()
  const positions = usePositions(chainId)
  const { i18n } = useLingui()
  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(items)
  const [selectedFarm, setSelectedFarm] = useState<any>()
  const dispatch = useAppDispatch()
  const { open } = useAppSelector(selectOnsen)

  const handleDismiss = useCallback(() => {
    setSelectedFarm(undefined)
    dispatch(setOnsenModalView(undefined))
  }, [dispatch])

  const positionIds = positions.map((el) => el.id)

  return items ? (
    <>
      <div className={classNames(TABLE_WRAPPER_DIV_CLASSNAME)}>
        <div className="grid grid-cols-4 min-w-[768px]">
          <div
            className={classNames('flex gap-1 items-center cursor-pointer', TABLE_TR_TH_CLASSNAME(0, 4))}
            onClick={() => requestSort('pair.token0.symbol')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Pool`)}
            </Typography>
            <SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'symbol'} />
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(1, 4))}
            onClick={() => requestSort('tvl')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`TVL`)}
            </Typography>
            <SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'tvl'} />
          </div>
          <div className={classNames(TABLE_TR_TH_CLASSNAME(2, 4))}>
            <Typography variant="sm" weight={700}>
              {i18n._(t`Rewards`)}
            </Typography>
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(3, 4))}
            onClick={() => requestSort('roiPerYear')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`APR`)}
            </Typography>
            <SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'roiPerYear'} />
          </div>
        </div>
        <div className="divide-y divide-dark-900  min-w-[768px]">
          <InfiniteScroll
            dataLength={numDisplayed}
            next={() => setNumDisplayed(numDisplayed + 5)}
            hasMore={true}
            loader={null}
          >
            {items.slice(0, numDisplayed).map((farm, index) => (
              <FarmListItem
                key={index}
                farm={farm}
                onClick={() => {
                  setSelectedFarm(farm)
                  dispatch(
                    setOnsenModalState({
                      view: positionIds.includes(farm.id) ? OnsenModalView.Position : OnsenModalView.Liquidity,
                      open: true,
                    })
                  )
                }}
              />
            ))}
          </InfiniteScroll>
        </div>
      </div>
      <HeadlessUiModal.Controlled
        isOpen={open}
        onDismiss={() => dispatch(setOnsenModalOpen(false))}
        afterLeave={handleDismiss}
      >
        {selectedFarm && (
          <FarmListItemDetails farm={selectedFarm} onDismiss={() => dispatch(setOnsenModalOpen(false))} />
        )}
      </HeadlessUiModal.Controlled>
    </>
  ) : (
    <div className="w-full py-6 text-center">{term ? <span>No Results.</span> : <Dots>Loading</Dots>}</div>
  )
}

export default FarmList
