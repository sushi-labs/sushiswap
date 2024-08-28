import { formatUSD, formatNumber } from "sushi/format";
import {
	Card,
	CardContent,
	CardDescription,
	CardGroup,
	CardHeader,
	CardItem,
	CardLabel,
	CardTitle,
	List,
	SkeletonCircle,
	SkeletonText,
} from "@sushiswap/ui";
import { Icon } from "src/components/General/Icon";
import { IToken } from "src/types/token-type";
import { useReserves } from "src/hooks/useReserves";
import { formatUnits, formatUnitsForInput } from "src/utils/formatters";
import { useStablePrice } from "src/hooks/useStablePrice";
import { LiquidityItem } from "./LiquidityItem";

export const PoolLiquidity = ({
	token0,
	token1,
	isLoading,
	pairAddress,
}: {
	token0: IToken | undefined;
	token1: IToken | undefined;
	isLoading: boolean;
	pairAddress: string;
}) => {
	const { data, isLoading: isLoadingReserves } = useReserves({ pairAddress, token0, token1 });

	const reserve0 = data?.[0]?.reserve ?? "0";
	const reserve0Formatted = formatUnitsForInput(reserve0, token0?.decimals ?? 0);

	const reserve1 = data?.[1]?.reserve ?? "0";
	const reserve1Formatted = formatUnitsForInput(reserve1, token1?.decimals ?? 0);

	const { data: token0Price } = useStablePrice({ token: token0 });
	const { data: token1Price } = useStablePrice({ token: token1 });

	const token0PoolPrice = (Number(token0Price) * Number(reserve0Formatted)).toString(10);
	const token1PoolPrice = (Number(token1Price) * Number(reserve1Formatted)).toString(10);

	const isLoadingData = isLoading || isLoadingReserves;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Pool Liquidity</CardTitle>
				<CardDescription>{formatUSD(Number(token0PoolPrice) + Number(token1PoolPrice))}</CardDescription>
			</CardHeader>
			<CardContent>
				<CardGroup>
					<CardLabel>Tokens</CardLabel>
					<LiquidityItem
						isLoading={isLoadingData}
						token={token0}
						amount={reserve0}
						usdAmount={token0PoolPrice}
					/>
					<LiquidityItem
						isLoading={isLoadingData}
						token={token1}
						amount={reserve1}
						usdAmount={token1PoolPrice}
					/>
				</CardGroup>
			</CardContent>
		</Card>
	);
};
