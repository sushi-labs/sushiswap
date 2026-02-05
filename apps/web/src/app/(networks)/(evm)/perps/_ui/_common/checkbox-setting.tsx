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
        className='data-[state="checked"]:!bg-blue text-slate-100 !border-slate-400 dark:!border-slate-100 data-[state="checked"]:!border-blue'
        checked={value}
        onCheckedChange={(checked) => {
          onChange(!checked)
        }}
      />
      <div>{label}</div>
    </div>
  )
}
