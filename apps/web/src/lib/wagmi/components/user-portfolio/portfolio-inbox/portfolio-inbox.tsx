import { Button } from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
import { useAccountDrawer } from '../hooks/use-account-drawer'
import { AllInbox } from './all-inbox'
import { Product } from './product'
import { Transactions } from './transactions'

enum InboxTab {
  All = 'All',
  Transactions = 'Transactions',
  Product = 'Product',
}

export const PortfolioInbox = () => {
  const [tab, setTab] = useState(InboxTab.All)
  const { handleAccountDrawer, subAccountTab } = useAccountDrawer()

  const handleTabChange = (newTab: InboxTab) => {
    setTab(newTab)
    handleAccountDrawer({
      state: true,
      params: { name: 'subAccountTab', value: newTab },
    })
  }

  useEffect(() => {
    if (Object.values(InboxTab).includes(subAccountTab as InboxTab)) {
      setTab(subAccountTab as InboxTab)
    }
  }, [subAccountTab])

  const content = useMemo(() => {
    switch (tab) {
      case InboxTab.All:
        return <AllInbox />
      case InboxTab.Transactions:
        return <Transactions />
      case InboxTab.Product:
        return <Product />
    }
  }, [tab])

  return (
    <div className="flex flex-col gap-y-5 min-h-0">
      <div className="h-px w-[95%] mx-auto border border-accent" />
      <div className="flex items-center px-5 gap-2 justify-between">
        <div className="flex gap-x-2">
          {Object.values(InboxTab).map((_tab) => (
            <Button
              key={_tab}
              asChild
              size="xs"
              variant={_tab === tab ? 'secondary' : 'ghost'}
              onClick={() => {
                handleTabChange(_tab)
              }}
              className="select-none !gap-1"
            >
              {_tab}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-y-5 px-5 overflow-y-auto hide-scrollbar">
        {content}
      </div>
    </div>
  )
}
