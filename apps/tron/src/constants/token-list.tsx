import { IToken } from "src/types/token-type";
import { IS_TESTNET } from "./is-testnet";

export const TRON: IToken = {
	address: "TRON",
	decimals: 6,
	logoURI:
		"https://static.tronscan.org/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png?t=1598430824415",
	name: "TRX (TRON)",
	symbol: "TRX",
};

export const WTRX: IToken = {
	address: "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR",
	decimals: 6,
	logoURI:
		"https://static.tronscan.org/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png?t=1598430824415",
	name: "Wrapped TRX",
	symbol: "WTRX",
};

export const INTERMEDIATE_TOKEN = WTRX;

const MAINNET_TOKENS: IToken[] = [
	{
		address: "TRON",
		decimals: 6,
		logoURI:
			"https://static.tronscan.org/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png?t=1598430824415",
		name: "TRX (TRON)",
		symbol: "TRX",
	},
	{
		address: "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR",
		decimals: 6,
		logoURI:
			"https://static.tronscan.org/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png?t=1598430824415",
		name: "Wrapped TRX",
		symbol: "WTRX",
	},
	{
		address: "TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4",
		decimals: 18,
		logoURI: "https://static.tronscan.org/production/logo/TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4.png",
		name: "TrueUSD",
		symbol: "TUSD",
	},
	{
		address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
		decimals: 6,
		logoURI: "https://static.tronscan.org/production/logo/usdtlogo.png",
		name: "Tether USD",
		symbol: "USDT",
	},
	{
		address: "TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn",
		decimals: 18,
		logoURI: "https://static.tronscan.org/production/upload/logo/TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn.png",
		name: "Decentralized USD",
		symbol: "USDD",
	},
];

const TESTNET_TOKENS: IToken[] = [
	{
		address: "TRON",
		decimals: 6,
		logoURI:
			"https://static.tronscan.org/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png?t=1598430824415",
		name: "TRX (TRON)",
		symbol: "TRX",
	},
	{
		address: "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR", //mainnet address currently
		decimals: 6,
		logoURI:
			"https://static.tronscan.org/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png?t=1598430824415",
		name: "Wrapped TRX",
		symbol: "WTRX",
	},
	{
		address: "TSdZwNqpHofzP6BsBKGQUWdBeJphLmF6id",
		decimals: 6,
		logoURI: "https://static.tronscan.org/production/upload/logo/TEkxiTehnzSmSe2XqrBj4w32RUN966rdz81.png",
		name: "USDC Coin",
		symbol: "USDC",
	},
];

export const DEFAULT_TOKEN_LIST = IS_TESTNET ? TESTNET_TOKENS : MAINNET_TOKENS;

export const DEFAULT_TOKEN_LIST_WITH_KEY = () => {
	return DEFAULT_TOKEN_LIST.reduce<Record<string, IToken>>(
		(acc, { address, decimals, name, symbol, logoURI }) => {
			acc[address] = {
				name,
				decimals,
				symbol,
				address,
				logoURI,
			};
			return acc;
		},
		{}
	);
};

export const STABLE_TOKENS = DEFAULT_TOKEN_LIST.filter(
	(token) => token.symbol === "USDT" || token.symbol === "TUSD" || token.symbol === "USDD"
);
