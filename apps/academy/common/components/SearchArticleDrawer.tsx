import { FC } from 'react'

import { Drawer } from './Drawer'

interface SearchArticleDrawer {
  isOpen: boolean
  onClose: () => void
}
export const SearchArticleDrawer: FC<SearchArticleDrawer> = ({ isOpen, onClose }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} header="Search for Article">
      aa
    </Drawer>
  )
}
