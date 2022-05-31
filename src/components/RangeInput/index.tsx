import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency } from '@sushiswap/core-sdk'
import { FC } from 'react'

import { classNames } from '../../functions'
import { Input as NumericalInput } from '../Input/Numeric'
import Typography from '../Typography'

type RangeInputColor = 'blue' | 'purple'

interface RangeInputProps {
  color: RangeInputColor
  label: string
  value: string
  onChange: (val: string) => void
  base?: Currency
  quote?: Currency
}

const COLOR = {
  blue: 'border-blue bg-blue/25',
  purple: 'border-purple bg-purple/25',
}

const RangeInput: FC<RangeInputProps> = ({ value, label, color = 'blue', onChange, base, quote }) => {
  const { i18n } = useLingui()
  return (
    <div className="flex flex-col w-full">
      <Typography
        variant="sm"
        weight={700}
        className={classNames(COLOR[color], 'rounded-t border px-3 py-2.5 text-center')}
      >
        {label}
      </Typography>
      <div className=" bg-dark-900 border-t border-l border-r border-dark-700">
        <NumericalInput
          value={value}
          onUserInput={onChange}
          placeholder="0.000"
          className="text-3xl trailing-7 letter-spacing-[-0.01em] font-bold px-3 py-4 text-center bg-transparent w-full"
        />
      </div>
      <Typography variant="sm" className="rounded-b bg-dark-800 px-3 py-2.5 text-center border border-dark-700">
        {i18n._(t`${base?.symbol} per ${quote?.symbol}`)}
      </Typography>
    </div>
  )
}

export default RangeInput
