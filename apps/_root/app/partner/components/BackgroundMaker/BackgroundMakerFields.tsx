import { classNames } from '@sushiswap/ui'
import React, { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormType } from '../../page'
import { DEFAULT_FORM_FIELD_CLASSNAMES } from '../Form'
import FormFieldHelperText from '../Form/FormFieldHelperText'
import { BackgroundMaker } from './BackgroundMaker'

export const BackgroundImageMakerField: FC = () => {
  const { watch, setValue } = useFormContext<FormType>()
  const color = watch('background')
  const [customColor, setCustomColor] = useState<string>()

  const validate = (newColor: string) => {
    setCustomColor(newColor)

    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
      setValue('background', newColor)
    }
  }

  useEffect(() => {
    setCustomColor(color)
  }, [color])

  return (
    <div className="flex flex-col flex-grow space-y-4">
      <BackgroundMaker />
      <div className="w-[200px] rounded-xl space-y-2">
        <input
          placeholder="#AABBCC"
          value={customColor}
          onChange={(event) => validate(event.target.value)}
          className={classNames(DEFAULT_FORM_FIELD_CLASSNAMES, 'shadow-xl')}
        />
        <FormFieldHelperText>Enter background color in hex value</FormFieldHelperText>
      </div>
    </div>
  )
}
