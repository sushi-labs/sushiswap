import { classNames } from '@sushiswap/ui'
import { CheckboxSetting } from './checkbox-setting'

export const CheckboxSelectItem = <T,>({
  valueToSet,
  currentValue,
  setValue,
  title,
  description,
  checkboxLabel,
}: {
  valueToSet: T
  currentValue: T
  setValue: (value: T) => void
  title: string
  description: string
  checkboxLabel?: string
}) => {
  return (
    <div
      onKeyDown={() => {
        setValue(valueToSet)
      }}
      onClick={() => {
        setValue(valueToSet)
      }}
      className={classNames(
        'p-2 flex text-left flex-col w-full h-full transition-colors gap-2 cursor-pointer rounded',
        currentValue === valueToSet ? '' : 'bg-[#ffffff03]',
      )}
      style={{
        background:
          currentValue === valueToSet
            ? 'linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08)), radial-gradient(50% 45.68% at 50% 0.02%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)'
            : '',
      }}
    >
      <CheckboxSetting
        label={checkboxLabel ?? ''}
        value={currentValue === valueToSet}
        onChange={() => setValue(valueToSet)}
      />
      <p
        className={classNames(
          'text-lg  font-semibold',
          currentValue === valueToSet
            ? 'text-perps-muted'
            : 'text-perps-muted-50',
        )}
      >
        {title}
      </p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
