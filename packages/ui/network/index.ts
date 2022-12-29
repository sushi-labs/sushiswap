import { FC } from 'react'

import { Selector, SelectorProps } from './Selector'
import { SelectorMenu, SelectorMenuProps } from './SelectorMenu'

type Network = {
  Selector: FC<SelectorProps>
  SelectorMenu: FC<SelectorMenuProps>
}

export const Network: Network = {
  Selector,
  SelectorMenu,
}
