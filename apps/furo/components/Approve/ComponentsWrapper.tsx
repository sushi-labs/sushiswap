import { AnyTag, Polymorphic } from '@sushiswap/ui'
import { BentoApproveButton } from 'components/Approve/BentoApproveButton'
import { TokenApproveButton } from 'components/Approve/TokenApproveButton'
import React from 'react'

type OwnProps = {
  children:
    | React.ReactElement<typeof BentoApproveButton | typeof TokenApproveButton>
    | React.ReactElement<typeof BentoApproveButton | typeof TokenApproveButton>[]
}

export type ComponentsWrapper<Tag extends AnyTag> = Polymorphic<OwnProps, Tag>

export function ComponentsWrapper<Tag extends AnyTag = 'div'>({ as, children, ...props }: ComponentsWrapper<Tag>) {
  if (as) return React.createElement(as, props, children)
  return <>{children}</>
}
