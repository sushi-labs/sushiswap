import type { UseEvmTradeReturn } from 'src/lib/hooks/react-query'
import { EVM_TRADE_GAS_MARGIN_PERCENT } from 'src/lib/hooks/react-query/trade/evm-trade-gas-margin'
import { getFeeString } from 'src/lib/swap/fee'
import { Amount, type Fraction, Price, ZERO, subtractSlippage } from 'sushi'
import {
  type EvmAddress,
  EvmChainId,
  type EvmCurrency,
  EvmNative,
  SUSHISWAP_V3_QUOTER,
  type SushiSwapV3ChainId,
  UI_FEE_COLLECTOR_ADDRESS,
  addGasMargin,
  evmNativeAddress,
} from 'sushi/evm'
import { type Hex, encodeFunctionData, encodePacked, parseAbi } from 'viem'
import type {
  CreateDirectPoolTradeParams,
  UseDirectPoolTradeParams,
} from './types'

const ROUTE_PROCESSOR_ADDRESS = {
  [EvmChainId.ROBINHOOD]: '0x0e867974275cd31c25015c2753c9d75f9f355379',
} as const

const routeProcessorAbi = parseAbi([
  'function processRouteWithTransferValueOutput(address transferValueTo, uint256 amountValueTransfer, address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOutQuote, address to, bytes route, bool takeSurplus, uint32 referralCode) payable returns (uint256 amountOut)',
])

const redSnwapperAbi = parseAbi([
  'function snwap(address tokenIn, uint256 amountIn, address recipient, address tokenOut, uint256 amountOutMin, address executor, bytes executorData) payable returns (uint256 amountOut)',
])

export const directPoolQuoterAbi = parseAbi([
  'function quoteExactInputSingle((address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96) params) view returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)',
])

export function getDirectPoolQuoteContractParameters({
  amount,
  chainId,
  feeTier,
  tokenIn,
  tokenOut,
}: {
  amount: bigint
  chainId: SushiSwapV3ChainId
  feeTier: number
  tokenIn: EvmAddress
  tokenOut: EvmAddress
}) {
  return {
    address: SUSHISWAP_V3_QUOTER[chainId],
    abi: directPoolQuoterAbi,
    functionName: 'quoteExactInputSingle',
    args: [
      {
        tokenIn,
        tokenOut,
        amountIn: amount,
        fee: feeTier,
        sqrtPriceLimitX96: 0n,
      },
    ],
  } as const
}

export function isDirectPoolPair({
  chainId,
  fromToken,
  toToken,
  directPool,
}: Pick<
  UseDirectPoolTradeParams,
  'chainId' | 'fromToken' | 'toToken' | 'directPool'
>): boolean {
  if (!chainId || !fromToken || !toToken || !directPool) return false

  const from = fromToken.wrap().address.toLowerCase()
  const to = toToken.wrap().address.toLowerCase()
  const quote = directPool.quoteTokenAddress.toLowerCase()
  const launch = directPool.launchTokenAddress.toLowerCase()

  return (from === quote && to === launch) || (from === launch && to === quote)
}

function getFeeBips(fee: number): bigint {
  return BigInt(Math.round(fee * 10_000))
}

export function applyOutputFee(amount: bigint, fee: number): bigint {
  return (amount * (10_000n - getFeeBips(fee))) / 10_000n
}

export function getDirectPoolGasCost({
  chainId,
  estimatedGas,
  gasPrice,
  nativePrice,
}: {
  chainId: EvmChainId
  estimatedGas: bigint
  gasPrice: bigint | null | undefined
  nativePrice: Fraction | undefined
}): Pick<UseEvmTradeReturn, 'gasSpent' | 'gasSpentUsd'> {
  if (!gasPrice) {
    return { gasSpent: undefined, gasSpentUsd: undefined }
  }

  const gasSpent = new Amount(
    EvmNative.fromChainId(chainId),
    gasPrice * addGasMargin(estimatedGas, EVM_TRADE_GAS_MARGIN_PERCENT),
  )

  return {
    gasSpent: gasSpent.toSignificant(4),
    gasSpentUsd: nativePrice
      ? gasSpent.mul(nativePrice.asFraction).toSignificant(4)
      : undefined,
  }
}

export function getBetterTrade(
  aggregator: UseEvmTradeReturn | undefined,
  direct: UseEvmTradeReturn | undefined,
): UseEvmTradeReturn | undefined {
  const aggregatorValid =
    aggregator?.status === 'Success' && aggregator.amountOut?.gt(ZERO)
  const directValid = direct?.status === 'Success' && direct.amountOut?.gt(ZERO)

  if (!aggregatorValid) return directValid ? direct : (aggregator ?? direct)
  if (!directValid) return aggregator

  return direct.amountOut?.gt(aggregator.amountOut as Amount<EvmCurrency>)
    ? direct
    : aggregator
}

