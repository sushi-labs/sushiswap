import { PolymorphicComponentProps } from '@sushiswap/ui'
import React, { createElement, ReactElement } from 'react'

import { BentoApproveButton } from './BentoApproveButton'
import { TokenApproveButton } from './TokenApproveButton'

type OwnProps = {
  children:
    | ReactElement<typeof BentoApproveButton | typeof TokenApproveButton>
    | Array<ReactElement<typeof BentoApproveButton | typeof TokenApproveButton> | undefined>
    | Array<
        | Array<ReactElement<typeof BentoApproveButton | typeof TokenApproveButton>>
        | ReactElement<typeof BentoApproveButton | typeof TokenApproveButton>
        | undefined
      >
    | undefined
}

export type ComponentsWrapperProps<C extends React.ElementType> = PolymorphicComponentProps<C, OwnProps>
export type ComponentsWrapperComponent = <C extends React.ElementType = 'div'>(
  props: ComponentsWrapperProps<C>
) => React.ReactElement | null

export const ComponentsWrapper: ComponentsWrapperComponent = ({ as, children, ...props }) => {
  if (as) return createElement(as, props, children)
  return <>{children}</>
}
