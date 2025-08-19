import { Card, DataTable } from "@sushiswap/ui";
import type { SortingState, TableState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Trending } from "./trending";
import { LPPositionsTableHeader } from "./lp-positions-table-header";

const data: any[] = [];

export const LPPositionsTable = () => {
	const [sorting, setSorting] = useState<SortingState>([{ id: "size", desc: true }]);
	const state: Partial<TableState> = useMemo(() => {
		return {
			sorting,
			pagination: {
				pageIndex: 0,
				pageSize: data?.length,
			},
		};
	}, [sorting]);

	return (
		// <InfiniteScroll
		//   dataLength={data.length}
		//   next={fetchNextPage}
		//   hasMore={data.length < (count ?? 0)}
		//   loader={
		//     <div className="flex justify-center w-full py-4">
		//       <Loader size={16} />
		//     </div>
		//   }
		// >
		<Card className="overflow-hidden">
			<Trending />
			<LPPositionsTableHeader />
			<DataTable
				state={state}
				onSortingChange={setSorting}
				loading={false}
				// linkFormatter={(row) =>
				//   `/${ChainKey[row.chainId]}/pool/${
				//     row.protocol === SushiSwapProtocol.SUSHISWAP_V2 ? 'v2' : 'v3'
				//   }/${row.address}`
				// }

				columns={[]}
				data={data}
				className="border-t-0"
			/>
		</Card>
		// </InfiniteScroll>
	);
};
