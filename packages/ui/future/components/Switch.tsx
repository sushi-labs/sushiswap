import { Switch as HeadlessUiSwitch } from '@headlessui/react'
import classNames from 'classnames'
import { FC, ReactNode } from 'react'

type SwitchColor = 'default'

type SwitchProps = {
  checked: boolean
  className?: ((checked: boolean) => string) | string
  onChange(checked: boolean): void
  size?: 'xs' | 'sm' | 'md'
  checkedIcon?: ReactNode
  uncheckedIcon?: ReactNode
  color?: SwitchColor
  id?: string
}

const HEIGHT = {
  xs: 20,
  sm: 28,
  md: 30,
}

const WIDTH = {
  xs: 49,
  sm: 48,
  md: 48,
}

const TRANSLATE_CLASS = {
  checked: {
    xs: '',
    sm: 'translate-x-[22px]',
    md: 'translate-x-[20px]',
  },
  unchecked: {
    xs: '',
    sm: 'translate-x-[2px]',
    md: 'translate-x-[2px]',
  },
}

export const Switch: FC<SwitchProps> = ({
  size = 'md',
  checked,
  onChange,
  className,
  checkedIcon = '',
  uncheckedIcon = '',
  id = '',
}: SwitchProps) => {
  const height = HEIGHT[size]
  const width = WIDTH[size]

  return (
    <HeadlessUiSwitch
      checked={checked}
      onChange={onChange}
      className={classNames(
        typeof className === 'function' ? className(checked) : className,
        checked ? 'bg-blue' : 'bg-gray-300 dark:bg-white/[0.12]',
        `flex items-center relative inline-flex flex-shrink-0 rounded-full cursor-pointer ease-in-out duration-200 ${id}`
      )}
      style={{ height, width }}
    >
      <span
        id={id}
        className={classNames(
          checked ? TRANSLATE_CLASS.checked[size] : TRANSLATE_CLASS.unchecked[size],
          `bg-white transition-colors transition-transform pointer-events-none p-1 rounded-full ease-in-out duration-200 inline-flex items-center justify-center`
        )}
        style={{
          height: height - 4,
          width: height - 4,
        }}
      >
        {checked ? checkedIcon : uncheckedIcon}
      </span>
    </HeadlessUiSwitch>
  )
}

export default Switch
