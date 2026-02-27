// builder must have at least 100 USDC in perps account value.
export const BUILDER_FEE_RECEIVER = '0x47Ef3bF350F70724F2fd34206990cdE9C3A6B6F0' //todo: update address

//Builder fee in 0.1bps (1 = 0.0001%). Max 100 for perps (0.1%), 1000 for spot (1%).
export const BUILDER_FEE_PERPS = 100
export const BUILDER_FEE_SPOT = 1000
export const BUILDER_FEE_PERPS_PERCENTAGE = BUILDER_FEE_PERPS / 1000
export const BUILDER_FEE_SPOT_PERCENTAGE = BUILDER_FEE_SPOT / 1000

export const TOAST_AUTOCLOSE_TIME = 1000
