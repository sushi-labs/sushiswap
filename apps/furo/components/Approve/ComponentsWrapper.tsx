import { BentoApproveButton } from 'components/Approve/BentoApproveButton'
import { TokenApproveButton } from 'components/Approve/TokenApproveButton'
import React, { FC, memo } from 'react'

export interface ComponentsWrapper {
  children:
    | React.ReactElement<typeof BentoApproveButton | typeof TokenApproveButton>
    | React.ReactElement<typeof BentoApproveButton | typeof TokenApproveButton>[]
}

export const ComponentsWrapper: FC<ComponentsWrapper> = memo(({ children }) => {
  return <>{children}</>
})
