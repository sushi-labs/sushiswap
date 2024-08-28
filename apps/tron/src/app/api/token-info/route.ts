import { NextResponse } from "next/server";
import { BITQUERY_ENDPOINT } from "src/bitquery/bitquery-endpoint";
import { getOptions } from "src/bitquery/bitquery-options";
import { getTokenInfo } from "src/bitquery/queries/getTokenInfo";

export async function GET(req: Request): Promise<NextResponse> {
	const { searchParams } = new URL(req.url);
	const contractAddress = searchParams.get("contractAddress");

	if (!contractAddress) {
		return NextResponse.json({ success: false, message: "contractAddress is required" });
	}

	try {
		const query = getTokenInfo(contractAddress);

		const options = getOptions(query);

		const res = await fetch(BITQUERY_ENDPOINT, { ...options, next: { revalidate: Infinity } });
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
