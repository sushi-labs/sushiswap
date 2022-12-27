import { Transition } from '@headlessui/react'
import { ArrowLongRightIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import React, { Fragment, SVGProps, useState } from 'react'

import { PolymorphicComponentProps } from '../../types'

export interface Props {
  icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element
  iconProps?: React.ComponentProps<'svg'>
  title: string
  subtitle?: string
  onClick?(): void
  hoverIcon?: (props: SVGProps<SVGSVGElement>) => JSX.Element
  hoverIconProps?: Omit<React.ComponentProps<'svg'>, 'width' | 'height'> & {
    width: number
    height: number
  }
}

export type ListItemProps<C extends React.ElementType> = PolymorphicComponentProps<C, Props>
export type ListItemComponent = <C extends React.ElementType = 'button'>(
  props: ListItemProps<C>
) => React.ReactElement | null

export const ListItem: ListItemComponent = ({
  as,
  icon: Icon,
  iconProps,
  subtitle,
  title,
  onClick,
  hoverIcon: HoverIcon,
  hoverIconProps,
  className,
  ...rest
}) => {
  const Component = as || 'button'

  const [hover, setHover] = useState(false)
  return (
    <Component
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      {...rest}
      className={classNames(
        className,
        'relative flex gap-3 px-4 py-3 hover:bg-black/[0.02] active:bg-black/[0.03] hover:dark:bg-white/[0.02] active:dark:bg-white/[0.03] w-full items-center cursor-pointer'
      )}
    >
      {Icon && <Icon {...iconProps} width={iconProps?.width ?? 20} height={iconProps?.height ?? 20} />}
      <div className="flex flex-col gap-0.5 items-start">
        <span className="text-sm font-medium dark:text-slate-200">{title}</span>
        {subtitle && <span className="text-[10px] text-slate-400">{subtitle}</span>}
      </div>
      <Transition
        as={Fragment}
        show={hover}
        enter="ease-in-out duration-300"
        enterFrom="translate-x-[10px] opacity-0"
        enterTo="translate-x-[-16px] opacity-100"
        leave="ease-in-out duration-300"
        leaveFrom="translate-x-[-16px] opacity-100"
        leaveTo="translate-x-[10px] opacity-0"
        unmount={false}
      >
        <div className="absolute right-0 top-0 bottom-0 flex justify-center items-center">
          {HoverIcon ? <HoverIcon {...hoverIconProps} /> : <ArrowLongRightIcon {...hoverIconProps} />}
        </div>
      </Transition>
    </Component>
  )
}
