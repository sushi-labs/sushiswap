import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { HeadlessUiModal } from 'app/components/Modal'
import QuestionHelper from 'app/components/QuestionHelper'
import ToggleButtonGroup from 'app/components/ToggleButton'
import { selectOnsen, setOnsenModalView } from 'app/features/onsen/onsenSlice'
import { classNames } from 'app/functions'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react'

import { OnsenModalView, PairType } from './enum'
import InformationDisclosure from './InformationDisclosure'
import InvestmentDetails from './InvestmentDetails'
import ManageBar from './ManageBar'
import ManageKashiPair from './ManageKashiPair'
import ManageSwapPair from './ManageSwapPair'

const COLUMN_CONTAINER = 'flex flex-col flex-grow gap-4'

interface FarmListItemDetailsModal {
  content: ReactNode
  setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>
}

const Context = createContext<FarmListItemDetailsModal | undefined>(undefined)

// @ts-ignore TYPE NEEDS FIXING
const FarmListItemDetails = ({ farm, onDismiss }) => {
  const { i18n } = useLingui()
  const { view } = useAppSelector(selectOnsen)
  const dispatch = useAppDispatch()
  const [content, setContent] = useState<ReactNode>()

  return (
    <Context.Provider value={useMemo(() => ({ content, setContent }), [content, setContent])}>
      <div className={classNames('')}>
        <div className={classNames(COLUMN_CONTAINER, content ? '' : 'hidden')}>{content}</div>
        <div className={classNames(COLUMN_CONTAINER, content ? 'hidden' : '')}>
          <HeadlessUiModal.Header
            header={
              <div className="flex gap-0.5 items-center">
                {view === OnsenModalView.Liquidity
                  ? i18n._(t`Manage liquidity`)
                  : view === OnsenModalView.Position
                  ? i18n._(t`Your position and rewards`)
                  : i18n._(t`Stake or unstake your liquidity`)}
                <QuestionHelper className="!bg-dark-800 !shadow-xl p-2" text={<InformationDisclosure farm={farm} />} />
              </div>
            }
            onClose={onDismiss}
          />
          <ToggleButtonGroup
            size="sm"
            value={view}
            onChange={(view: OnsenModalView) => dispatch(setOnsenModalView(view))}
            variant="filled"
          >
            <ToggleButtonGroup.Button value={OnsenModalView.Liquidity}>
              {farm.pair.type === PairType.KASHI ? i18n._(t`Lending`) : i18n._(t`Liquidity`)}
            </ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value={OnsenModalView.Staking}>{i18n._(t`Staking`)}</ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value={OnsenModalView.Position}>{i18n._(t`Rewards`)}</ToggleButtonGroup.Button>
          </ToggleButtonGroup>

          {/*Dont unmount following components to make modal more react faster*/}
          <div className={classNames(COLUMN_CONTAINER, view === OnsenModalView.Position ? 'block' : 'hidden')}>
            <InvestmentDetails farm={farm} />
          </div>
          <div className={classNames(COLUMN_CONTAINER, view === OnsenModalView.Liquidity ? 'block' : 'hidden')}>
            {farm.pair.type === PairType.KASHI ? <ManageKashiPair farm={farm} /> : <ManageSwapPair farm={farm} />}
          </div>
          <div className={classNames(COLUMN_CONTAINER, view === OnsenModalView.Staking ? 'block' : 'hidden')}>
            <ManageBar farm={farm} />
          </div>
        </div>
      </div>
    </Context.Provider>
  )
}

export const useFarmListItemDetailsModal = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Farm List Item Details Context')
  }

  return context
}

export default FarmListItemDetails
