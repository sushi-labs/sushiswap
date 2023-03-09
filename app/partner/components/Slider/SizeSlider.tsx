import { Typography } from '@sushiswap/ui'
import { Form } from '../../components/Form'
import { FormType } from '../../page'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { Slider } from './Slider'

export const SizeSlider: FC = () => {
  const { setValue, watch } = useFormContext<FormType>()
  const logoSize = watch('logoSize')

  return (
    <div className="flex flex-col">
      <Typography weight={600}>Logo size</Typography>
      <div className="flex gap-4">
        <div className="flex flex-col flex-grow mt-3">
          <Slider
            min={48}
            max={128}
            value={logoSize}
            markFormatter={(val) => `${val}`}
            onChange={(newSize) => setValue('logoSize', newSize)}
          />
          <div>
            <Form.TextField name="logoSize" helperText="Enter background size in pixel value" placeholder="32" />
          </div>
        </div>
      </div>
    </div>
  )
}
