import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Fee } from '@sushiswap/trident-sdk'
import Button from 'app/components/Button'
import Checkbox from 'app/components/Checkbox'
import BottomSlideIn from 'app/components/Dialog/BottomSlideIn'
import Typography from 'app/components/Typography'
import {
  selectTridentPools,
  setPoolsFarmsOnly,
  setPoolsFeeTiers,
  setPoolsTWAPOnly,
} from 'app/features/trident/pools/poolsSlice'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { FC, useState } from 'react'

import { removeOrAddFeeTier } from './SearchSidebar'

const YieldFarmFilter: FC = () => {
  const { farmsOnly } = useAppSelector(selectTridentPools)
  const dispatch = useAppDispatch()
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between gap-3">
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          Yield Farms:
        </Typography>
      </div>
      <div className="flex flex-row gap-3 items-center" onClick={() => dispatch(setPoolsFarmsOnly(!farmsOnly))}>
        <Checkbox checked={farmsOnly} />
        <Typography className="text-secondary">Show farms only</Typography>
      </div>
    </div>
  )
}

const TwapOnlyFilter: FC = () => {
  const { showTWAPOnly } = useAppSelector(selectTridentPools)
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between gap-3">
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          TWAP Oracles:
        </Typography>
      </div>
      <div className="flex flex-row gap-3 items-center" onClick={() => dispatch(setPoolsTWAPOnly(!showTWAPOnly))}>
        <Checkbox checked={showTWAPOnly} />
        <Typography className="text-secondary">Show oracle pairs only</Typography>
      </div>
    </div>
  )
}

const FeeTierFilter: FC = () => {
  const { feeTiers } = useAppSelector(selectTridentPools)
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between gap-3">
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          By Fee Tier:
        </Typography>
      </div>
      {[Fee.HIGH, Fee.DEFAULT, Fee.MEDIUM, Fee.LOW].map((fee) => (
        <div
          key={fee}
          className="flex flex-row gap-3 items-center"
          onClick={() => removeOrAddFeeTier(fee, feeTiers, (feeTiers) => dispatch(setPoolsFeeTiers(feeTiers)))}
        >
          <Checkbox checked={feeTiers.includes(fee)} />
          <Typography className="text-secondary">{fee / 100}%</Typography>
        </div>
      ))}
    </div>
  )
}

export const MobileFilter: FC = () => {
  const { i18n } = useLingui()
  const [open, setOpen] = useState(false)
  const { feeTiers, showTWAPOnly, farmsOnly } = useAppSelector(selectTridentPools)
  const filterInUse = farmsOnly || showTWAPOnly || feeTiers.length > 0

  return (
    <div className="lg:hidden">
      <div onClick={() => setOpen(true)} className="hover:cursor-pointer">
        <svg width="25" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 0a1.5 1.5 0 0 1 1.5 1.5V3h12a1.5 1.5 0 0 1 0 3h-12v1.5a1.5 1.5 0 0 1-3 0v-6A1.5 1.5 0 0 1 10 0ZM0 4.5A1.5 1.5 0 0 1 1.5 3H5a1.5 1.5 0 1 1 0 3H1.5A1.5 1.5 0 0 1 0 4.5ZM13 14H1.5a1.5 1.5 0 0 0 0 3H13a1.5 1.5 0 0 0 0-3Zm3.5 1.5v-3a1.5 1.5 0 0 1 3 0V14h4a1.5 1.5 0 0 1 0 3h-4v1.5a1.5 1.5 0 0 1-3 0v-3Z"
            fill={filterInUse ? '#f139c3' : '#E3E3E3'}
          />
        </svg>
      </div>
      <BottomSlideIn
        title={i18n._(t`Select Filters`)}
        open={open}
        onClose={() => setOpen(false)}
        closeTrigger={
          <Button size="sm" onClick={() => setOpen(false)}>
            <span className="px-3">{i18n._(t`Apply & Close`)}</span>
          </Button>
        }
      >
        <div className="bg-dark-700 rounded-t">
          {/* To Be Built */}
          {/*<YieldFarmFilter />*/}
          <div className="bg-dark-800 rounded-t">
            <TwapOnlyFilter />
            <div className="relative bg-dark-900 rounded-t">
              <FeeTierFilter />
            </div>
          </div>
        </div>
      </BottomSlideIn>
    </div>
  )
}
