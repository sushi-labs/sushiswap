import { BentoApproveButton } from 'components/Approve/BentoApproveButton'
import { TokenApproveButton } from 'components/Approve/TokenApproveButton'
import React from 'react'

export type ComponentsWrapper<Tag extends keyof JSX.IntrinsicElements> = {
  as?: keyof JSX.IntrinsicElements
  children:
    | React.ReactElement<typeof BentoApproveButton | typeof TokenApproveButton>
    | React.ReactElement<typeof BentoApproveButton | typeof TokenApproveButton>[]
} & JSX.IntrinsicElements[Tag]

export function ComponentsWrapper<Tag extends keyof JSX.IntrinsicElements = 'div'>({
  as,
  children,
  ...props
}: ComponentsWrapper<Tag>) {
  if (as) return React.createElement(as, props, children)
  return <>{children}</>
}
