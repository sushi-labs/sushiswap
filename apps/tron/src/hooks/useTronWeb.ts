import { useMemo } from "react";
import { IS_TESTNET } from "src/constants/is-testnet";
import TronWeb from "tronweb";

if (!process.env.NEXT_PUBLIC_TRON_PRO_API_KEY) {
	throw new Error("NEXT_PUBLIC_TRON_PRO_API_KEY is not set");
}

export const useTronWeb = () => {
	const tronWeb = useMemo(() => {
		const host = IS_TESTNET ? "https://api.shasta.trongrid.io/" : "https://api.trongrid.io/";
		return new TronWeb({
			fullHost: host,

			headers: { "TRON-PRO-API-KEY": process.env.NEXT_PUBLIC_TRON_PRO_API_KEY },
		});
	}, []);
	return { tronWeb };
};
