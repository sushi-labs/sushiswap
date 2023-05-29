import { Switch as HeadlessUiSwitch } from '@headlessui/react'
import classNames from 'classnames'
import { FC, ReactNode } from 'react'

type SwitchColor = 'default' | 'gradient'

type SwitchProps = {
  checked: boolean
  onChange(checked: boolean): void
  size?: 'xs' | 'sm' | 'md'
  checkedIcon?: ReactNode
  uncheckedIcon?: ReactNode
  color?: SwitchColor
  id?: string
}

const COLOR = {
  default: (checked: boolean) => (checked ? 'bg-slate-100' : 'bg-slate-100'),
  gradient: (checked: boolean) => (checked ? 'bg-gradient-to-r from-blue to-pink' : 'bg-slate-700'),
}

const HEIGHT = {
  xs: 20,
  sm: 28,
  md: 36,
}

const WIDTH = {
  xs: 49,
  sm: 57,
  md: 65,
}

/**
 * @deprecated
 */
export const Switch: FC<SwitchProps> = ({
  size = 'md',
  checked,
  onChange,
  checkedIcon = '',
  uncheckedIcon = '',
  color = 'default',
  id = '',
}: SwitchProps) => {
  const height = HEIGHT[size]
  const width = WIDTH[size]

  return (
    <HeadlessUiSwitch
      checked={checked}
      onChange={onChange}
      className={classNames(
        checked ? 'bg-blue' : 'bg-white bg-opacity-[0.12]',
        `flex items-center relative inline-flex flex-shrink-0 rounded-full cursor-pointer ease-in-out duration-200 ${id}`
      )}
      style={{ height, width }}
    >
      <span
        id={id}
        className={classNames(
          checked ? 'translate-x-[32px]' : 'translate-x-[2px]',
          COLOR[color](checked),
          `transition-colors transition-transform pointer-events-none p-1 rounded-full ease-in-out duration-200 inline-flex items-center justify-center`
        )}
        style={{
          height: height - 6,
          width: height - 6,
          transform: `translate(${checked ? 30 : 2}, 0)`,
        }}
      >
        {checked ? checkedIcon : uncheckedIcon}
      </span>
    </HeadlessUiSwitch>
  )
}

export default Switch
