import { AnyTag, Polymorphic } from '@sushiswap/ui'
import React, { createElement, ReactElement } from 'react'

import { BentoApproveButton } from './BentoApproveButton'
import { TokenApproveButton } from './TokenApproveButton'

type OwnProps = {
  children:
    | ReactElement<typeof BentoApproveButton | typeof TokenApproveButton>
    | ReactElement<typeof BentoApproveButton | typeof TokenApproveButton>[]
}

export type ComponentsWrapper<Tag extends AnyTag> = Polymorphic<OwnProps, Tag>

export function ComponentsWrapper<Tag extends AnyTag = 'div'>({ as, children, ...props }: ComponentsWrapper<Tag>) {
  if (as) return createElement(as, props, children)
  return <>{children}</>
}
