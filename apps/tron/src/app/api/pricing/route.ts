import { NextResponse } from "next/server";
import { BITQUERY_ENDPOINT } from "src/bitquery/bitquery-endpoint";
import { getOptions } from "src/bitquery/bitquery-options";
import { getTronInUSDT } from "src/bitquery/queries/getTronInUSDT";

export async function GET(): Promise<NextResponse> {
	try {
		const query = getTronInUSDT();

		const options = getOptions(query);

		const res = await fetch(BITQUERY_ENDPOINT, { ...options, next: { revalidate: 120 } }); // revalidate every 2 minutes
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
