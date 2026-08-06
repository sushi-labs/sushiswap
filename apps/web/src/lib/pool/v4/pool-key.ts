import type { EvmAddress, EvmCurrency, SushiSwapV3FeeAmount } from 'sushi/evm'
import { TICK_SPACINGS } from 'sushi/evm'
import {
  type Hex,
  encodeAbiParameters,
  getAddress,
  keccak256,
  toHex,
  zeroAddress,
} from 'viem'
import type {
  EncodedSushiSwapV4PoolKey,
  InfinityHooksRegistration,
  SushiSwapV4PoolId,
  SushiSwapV4PoolKey,
} from './types'

const HOOK_REGISTRATION_FIELDS = [
  'beforeInitialize',
  'afterInitialize',
  'beforeAddLiquidity',
  'afterAddLiquidity',
  'beforeRemoveLiquidity',
  'afterRemoveLiquidity',
  'beforeSwap',
  'afterSwap',
  'beforeDonate',
  'afterDonate',
  'beforeSwapReturnsDelta',
  'afterSwapReturnsDelta',
  'afterMintReturnsDelta',
  'afterBurnReturnsDelta',
] as const

const INT24_SIZE = 1n << 24n
const INT24_SIGN_BIT = 1n << 23n
const INT24_MASK = INT24_SIZE - 1n

export const SUSHISWAP_V4_HOOKS_ABI = [
  {
    type: 'function',
    name: 'getHooksRegistrationBitmap',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint16' }],
  },
] as const

export function isSushiSwapV4FeeAmount(
  fee: number,
): fee is SushiSwapV3FeeAmount {
  return fee in TICK_SPACINGS
}

export function getSushiSwapV4CurrencyAddress(
  currency: EvmCurrency,
): EvmAddress {
  return currency.type === 'native' ? zeroAddress : currency.address
}

export function createSushiSwapV4PoolKey({
  currencyA,
  currencyB,
  hooks = zeroAddress,
  hooksRegistration,
  poolManager,
  fee,
}: {
  currencyA: EvmCurrency
  currencyB: EvmCurrency
  hooks?: EvmAddress
  hooksRegistration?: InfinityHooksRegistration
  poolManager: EvmAddress
  fee: SushiSwapV3FeeAmount
}): SushiSwapV4PoolKey {
  const addresses = [
    getSushiSwapV4CurrencyAddress(currencyA),
    getSushiSwapV4CurrencyAddress(currencyB),
  ].sort((a, b) => (BigInt(a) < BigInt(b) ? -1 : 1)) as [EvmAddress, EvmAddress]

  return {
    currency0: getAddress(addresses[0]),
    currency1: getAddress(addresses[1]),
    hooks: getAddress(hooks),
    poolManager: getAddress(poolManager),
    fee,
    parameters: {
      tickSpacing: TICK_SPACINGS[fee],
      hooksRegistration,
    },
  }
}

export function decodeSushiSwapV4PoolKey(
  encoded: EncodedSushiSwapV4PoolKey,
): SushiSwapV4PoolKey {
  const parameters = BigInt(encoded.parameters)
  const encodedTickSpacing = (parameters >> 16n) & INT24_MASK
  const tickSpacing =
    encodedTickSpacing & INT24_SIGN_BIT
      ? Number(encodedTickSpacing - INT24_SIZE)
      : Number(encodedTickSpacing)

  return {
    currency0: getAddress(encoded.currency0),
    currency1: getAddress(encoded.currency1),
    hooks: getAddress(encoded.hooks),
    poolManager: getAddress(encoded.poolManager),
    fee: encoded.fee,
    parameters: {
      tickSpacing,
      hooksRegistration: getHooksRegistration(Number(parameters & 0xffffn)),
    },
  }
}

export function encodeSushiSwapV4PoolParameters(
  poolKeyParameters: SushiSwapV4PoolKey['parameters'],
): Hex {
  const { tickSpacing, hooksRegistration } = poolKeyParameters

  if (
    !Number.isInteger(tickSpacing) ||
    tickSpacing < -Number(INT24_SIGN_BIT) ||
    tickSpacing >= Number(INT24_SIGN_BIT)
  ) {
    throw new RangeError('Infinity CL tick spacing must fit in int24')
  }

  let hooksBitmap = 0n
  for (const [offset, field] of HOOK_REGISTRATION_FIELDS.entries()) {
    if (hooksRegistration?.[field]) {
      hooksBitmap |= 1n << BigInt(offset)
    }
  }

  const encodedTickSpacing = BigInt(tickSpacing) & INT24_MASK
  return toHex((encodedTickSpacing << 16n) | hooksBitmap, { size: 32 })
}

export function encodeSushiSwapV4PoolKey(
  poolKey: SushiSwapV4PoolKey,
): EncodedSushiSwapV4PoolKey {
  return {
    currency0: poolKey.currency0,
    currency1: poolKey.currency1,
    hooks: poolKey.hooks,
    poolManager: poolKey.poolManager,
    fee: poolKey.fee,
    parameters: encodeSushiSwapV4PoolParameters(poolKey.parameters),
  }
}

export function getSushiSwapV4PoolId(
  poolKey: SushiSwapV4PoolKey,
): SushiSwapV4PoolId {
  const encoded = encodeSushiSwapV4PoolKey(poolKey)

  return keccak256(
    encodeAbiParameters(
      [
        { name: 'currency0', type: 'address' },
        { name: 'currency1', type: 'address' },
        { name: 'hooks', type: 'address' },
        { name: 'poolManager', type: 'address' },
        { name: 'fee', type: 'uint24' },
        { name: 'parameters', type: 'bytes32' },
      ],
      [
        encoded.currency0,
        encoded.currency1,
        encoded.hooks,
        encoded.poolManager,
        encoded.fee,
        encoded.parameters,
      ],
    ),
  )
}

export function getHooksRegistration(
  bitmap: number,
): InfinityHooksRegistration {
  if (!Number.isInteger(bitmap) || bitmap < 0 || bitmap > 0x3fff) {
    throw new RangeError('Invalid Infinity hooks registration bitmap')
  }

  return Object.fromEntries(
    HOOK_REGISTRATION_FIELDS.flatMap((field, offset) =>
      bitmap & (1 << offset) ? [[field, true]] : [],
    ),
  )
}
