// builder must have at least 100 USDC in perps account value.
export const BUILDER_FEE_RECEIVER = '0x12EE177DB3cEafedc639D023A29CC8588DB3A4b9' //sushi ledger

//Builder fee in 0.1bps (1 = 0.0001%). Max 100 for perps (0.1%), 1000 for spot (1%).
export const BUILDER_FEE_PERPS = 60 // 60 = 0.06% fee for perps
export const BUILDER_FEE_SPOT = 40 // 40 = 0.04% fee for spot
export const BUILDER_FEE_PERPS_PERCENTAGE = BUILDER_FEE_PERPS / 1000
export const BUILDER_FEE_SPOT_PERCENTAGE = BUILDER_FEE_SPOT / 1000

export const BUILDER_FEE_PERPS_BPS = BUILDER_FEE_PERPS_PERCENTAGE / 100
export const BUILDER_FEE_SPOT_BPS = BUILDER_FEE_SPOT_PERCENTAGE / 100

export const TOAST_AUTOCLOSE_TIME = 1000

// https://hyperliquid.gitbook.io/hyperliquid-docs/trading/builder-codes#api-for-builders
