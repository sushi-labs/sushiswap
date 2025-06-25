"use client";

import { Card, DataTable, Loader } from "@sushiswap/ui";
import type { ColumnDef } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { MobileCard } from "../history-tables/mobile-card/mobile-card";
import {
  ACTION_COLUMN,
  BUY_COLUMN,
  CHAIN_COLUMN,
  SELL_COLUMN,
  TIME_COLUMN,
  VALUE_PNL_COLUMN,
  getPriceColumn,
} from "./columns";
import { getTwapLimitOrders, TwapOrder } from "src/lib/hooks/react-query/twap";
import { useTradeTablesContext } from "../trade-tables-context";
import { OrderStatus } from "@orbs-network/twap-sdk";
import { PaginationState } from "@tanstack/react-table";

export const LimitOrdersTable = () => {
  const [showInUsd, setShowInUsd] = useState(true);
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const priceCol = useMemo(
    () => getPriceColumn(showInUsd, setShowInUsd),
    [showInUsd]
  );

  const LIMIT_ORDER_COLUMNS: ColumnDef<TwapOrder>[] = useMemo(
    () => [
      BUY_COLUMN,
      SELL_COLUMN,
      CHAIN_COLUMN,
      VALUE_PNL_COLUMN,
      priceCol,
      TIME_COLUMN,
      ACTION_COLUMN,
    ],
    [priceCol]
  );

  const { orders, ordersLoading } = useTradeTablesContext();
  const data = useMemo(() => {
    return getTwapLimitOrders(orders).filter(
      (it) => it.status === OrderStatus.Open
    );
  }, [orders]);

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={() => {}}
      hasMore={false}
      loader={
        <div className="flex justify-center w-full py-4">
          <Loader size={16} />
        </div>
      }
    >
      <Card className="hidden overflow-hidden border-none bg-slate-50 dark:bg-slate-800 md:block !rounded-t-none xl:!rounded-lg">
        <DataTable
          columns={LIMIT_ORDER_COLUMNS}
          data={data}
          loading={ordersLoading}
          className="border-none [&_td]:h-[92px]"
          pagination={true}
          state={{
            pagination: paginationState,
          }}
          onPaginationChange={setPaginationState}
        />
      </Card>

      <Card className="p-5 space-y-6 border-accent !shadow-none border bg-slate-50 dark:bg-slate-800 md:hidden">
        {data.map((row) => (
          <div key={row.id} className="pb-6 border-b last:border-b-0 last:pb-0">
            <MobileCard row={row} columns={LIMIT_ORDER_COLUMNS} />
          </div>
        ))}
      </Card>
    </InfiniteScroll>
  );
};