export function getDirectPoolAmounts({
  effectiveFee,
  grossAmountOut,
  slippagePercentage,
  toToken,
}: Pick<
  CreateDirectPoolTradeParams,
  'effectiveFee' | 'grossAmountOut' | 'slippagePercentage' | 'toToken'
>): {
  amountOut: Amount<EvmCurrency>
  minAmountOut: Amount<EvmCurrency>
} {
  return {
    amountOut: new Amount(toToken, grossAmountOut),
    minAmountOut: subtractSlippage(
      new Amount(toToken, applyOutputFee(grossAmountOut, effectiveFee)),
      Number(slippagePercentage) / 100,
    ),
  }
}

export function createDirectPoolTrade({
  amount,
  chainId,
  effectiveFee,
  estimatedGas,
  fromToken,
  gasPrice,
  grossAmountOut,
  nativePrice,
  slippagePercentage,
  toToken,
  tx,
}: CreateDirectPoolTradeParams): UseEvmTradeReturn {
  const { amountOut, minAmountOut } = getDirectPoolAmounts({
    effectiveFee,
    grossAmountOut,
    slippagePercentage,
    toToken,
  })
  const gasCost = getDirectPoolGasCost({
    chainId,
    estimatedGas,
    gasPrice,
    nativePrice,
  })

  return {
    swapPrice: amountOut.gt(ZERO)
      ? new Price({ baseAmount: amount, quoteAmount: amountOut })
      : undefined,
    priceImpact: undefined,
    amountIn: amount,
    amountOut,
    minAmountOut,
    gasSpent: gasCost.gasSpent,
    gasSpentUsd: gasCost.gasSpentUsd,
    route: undefined,
    status: 'Success',
    tx,
    tokenTax: undefined,
    fee: getFeeString({
      fromToken,
      toToken,
      tokenOutPrice: undefined,
      minAmountOut,
      fee: effectiveFee,
    }),
    routingSource: 'Direct pool',
  }
}

export function encodeDirectPoolSwap({
  amountIn,
  amountOut,
  amountOutMin,
  chainId,
  fee,
  fromToken,
  poolAddress,
  recipient,
  toToken,
}: {
  amountIn: bigint
  amountOut: bigint
  amountOutMin: bigint
  chainId: typeof EvmChainId.ROBINHOOD
  fee: number
  fromToken: EvmCurrency
  poolAddress: EvmAddress
  recipient: EvmAddress
  toToken: EvmCurrency
}): { data: Hex; value: bigint } {
  const routeProcessor = ROUTE_PROCESSOR_ADDRESS[chainId]
  const tokenIn = fromToken.wrap().address
  const tokenOut = toToken.wrap().address
  const feeAmount = (amountOut * getFeeBips(fee)) / 10_000n
  const zeroForOne = tokenIn.toLowerCase() < tokenOut.toLowerCase() ? 1 : 0

  const routeTypes: ('uint8' | 'uint16' | 'uint40' | 'uint48' | 'address')[] = [
    'uint8',
    'uint40',
    'uint16',
  ]
  const routeValues: (number | EvmAddress)[] = [1, 0, 2]

  if (fromToken.isNative) {
    routeTypes.push(
      'uint8',
      'uint8',
      'uint16',
      'uint8',
      'uint8',
      'address',
      'address',
    )
    routeValues.push(3, 1, 65_535, 2, 1, routeProcessor, tokenIn)
  }

  routeTypes.push(
    'uint8',
    'address',
    'uint8',
    'uint16',
    'uint8',
    'address',
    'uint8',
    'address',
    'uint8',
    'uint48',
  )
  routeValues.push(
    1,
    tokenIn,
    1,
    65_535,
    1,
    poolAddress,
    zeroForOne,
    routeProcessor,
    0,
    0,
  )

  if (toToken.isNative) {
    routeTypes.push(
      'uint8',
      'address',
      'uint8',
      'uint16',
      'uint8',
      'uint8',
      'address',
    )
    routeValues.push(1, tokenOut, 1, 65_535, 2, 0, routeProcessor)
  }

  const executorData = encodeFunctionData({
    abi: routeProcessorAbi,
    functionName: 'processRouteWithTransferValueOutput',
    args: [
      UI_FEE_COLLECTOR_ADDRESS[chainId],
      feeAmount,
      fromToken.isNative ? evmNativeAddress : tokenIn,
      amountIn,
      toToken.isNative ? evmNativeAddress : tokenOut,
      amountOut,
      recipient,
      encodePacked(routeTypes, routeValues),
      true,
      1,
    ],
  })

  return {
    data: encodeFunctionData({
      abi: redSnwapperAbi,
      functionName: 'snwap',
      args: [
        fromToken.isNative ? evmNativeAddress : tokenIn,
        amountIn,
        recipient,
        toToken.isNative ? evmNativeAddress : tokenOut,
        amountOutMin,
        routeProcessor,
        executorData,
      ],
    }),
    value: fromToken.isNative ? amountIn : 0n,
  }
}
