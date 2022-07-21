import React, { ReactNode } from 'react'

import { classNames, PolymorphicComponentPropsWithRef, PolymorphicRef } from '../index'

interface Props {
  children: ReactNode
  className?: string
}

export type IconButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>
export type IconButtonComponent = <C extends React.ElementType = 'button'>(
  props: IconButtonProps<C>
) => React.ReactElement | null

export const IconButton: IconButtonComponent = React.forwardRef(
  <Tag extends React.ElementType = 'button'>(
    { as, children, className, ...rest }: IconButtonProps<Tag>,
    ref?: PolymorphicRef<Tag>
  ) => {
    const Component = as || 'button'
    return (
      <Component
        ref={ref}
        {...rest}
        type="button"
        className={classNames(className, 'group relative focus:outline-none border:none')}
      >
        <span className="rounded-full absolute inset-0 -ml-1 -mr-1 -mb-1 -mt-1 group-hover:bg-white group-hover:bg-opacity-[0.08]" />
        {children}
      </Component>
    )
  }
)
