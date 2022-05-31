import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Fee } from '@sushiswap/trident-sdk'
import Typography from 'app/components/Typography'
import { selectTridentCreate, setCreateSelectedFeeTier } from 'app/features/trident/create/createSlice'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC } from 'react'

import { FeeTierSelect } from './FeeTierSelect'

export const SelectFeeTier: FC = () => {
  const { i18n } = useLingui()
  const { selectedFeeTier } = useAppSelector(selectTridentCreate)
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          {i18n._(t`Select Fee Tier`)}
        </Typography>
        <Typography variant="sm" className="text-secondary">
          {i18n._(t`Select the percentage of fee that this pool will take from a swap order. Higher fee tiers suit pairs with more
        volatility and less volume.`)}
        </Typography>
      </div>
      <div className="grid gap-3 select-none lg:grid-cols-5 md:grid-cols-2">
        <FeeTierSelect
          tier={Fee.LOW}
          subtitle={i18n._(t`Best for very stable pairs`)}
          selectedFeeTier={selectedFeeTier}
          setter={(feeTier) => dispatch(setCreateSelectedFeeTier(feeTier))}
        />
        <FeeTierSelect
          tier={Fee.MEDIUM}
          subtitle={i18n._(t`Best for stable pairs`)}
          selectedFeeTier={selectedFeeTier}
          setter={(feeTier) => dispatch(setCreateSelectedFeeTier(feeTier))}
        />
        <FeeTierSelect
          tier={Fee.AVERAGE}
          subtitle={i18n._(t`Best for average pairs`)}
          selectedFeeTier={selectedFeeTier}
          setter={(feeTier) => dispatch(setCreateSelectedFeeTier(feeTier))}
        />
        <FeeTierSelect
          tier={Fee.DEFAULT}
          subtitle={i18n._(t`Best for mainstream pairs`)}
          selectedFeeTier={selectedFeeTier}
          setter={(feeTier) => dispatch(setCreateSelectedFeeTier(feeTier))}
        />
        <FeeTierSelect
          tier={Fee.HIGH}
          subtitle={i18n._(t`Best for exotic pairs`)}
          selectedFeeTier={selectedFeeTier}
          setter={(feeTier) => dispatch(setCreateSelectedFeeTier(feeTier))}
        />
      </div>
    </div>
  )
}
