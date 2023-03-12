import React, {FC} from 'react';
import {TradeLegType, UseTradeReturn} from "@sushiswap/react-query";
import {UseCrossChainTradeReturn} from "../../lib/useCrossChainTrade/types";
import ReactECharts from 'echarts-for-react';

interface Props {
    trade?: UseTradeReturn | UseCrossChainTradeReturn;
}

interface SankeyParamsFormatter {
    dataType: string;
    data: {
        target: string;
        poolName: string;
        source: string;
        value: string;
    };
}

interface SankeyLink  {
    source: string;
    target: string;
    value: number;
    poolName: string;
    assumedAmountIn: number;
    assumedAmountOut: number;
}


export const Sankey: FC<Props> = ({ trade }) => {
    const { legs } = trade?.route || {};
    const data = legs && getData(legs);
    const links = legs && getLinks(legs);

    const options = {
        color: ["#7b86ff", "#ff65f5", "#57abff", "#7b82ff"],
        tooltip: {
            trigger: "item",
            triggerOn: "mousemove",
            formatter: (params: SankeyParamsFormatter) => {
                if (params.dataType === "node") return;
                return `${Number(params.data.value).toFixed(2)}% ${params.data.source}/${params.data.target} ${params.data.poolName}`;
            }
        },
        series: [
            {
            type: 'sankey',
            data,
            links,
            label: {
                show: true,
                color: '#ffffff',
            },
            draggable: false,
            emphasis: {
                focus: "adjacency"
            },
            itemStyle: {
                borderWidth: 1,
            },
            lineStyle: {
                color: 'source',
                curveness: 0.5
            }
        },
    ],
    };

    return (
           <ReactECharts option={options} />
    );
};

function getData(legs: TradeLegType[]): { name: string }[] {
    return legs.flatMap((leg) => [
        { name: leg.tokenFrom.symbol },
        { name: leg.tokenTo.symbol },
    ]).filter((val, idx, arr) => arr.findIndex(t => (t.name === val.name)) === idx);
}

function getLinks(legs: TradeLegType[]): SankeyLink[] {
    const tokenValue = new Map();
    tokenValue.set(legs?.[0]?.tokenFrom?.tokenId, 100);

    return legs?.reduce((links: SankeyLink[], leg: TradeLegType) => {
        const fromValue = tokenValue.get(leg.tokenFrom.tokenId) || 0;
        const legValue = fromValue * leg.absolutePortion;
        const value = Math.round(fromValue * leg.absolutePortion);

        const link: SankeyLink = {
            source: leg.tokenFrom.symbol,
            target: leg.tokenTo.symbol,
            value: value,
            poolName: leg.poolName,
            assumedAmountIn: leg.assumedAmountIn,
            assumedAmountOut: leg.assumedAmountOut,
        };

        const toValue = tokenValue.get(leg.tokenTo.tokenId) || 0;
        tokenValue.set(leg.tokenTo.tokenId, toValue + legValue);

        return [...links, link];
    }, []);
}
