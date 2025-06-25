"use client";

import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@sushiswap/ui";
import { useMemo } from "react";
import { DCAOrdersTable } from "../dca-orders-table/dca-orders-table";
import { HistoryTable } from "../history-tables/history-table";
import { LimitOrdersTable } from "../limit-orders-table/limit-orders-table";
import { TradeTableFilters } from "./trade-table-filters";
import {
  TABS,
  TradeTablesProvider,
  useTradeTablesContext,
} from "../trade-tables-context";
import { OrderStatus } from "@orbs-network/twap-sdk";
import {
  getTwapDcaOrders,
  getTwapLimitOrders,
} from "src/lib/hooks/react-query/twap";

const useTabs = () => {
  const { orders, setCurrentTab, currentTab } = useTradeTablesContext();

  const tabs = useMemo(() => {
    const openLimitOrdersCount = getTwapLimitOrders(orders).filter(
      (order) => order.status === OrderStatus.Open
    ).length;
    const openDcaOrdersCount = getTwapDcaOrders(orders).filter(
      (order) => order.status === OrderStatus.Open
    ).length;

    return [
      {
        label: `Limit Orders ${
          openLimitOrdersCount > 0 ? `(${openLimitOrdersCount})` : ""
        }`,
        value: TABS.LIMIT_ORDERS,
        component: <LimitOrdersTable />,
      },
      {
        label: `DCA Orders ${
          openDcaOrdersCount > 0 ? `(${openDcaOrdersCount})` : ""
        }`,
        value: TABS.DCA_ORDERS,
        component: <DCAOrdersTable />,
      },
      {
        label: "History",
        value: TABS.HISTORY,
        component: <HistoryTable />,
      },
    ];
  }, [orders]);

  return { tabs, setCurrentTab, currentTab };
};

export const TradeTableTabs = () => {
  return (
    <TradeTablesProvider>
      <Content />
    </TradeTablesProvider>
  );
};

const Content = () => {
  const { tabs, setCurrentTab, currentTab } = useTabs();

  return (
    <Tabs
      defaultValue={tabs[0].value}
      onValueChange={(value) => setCurrentTab(value as TABS)}
      className="-mx-5 md:mx-0"
    >
      <div className="flex flex-col items-start justify-between xl:items-center xl:flex-row">
        <div className="w-full p-3 bg-white border-b rounded-t-lg xl:px-0 md:border-none xl:!bg-background dark:bg-background md:dark:bg-slate-800 border-accent overflow-x-auto hide-scrollbar">
          <TabsList className="!px-2.5 w-full md:!px-0 gap-2 md:!pb-0 !pb-6 !justify-start bg-white xl:!bg-transparent dark:bg-background md:dark:bg-slate-800 !border-none rounded-none shadow-none md:rounded-lg md:border-none md:mx-0 xl:rounded-lg !rounded-b-none">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="!bg-transparent xl:!bg-background !border-none !shadow-none !px-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 !ring-transparent"
              >
                <Button
                  key={tab.value}
                  asChild
                  size="sm"
                  variant={currentTab === tab.value ? "tertiary" : "ghost"}
                  className={"select-none !gap-1"}
                >
                  {tab.label}
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TradeTableFilters />
      </div>
      {tabs.map((tab) => {
        return (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="px-5 !mt-0 !pt-2 md:!pt-0 xl:!pt-2 bg-[#F9FAFB] dark:bg-slate-900 md:px-0 pb-[86px] md:bg-white xl:bg-transparent md:pb-0 rounded-b-xl"
          >
            {tab.component}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};
