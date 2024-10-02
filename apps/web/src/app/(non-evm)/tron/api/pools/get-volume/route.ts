import { NextResponse } from "next/server";
import { BITQUERY_ENDPOINT } from "~tron/_common/lib/bitquery/bitquery-endpoint";
import { getOptions } from "~tron/_common/lib/bitquery/bitquery-options";
import { getTradeAmountsForDay } from "~tron/_common/lib/bitquery/queries/getTradeAmountsForDay";

export async function GET(req: Request): Promise<NextResponse> {
	const { searchParams } = new URL(req.url);
	const pairAddress = searchParams.get("pairAddress");

	if (!pairAddress) {
		return NextResponse.json({
			success: false,
			message: "pairAddress is required",
		});
	}
	console.log({ pairAddress });
	try {
		const startDate = new Date().setHours(0, 0, 0, 0);
		const endDate = new Date().setHours(23, 59, 59, 999);
		console.log(new Date(startDate).toISOString());
		console.log(new Date(endDate).toISOString());
		const query = getTradeAmountsForDay(
			new Date(startDate).toISOString(),
			new Date(endDate).toISOString(),
			pairAddress
		);

		const options = getOptions(query);

		const res = await fetch(BITQUERY_ENDPOINT, {
			...options,
			next: { revalidate: 60 },
		});
		if (!res.ok) {
			throw new Error("Failed to fetch data from Bitquery API");
		}
		const data = await res.json();

		return NextResponse.json({ ...data });
	} catch (error) {
		console.error(error);
		return NextResponse.json(undefined);
	}
}
