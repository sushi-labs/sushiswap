import { SkeletonCircle, SkeletonText } from "@sushiswap/ui";
import { PoolNameCell } from "./PoolNameCell";
import { ICON_SIZE } from "src/constants/icon-size";
import { PoolTvlCell } from "./PoolTvlCell";
import { ColumnDef } from "@tanstack/react-table";
import { PoolReservesCell } from "./PoolReservesCell";

export const NAME_COLUMN: ColumnDef<any, unknown> = {
	id: "name",
	header: "Name",
	cell: (props) => <PoolNameCell data={props.row.original} />,
	meta: {
		skeleton: (
			<div className="flex items-center w-full gap-2">
				<div className="flex items-center">
					<SkeletonCircle radius={ICON_SIZE} />
					<SkeletonCircle radius={ICON_SIZE} className="-ml-[12px]" />
				</div>
				<div className="flex flex-col w-full">
					<SkeletonText fontSize="lg" />
				</div>
			</div>
		),
	},
};

export const TVL_COLUMN: ColumnDef<any, unknown> = {
	id: "TVL",
	header: "TVL",
	cell: (props) => <PoolTvlCell data={props.row.original} />,
	meta: {
		skeleton: (
			<div className="flex items-center w-full gap-2">
				<div className="flex flex-col w-full">
					<SkeletonText fontSize="lg" />
				</div>
			</div>
		),
	},
};

export const RESERVES_COLUMN: ColumnDef<any, unknown> = {
	id: "reserves",
	header: "Reserves",
	cell: (props) => <PoolReservesCell data={props.row.original} />,
	meta: {
		skeleton: (
			<div className="flex items-center w-full gap-2">
				<div className="flex flex-col w-full">
					<SkeletonText fontSize="lg" />
				</div>
			</div>
		),
	},
};
