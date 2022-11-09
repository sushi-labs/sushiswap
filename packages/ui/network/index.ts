import { FC } from 'react'

import { Selector, SelectorProps } from './Selector'
import { SelectorMenu, SelectorMenuProps } from './SelectorMenu'
import { SelectorTxn, SelectorTxnProps } from './SelectorTxn'

type Network = {
  Selector: FC<SelectorProps>
  SelectorTxn: FC<SelectorTxnProps>
  SelectorMenu: FC<SelectorMenuProps>
}

export const Network: Network = {
  Selector,
  SelectorTxn,
  SelectorMenu,
}