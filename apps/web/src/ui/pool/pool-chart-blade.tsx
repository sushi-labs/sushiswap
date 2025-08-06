"use client";

import React, { type FC, useState } from "react";
import { Wrapper } from "../swap/trade/wrapper";
import { PoolChartGraph } from "./PoolChartGraph";
import { PoolChartPeriod, PoolChartPeriods } from "./PoolChartPeriods";
import { PoolChartType, PoolChartTypes } from "./PoolChartTypes";

const charts = [PoolChartType.Volume, PoolChartType.TVL, PoolChartType.Fees] as const;
const periods = [
	PoolChartPeriod.Day,
	PoolChartPeriod.Week,
	PoolChartPeriod.Month,
	PoolChartPeriod.Year,
	PoolChartPeriod.All,
];

interface PoolChartBladeProps {
	pool: any;
}

const PoolChartBlade: FC<PoolChartBladeProps> = ({ pool }) => {
	const [chart, setChart] = useState<(typeof charts)[number]>(charts[0]);
	const [period, setPeriod] = useState<PoolChartPeriod>(PoolChartPeriod.Month);

	return (
		<Wrapper className="!p-0" enableBorder>
			<div className="flex flex-col flex-wrap gap-4 px-6 py-4 border-b lg:items-center lg:justify-between border-accent lg:flex-row">
				<div className="flex">
					<PoolChartTypes charts={charts} selectedChart={chart} setChart={setChart} />
				</div>
				<div className="flex">
					<PoolChartPeriods periods={periods} selectedPeriod={period} setPeriod={setPeriod} />
				</div>
			</div>
			<PoolChartGraph
				chart={chart}
				period={period}
				//@ts-expect-error - ok until we have a blade pool type in moment
				pool={{
					address: "0x655edce464cc797526600a462a8154650eee4b77",
					chainId: 1,
				}}
				protocol={"BLADE"}
			/>
		</Wrapper>
	);
};

export { PoolChartBlade };
