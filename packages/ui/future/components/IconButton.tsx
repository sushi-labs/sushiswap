import classNames from 'classnames'
import React from 'react'
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types'

interface Props {
  className?: string
  description?: string
  padding?: number
  icon(props: React.ComponentProps<'svg'>): JSX.Element | null
  iconProps: Omit<React.ComponentProps<'svg'>, 'width' | 'height'> & {
    width: number
    height: number
    transparent?: boolean
  }
}

export type IconButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>
export type IconButtonComponent = <C extends React.ElementType = 'button'>(
  props: IconButtonProps<C>
) => React.ReactElement | null

export const IconButton: IconButtonComponent = React.forwardRef(
  <Tag extends React.ElementType = 'button'>(
    {
      as,
      icon: Icon,
      iconProps: { transparent, ...iconProps },
      className,
      padding = 16,
      description,
      ...rest
    }: IconButtonProps<Tag>,
    ref?: PolymorphicRef<Tag>
  ) => {
    const Component = as || 'button'
    return (
      <Component
        ref={ref}
        type="button"
        {...rest}
        className={classNames(
          className,
          'group relative focus:outline-none border:none flex justify-center items-center'
        )}
      >
        <span
          className={classNames(
            transparent ? '' : 'bg-black/[0.08] dark:bg-white/[0.08]',
            'absolute rounded-full hover:bg-black/[0.12] hover:dark:bg-white/[0.12]'
          )}
          style={{ width: iconProps.width, height: iconProps.height, padding }}
        >
          {description && (
            <div
              className="relative hidden group-hover:block"
              style={{
                height: iconProps.height,
                paddingTop: padding,
                paddingBottom: padding,
              }}
            >
              <div className="left-0 right-0 absolute flex justify-center mt-1">
                <span className="bg-gray-600 text-white px-2 py-0.5 rounded-xl whitespace-nowrap text-[10px]">
                  {description}
                </span>
              </div>
            </div>
          )}
        </span>
        <Icon {...iconProps} />
      </Component>
    )
  }
)
