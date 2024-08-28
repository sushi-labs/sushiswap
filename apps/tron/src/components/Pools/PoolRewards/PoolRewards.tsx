import {
	Card,
	CardContent,
	CardDescription,
	CardGroup,
	CardHeader,
	CardLabel,
	CardTitle,
} from "@sushiswap/ui";
import { CardItem } from "@sushiswap/ui";
import Image from "next/image";
import { WTRX } from "src/constants/token-list";

export const PoolRewards = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Pool Rewards</CardTitle>
				<CardDescription>
					Distributed to everyone who provides liquidity to this pool. <br />
				</CardDescription>
			</CardHeader>
			<CardContent>
				<CardGroup>
					<CardLabel>Tokens (per day)</CardLabel>
					<CardItem
						title={
							<div className="font-medium flex items-center gap-2 text-muted-foreground">
								<Image src={WTRX?.logoURI ?? ""} className="rounded-full" height={18} width={18} alt="" /> TRX
							</div>
						}>
						<span className="flex gap-1 font-semibold">{"0"}</span>
					</CardItem>
				</CardGroup>
			</CardContent>
		</Card>
	);
};
