import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@sushiswap/ui'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAccountDrawer } from '../hooks/use-account-drawer'
import { ActiveOrders } from './active-orders'
import { CompletedOrders } from './completed-orders'

enum OrdersTab {
  Active = 'Active Orders',
  Completed = 'Completed Orders',
}
export enum CompletedOrderType {
  All = 'All',
  Market = 'Market',
  Limit = 'Limit',
  DCA = 'DCA',
}
export const PortfolioOrders = () => {
  const [tab, setTab] = useState<OrdersTab>(OrdersTab.Active)
  const [completedOrderFilter, setCompletedOrderFilter] = useState(
    CompletedOrderType.All,
  )
  const { handleAccountDrawer, subAccountTab } = useAccountDrawer()
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleTabChange = (newTab: OrdersTab) => {
    setTab(newTab)
    handleAccountDrawer({
      state: true,
      params: { name: 'subAccountTab', value: newTab },
    })
  }

  useEffect(() => {
    if (Object.values(OrdersTab).includes(subAccountTab as OrdersTab)) {
      setTab(subAccountTab as OrdersTab)
    }
  }, [subAccountTab])

  const content = useMemo(() => {
    switch (tab) {
      case OrdersTab.Active:
        return <ActiveOrders />
      case OrdersTab.Completed:
        return <CompletedOrders filter={completedOrderFilter} />
    }
  }, [tab, completedOrderFilter])

  // biome-ignore lint/correctness/useExhaustiveDependencies: need this to run only when completedOrderFilter changes
  useEffect(() => {
    scrollRef?.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [completedOrderFilter])

  return (
    <div className="flex flex-col gap-y-5 min-h-0">
      <div className="h-px w-[95%] mx-auto border border-accent" />
      <div className="flex items-center px-5 gap-2 justify-between">
        <div className="flex gap-x-2">
          {Object.values(OrdersTab).map((_tab) => (
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
        {tab === OrdersTab.Completed ? (
          <Select
            value={String(CompletedOrderType)}
            onValueChange={(val) => {
              setCompletedOrderFilter(val as CompletedOrderType)
            }}
          >
            <SelectTrigger asChild>
              <div className="flex cursor-pointer dark:bg-slate-800 bg-slate-50 !rounded-lg !border !border-accent text-xs !w-fit gap-2">
                <span>{completedOrderFilter}</span>
                <ChevronDownIcon strokeWidth={1} width={15} height={15} />
              </div>
            </SelectTrigger>
            <SelectContent className="!border !border-accent">
              {Object.values(CompletedOrderType).map((filter, idx) => (
                <SelectItem
                  key={idx}
                  value={filter}
                  title={filter}
                  className="text-base cursor-pointer"
                >
                  {filter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>

      <div
        ref={scrollRef}
        className="flex flex-col gap-y-5 px-5 overflow-y-auto hide-scrollbar"
      >
        {content}
      </div>
    </div>
  )
}
