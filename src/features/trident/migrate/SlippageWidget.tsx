import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import QuestionHelper from 'app/components/QuestionHelper'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import {
  formatSlippageInput,
  GLOBAL_DEFAULT_SLIPPAGE_PERCENT,
  GLOBAL_DEFAULT_SLIPPAGE_STR,
  setSlippageInput,
  SlippageError,
  slippageSelectors,
} from 'app/state/slippage/slippageSlice'
import React from 'react'

export const SlippageWidget = () => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { input, error, percent } = useAppSelector(slippageSelectors)
  const slippageIsDefault = percent.equalTo(GLOBAL_DEFAULT_SLIPPAGE_PERCENT)

  return (
    <div className="flex items-center md:self-start self-center gap-2">
      <div className="flex items-center">
        <Typography variant="xs" weight={700} className="text-high-emphesis">
          {i18n._(t`Slippage tolerance`)}
        </Typography>

        <QuestionHelper
          text={i18n._(t`Your transaction will revert if the price changes unfavorably by more than this percentage.`)}
        />
      </div>
      <div
        className={classNames(
          'border-2 h-[36px] flex items-center px-2 rounded bg-dark-1000/40 relative',
          error ? 'border-red' : 'border-low-emphesis'
        )}
      >
        <input
          className="bg-transparent placeholder-low-emphesis min-w-0 font-bold w-16"
          value={input}
          onChange={(e) => dispatch(setSlippageInput(e.target.value))}
          onBlur={() =>
            error === SlippageError.INVALID_INPUT
              ? dispatch(setSlippageInput(GLOBAL_DEFAULT_SLIPPAGE_STR))
              : dispatch(formatSlippageInput())
          }
        />
        <div className="text-low-emphesis">%</div>
      </div>
      <Button
        size="sm"
        color={slippageIsDefault ? 'blue' : 'gray'}
        variant="outlined"
        onClick={() => dispatch(setSlippageInput(GLOBAL_DEFAULT_SLIPPAGE_STR))}
      >
        {i18n._(t`Auto`)}
      </Button>
    </div>
  )
}
