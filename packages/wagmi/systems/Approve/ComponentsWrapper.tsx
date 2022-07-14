import { classNames } from '@sushiswap/ui'
import React, { FC, ReactElement } from 'react'

import { DefaultButtonInterface } from './DefaultButton'

type ComponentsWrapper = {
  className?: string
  children:
    | ReactElement<DefaultButtonInterface>
    | Array<ReactElement<DefaultButtonInterface> | undefined>
    | Array<Array<ReactElement<DefaultButtonInterface>> | ReactElement<DefaultButtonInterface> | undefined>
    | undefined
}

export const ComponentsWrapper: FC<ComponentsWrapper> = ({ className, children }) => {
  return <div className={classNames(className, 'relative flex gap-6')}>{children}</div>
}
