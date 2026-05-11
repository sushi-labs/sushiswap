import { Checkbox } from '@sushiswap/ui'

export const CheckboxSetting = ({
  value,
  onChange,
  label,
}: {
  value: boolean
  onChange: (value: boolean) => void
  label: string
}) => {
  return (
    <div
      onClick={() => {
        onChange(!value)
      }}
      onKeyDown={() => {
        onChange(!value)
      }}
      className="flex items-center w-fit gap-1 whitespace-nowrap text-xs cursor-pointer font-medium"
    >
      <Checkbox
        className='data-[state="checked"]:!bg-perps-muted text-black !border-perps-muted-50 data-[state="checked"]:!border-perps-muted !rounded-md'
        checked={value}
        aria-label={`${label} Checkbox`}
      />
      <div className="text-perps-muted-50">{label}</div>
    </div>
  )
}
