import type { Address } from "@wagmi/core";

// As a start...
// Cheers co-pilt bruh
export type CurrencyId =
  | Address
  | "ETH"
  | "WETH"
  | "USDC"
  | "DAI"
  | "USDT"
  | "WBTC"
  | "WETH9";
