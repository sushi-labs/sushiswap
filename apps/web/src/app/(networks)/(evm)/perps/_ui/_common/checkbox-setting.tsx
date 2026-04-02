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
        className='data-[state="checked"]:!bg-blue text-white !border-[#99A1AF] data-[state="checked"]:!border-blue'
        checked={value}
        aria-label={`${label} Checkbox`}
      />
      <div className="text-[#99A1AF]">{label}</div>
    </div>
  )
}
