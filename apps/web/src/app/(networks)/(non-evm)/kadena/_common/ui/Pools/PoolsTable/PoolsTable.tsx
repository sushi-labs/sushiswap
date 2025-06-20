"use client";

import { Card, CardHeader, CardTitle, DataTable, Loader, SkeletonText } from "@sushiswap/ui";
import type { ColumnDef, PaginationState, SortingState, TableState } from "@tanstack/react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePoolFilters } from "src/ui/pool";
import { useAllPools } from "~kadena/_common/lib/hooks/use-all-pools";
import type { Pool } from "~kadena/_common/types/get-all-pools-type";
import {
	APR_COLUMN,
	FEES_1D_COLUMN,
	NAME_COLUMN,
	TRANSACTIONS_1D_COLUMN,
	TVL_COLUMN,
	VOLUME_1D_COLUMN,
} from "./PoolColumns";

const COLUMNS = [
	NAME_COLUMN,
	TVL_COLUMN,
	VOLUME_1D_COLUMN,
	FEES_1D_COLUMN,
	TRANSACTIONS_1D_COLUMN,
	APR_COLUMN,
] satisfies ColumnDef<Pool, unknown>[];

export const PoolsTable = () => {
	const { tokenSymbols } = usePoolFilters();

	const [sorting, setSorting] = useState<SortingState>([{ id: "liquidityUSD", desc: true }]);

	const { data, fetchNextPage, hasNextPage, isLoading } = useAllPools({
		first: 10,
		orderBy: "TVL_USD_DESC",
	});

	const rowLink = useCallback((row: Pool) => {
		return `/kadena/pool/${encodeURIComponent(row.id)}`;
	}, []);

	const filtered = useMemo(() => {
		if (!data?.pools) return [] as Pool[];

		return data.pools.filter((pool) => {
			if (tokenSymbols.length) {
				if (
					!tokenSymbols.every((symbol) => {
						symbol = symbol.toLowerCase();

						const poolName = `${pool.token0.name}-${pool.token1.name}`;

						if (poolName.toLowerCase().includes(symbol)) return true;

						return false;
					})
				) {
					return false;
				}
			}

			return true;
		});
	}, [tokenSymbols, data?.pools]);

	const state: Partial<TableState> = useMemo(() => {
		return {
			sorting,
			pagination: {
				pageIndex: 0,
				pageSize: filtered?.length,
			},
		};
	}, [sorting, filtered]);

	return (
		<InfiniteScroll
			dataLength={data?.pools.length ?? 0}
			next={fetchNextPage}
			hasMore={hasNextPage}
			loader={
				<div className="flex justify-center w-full py-4">
					<Loader size={16} />
				</div>
			}>
			<Card>
				<CardHeader>
					<CardTitle>
						{isLoading ? (
							<div className="!w-28 !h-[18px]">
								<SkeletonText />
							</div>
						) : (
							<span>
								Pools <span className="text-gray-400 dark:text-slate-500">({filtered.length})</span>
							</span>
						)}
					</CardTitle>
				</CardHeader>
				<DataTable
					state={state}
					onSortingChange={setSorting}
					loading={isLoading}
					linkFormatter={rowLink}
					columns={COLUMNS}
					data={filtered}
				/>
			</Card>
		</InfiniteScroll>
	);
};
