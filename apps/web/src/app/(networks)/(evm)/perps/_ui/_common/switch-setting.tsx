import { Switch } from '@sushiswap/ui'

export const SwitchSetting = ({
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
      <Switch
        className='data-[state="checked"]:!bg-perps-muted-20 !rounded-[5px] text-white !border-perps-muted-50 focus-visible:ring-0 focus-visible:ring-offset-0 ring-transparent !h-[16px] !w-[24px] focus:border-0 !border-0'
        checked={value}
        aria-label={`${label} switch`}
        thumbClassName="!h-[12px] !w-[12px] !rounded-[4px] data-[state=checked]:translate-x-[10px] data-[state=unchecked]:translate-x-[2px] dark:data-[state=unchecked]:!bg-perps-muted/[0.5]"
      />
      <div className={value ? 'text-perps-muted' : 'text-perps-muted-50'}>
        {label}
      </div>
    </div>
  )
}
