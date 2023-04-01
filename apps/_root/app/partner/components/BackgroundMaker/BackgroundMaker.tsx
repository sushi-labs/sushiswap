import { FormType } from './../../page'
import { FC, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'
import { useFormContext } from 'react-hook-form'

export const BackgroundMaker: FC = () => {
  const { setValue, watch } = useFormContext<FormType>()
  const colorValue = watch('background')

  useEffect(() => {
    if (/^#[0-9A-F]{6}$/i.test(colorValue)) {
      setValue('background', colorValue)
    } else {
      setValue('background', '#000000')
    }
  }, [colorValue, setValue])

  return (
    <div className="flex w-full px-1 ">
      <style lang="postcss">
        {`
          .react-colorful .react-colorful__saturation {
            margin-bottom: 16px;
            border-radius: 0.75rem;
          }

          .react-colorful .react-colorful__hue {
            border-radius: 0.75rem;
          }
        `}
      </style>
      <HexColorPicker color={colorValue} onChange={(newColor) => setValue('background', newColor)} />
    </div>
  )
}
