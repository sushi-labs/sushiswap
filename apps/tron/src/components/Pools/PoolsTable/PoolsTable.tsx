import { DataTable } from "@sushiswap/ui";
import { TVL_COLUMN, NAME_COLUMN, RESERVES_COLUMN } from "./PoolColumns";
import { usePools } from "src/hooks/usePools";
import { PaginationState } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@sushiswap/hooks";

export type IRowData = {
	name: string;
	pairAddress: string;
	token0Address: string;
	token1Address: string;
	reserve0: string;
	reserve1: string;
};

type PoolsTableProps = {
	query: string;
	handlePoolsOnView: (pools: number) => void;
};

export const PoolsTable = ({ query, handlePoolsOnView }: PoolsTableProps) => {
	const [paginationState, setPaginationState] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const debouncedQuery = useDebounce(query, 250);
	const { data, isLoading } = usePools();

	const filteredData = useMemo(() => {
		if (!data) return [];
		if (!debouncedQuery) return data;
		const lowercasedQuery = debouncedQuery.toLowerCase()?.replaceAll(" ", "");

		return data.filter((pool) => {
			return (["pairAddress", "token0Address", "token1Address"] as Array<keyof (typeof data)[0]>).some(
				(key) => pool[key].toLowerCase().includes(lowercasedQuery)
			);
		});
	}, [data, debouncedQuery]);

	useEffect(() => {
		if (filteredData && !isLoading) {
			handlePoolsOnView(filteredData.length);
		}
	}, [filteredData, isLoading]);

	return (
		<DataTable
			loading={isLoading}
			data={
				filteredData?.map((pool) => ({
					name: pool.token0Address + "/" + pool.token1Address,
					pairAddress: pool.pairAddress,
					token0Address: pool.token0Address,
					token1Address: pool.token1Address,
					reserve0: pool.reserve0,
					reserve1: pool.reserve1,
				})) ?? []
			}
			columns={[NAME_COLUMN, TVL_COLUMN, RESERVES_COLUMN]}
			linkFormatter={(data) => {
				const token0 = data.name.split("/")[0];
				const token1 = data.name.split("/")[1];
				return `/pool/${token0}:${token1}:${data.pairAddress}`;
			}}
			pagination={true}
			externalLink={false}
			onPaginationChange={setPaginationState}
			state={{
				pagination: paginationState,
			}}
		/>
	);
};
