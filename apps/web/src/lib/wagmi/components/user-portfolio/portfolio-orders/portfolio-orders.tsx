import { Button } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { ActiveOrders } from './active-orders'

enum OrdersTab {
  Active = 'Active Orders',
  Completed = 'Completed Orders',
}

export const PortfolioOrders = () => {
  const [tab, setTab] = useState(OrdersTab.Active)

  const content = useMemo(() => {
    switch (tab) {
      case OrdersTab.Active:
        return <ActiveOrders />
      case OrdersTab.Completed:
        return <>completed order</>
    }
  }, [tab])

  return (
    <div className="flex flex-col gap-y-5 h-full">
      <div className="h-px w-[95%] mx-auto border border-accent" />
      <div className="flex px-5 gap-x-2">
        {Object.values(OrdersTab).map((_tab) => (
          <Button
            key={_tab}
            asChild
            size="xs"
            variant={_tab === tab ? 'secondary' : 'ghost'}
            onClick={() => {
              setTab(_tab)
            }}
            className="select-none !gap-1"
          >
            {_tab}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-y-5 px-5 h-[calc(100%-310px)] sm:h-[calc(100%-260px)] overflow-y-auto">
        {content}
      </div>
    </div>
  )
}
