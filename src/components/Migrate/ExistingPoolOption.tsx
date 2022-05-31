import { CheckIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { classNames, formatNumber } from 'app/functions'
import { TridentPool } from 'app/services/graph'
import React, { FC } from 'react'

interface OptionProps {
  pool: TridentPool
  active: boolean
  onClick: () => void
}

export const ExistingPoolOption: FC<OptionProps> = ({ pool, onClick, active }) => {
  const { i18n } = useLingui()

  return (
    <div
      onClick={onClick}
      className={classNames(
        'flex justify-between bg-dark-800 rounded p-4 m-3',
        !active && 'hover:bg-dark-700 hover:cursor-pointer',
        active && 'border-2 border-blue p-3.5'
      )}
    >
      <div className="flex-grow">
        <div className="text-md">
          {pool.swapFee / 100}
          {i18n._(t`% Fee`)}
        </div>
        {pool.twapEnabled ? (
          <div className="flex gap-1 text-xs">
            <span>{i18n._(t`TWAP`)}</span>
            <CheckIcon className="w-4 text-blue" />
          </div>
        ) : (
          <div className="text-low-emphesis text-xs">{i18n._(t`No TWAP`)}</div>
        )}
      </div>
      <div className="text-right text-xs flex flex-col justify-center">
        <div>{i18n._(t`TVL`)}</div>
        <div>{formatNumber(pool.liquidityUSD, true)}</div>
      </div>
    </div>
  )
}
