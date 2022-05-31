import { CheckIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import CloseIcon from 'app/components/CloseIcon'
import Switch from 'app/components/Switch'
import Typography from 'app/components/Typography'
import { selectTridentCreate, setCreateAnOracle } from 'app/features/trident/create/createSlice'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC } from 'react'

export const CreateOracleOption: FC = () => {
  const { i18n } = useLingui()
  const { createAnOracle } = useAppSelector(selectTridentCreate)
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          {i18n._(t`Create Oracle for this Pair?`)}
        </Typography>
        <Typography variant="sm" className="text-secondary">
          {i18n._(t`Creating oracle enables the pool to store its price data and provides more accurate swap rate. However, the swap
        gas fee will be higher.`)}
        </Typography>
      </div>
      <Switch
        checked={createAnOracle}
        onChange={() => dispatch(setCreateAnOracle(!createAnOracle))}
        checkedIcon={
          <div className="flex items-center justify-center w-full h-full text-dark-700">
            <CheckIcon width={24} height={24} />
          </div>
        }
        uncheckedIcon={
          <div className="flex items-center justify-center w-full h-full text-dark-700">
            <CloseIcon width={24} height={24} />
          </div>
        }
      />
    </div>
  )
}
