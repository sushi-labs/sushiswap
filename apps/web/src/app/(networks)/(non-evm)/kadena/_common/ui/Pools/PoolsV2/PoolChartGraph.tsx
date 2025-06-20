"use client";

import { CardContent, CardDescription, CardHeader, CardTitle, SkeletonText } from "@sushiswap/ui";
import format from "date-fns/format";
import { type FC, useCallback, useMemo } from "react";

import * as echarts from "echarts";
import ReactEchartsCore from "echarts-for-react/lib/core";
import type { EChartsOption } from "echarts-for-react/lib/types";
import { PoolChartPeriod, chartPeriods } from "src/ui/pool/PoolChartPeriods";
import { PoolChartType } from "src/ui/pool/PoolChartTypes";
import { formatUSD } from "sushi/format";
import tailwindConfig from "tailwind.config.js";
import resolveConfig from "tailwindcss/resolveConfig";
import type { PoolByIdResponse } from "~kadena/_common/types/get-pool-by-id";

interface PoolChartProps {
	chart: "Volume" | "TVL" | "Fees";
	period: PoolChartPeriod;
	pool: PoolByIdResponse | undefined;
}

const tailwind = resolveConfig(tailwindConfig);

export const PoolChartGraph: FC<PoolChartProps> = ({ chart, period, pool }) => {
	//@DEV TODO isLoadingPool
	const isLoading = !pool;
	const isError = false;

	const [xData, yData]: [number[], number[]] = useMemo(() => {
		if (!pool?.charts) return [[], []];

		const chartData = pool.charts[chart.toLowerCase() as keyof typeof pool.charts] ?? [];
		// console.log('chartData', chartData)
		const cutoff = Date.now() - chartPeriods[period];

		const [x, y] = chartData.reverse().reduce<[number[], number[]]>(
			(acc, point) => {
				const timestampMs = new Date(point.timestamp).getTime();
				if (timestampMs >= cutoff) {
					acc[0].push(timestampMs);
					acc[1].push(Number(point.value));
				}
				return acc;
			},
			[[], []]
		);

		return [x.reverse(), y.reverse()];
	}, [chart, period, pool]);

	// Transient update for performance
	const onMouseOver = useCallback(
		({ name, value }: { name: string; value: number }) => {
			const valueNodes = document.getElementsByClassName("hoveredItemValue");
			const nameNodes = document.getElementsByClassName("hoveredItemName");

			if (valueNodes[0]) {
				valueNodes[0].innerHTML = formatUSD(value);
			}

			if (valueNodes[1]) {
				if (chart === PoolChartType.Volume) {
					valueNodes[1].innerHTML = formatUSD(value * Number(swapFee));
				}
			}

			if (nameNodes[0]) {
				nameNodes[0].innerHTML = format(
					new Date(Number.parseInt(name)),
					`dd MMM yyyy${chartPeriods[period] < chartPeriods[PoolChartPeriod.Week] ? " p" : ""}`
				);
			}
		},
		[period, chart]
	);

	const DEFAULT_OPTION: EChartsOption = useMemo(
		() => ({
			tooltip: {
				trigger: "axis",
				extraCssText: "z-index: 1000; padding: 0 !important; box-shadow: none !important",
				responsive: true,
				// @ts-ignore
				backgroundColor: "transparent",
				textStyle: {
					fontSize: 12,
					fontWeight: 600,
				},
				axisPointer: {
					lineStyle: {
						type: "dashed",
					},
				},
				formatter: (params: any) => {
					onMouseOver({ name: params[0].name, value: params[0].value });

					const date = new Date(Number(params?.[0]?.name));
					return `<div class="flex flex-col gap-0.5 paper bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded-xl overflow-hidden shadow-lg">
            <span class="text-sm dark:text-slate-50 text-gray-900 font-medium">${formatUSD(
							params[0].value
						)}</span>
            <span class="text-xs text-gray-500 dark:text-slate-400 font-medium">${
							date instanceof Date && !Number.isNaN(date?.getTime())
								? format(
										date,
										`dd MMM yyyy${chartPeriods[period] < chartPeriods[PoolChartPeriod.Week] ? " p" : ""}`
								  )
								: ""
						}</span>
          </div>`;
				},
				borderWidth: 0,
			},
			toolbox: {
				show: false,
			},
			grid: {
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
			},
			dataZoom: {
				show: false,
				start: 0,
				end: 100,
			},
			visualMap: {
				show: false,
				// @ts-ignore
				color: [tailwind.theme.colors.blue["500"]],
			},
			xAxis: [
				{
					show: false,
					type: "category",
					data: xData,
				},
			],
			yAxis: [
				{
					show: false,
					type: "value",
					name: "Volume",
				},
			],
			series: [
				{
					name: "Volume",
					type: chart === PoolChartType.TVL ? "line" : "bar",
					smooth: true,
					xAxisIndex: 0,
					yAxisIndex: 0,
					barWidth: "70%",
					itemStyle: {
						color: "blue",
						normal: {
							barBorderRadius: 2,
						},
					},
					areaStyle: {
						// @ts-ignore
						color: tailwind.theme.colors.blue["500"],
					},
					animationEasing: "elasticOut",
					animationDelayUpdate: (idx: number) => idx * 2,
					data: yData,
				},
			],
		}),
		[xData, chart, yData, onMouseOver, period]
	);

	const defaultValue = yData[yData.length - 1] || 0;

	// TODO: Get swap fee from pool
	const swapFee = 0.003; //constant
	const noData = !yData.length && !isLoading && !isError;
	return (
		<>
			<CardHeader>
				<CardTitle>
					<span className="hoveredItemValue">{formatUSD(defaultValue)}</span>{" "}
					{chart === PoolChartType.Volume && (
						<span className="text-sm font-medium text-gray-600 dark:text-slate-300">
							<span className="text-xs top-[-2px] relative">•</span>{" "}
							<span className="hoveredItemValue">{formatUSD(defaultValue * Number(swapFee))}</span> earned
						</span>
					)}
				</CardTitle>
				<CardDescription>
					{isLoading ? (
						<SkeletonText fontSize="sm" />
					) : isError || !xData.length ? (
						<div className="text-sm h-[1ch] w-full" />
					) : (
						<div className="text-sm text-gray-500 dark:text-slate-500 hoveredItemName">
							{format(new Date(xData[xData.length - 1] * 1000), "dd MMM yyyy HH:mm")}
						</div>
					)}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{noData || (isError && !isLoading) ? (
					<div className="flex h-[400px] w-full items-center justify-center text-primary font-medium">
						No data available
					</div>
				) : (
					<ReactEchartsCore echarts={echarts} option={DEFAULT_OPTION} style={{ height: 400 }} />
				)}
			</CardContent>
		</>
	);
};
