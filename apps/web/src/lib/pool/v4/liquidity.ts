import type { EvmAddress } from 'sushi/evm'
import {
  type Hex,
  encodeAbiParameters,
  encodeFunctionData,
  isAddressEqual,
  toHex,
  zeroAddress,
} from 'viem'
import {
  INFINITY_CL_POSITION_MANAGER_ABI,
  INFINITY_POOL_KEY_COMPONENTS,
} from './contract-abi'
import { encodeSushiSwapV4PoolKey } from './pool-key'
import type { SushiSwapV4PoolKey } from './types'

const ACTION = {
  CL_INCREASE_LIQUIDITY: 0x00,
  CL_DECREASE_LIQUIDITY: 0x01,
  CL_MINT_POSITION: 0x02,
  SETTLE_PAIR: 0x0d,
  TAKE: 0x0e,
  CLOSE_CURRENCY: 0x12,
  SWEEP: 0x14,
  WRAP: 0x15,
} as const

const OPEN_DELTA = 0n
const CONTRACT_BALANCE = 1n << 255n
const ADDRESS_THIS =
  '0x0000000000000000000000000000000000000002' as const satisfies EvmAddress

const POSITION_CONFIG_ABI_PARAMETER = {
  name: 'positionConfig',
  type: 'tuple',
  components: [
    {
      name: 'poolKey',
      type: 'tuple',
      components: INFINITY_POOL_KEY_COMPONENTS,
    },
    { name: 'tickLower', type: 'int24' },
    { name: 'tickUpper', type: 'int24' },
  ],
} as const

interface InfinityAction {
  action: number
  parameters: Hex
}

function encodeActions(actions: InfinityAction[]): Hex {
  return encodeAbiParameters(
    [
      { name: 'actions', type: 'bytes' },
      { name: 'params', type: 'bytes[]' },
    ],
    [
      toHex(Uint8Array.from(actions.map(({ action }) => action))),
      actions.map(({ parameters }) => parameters),
    ],
  )
}

function encodeModifyLiquidities(
  actions: InfinityAction[],
  deadline: bigint,
): Hex {
  return encodeFunctionData({
    abi: INFINITY_CL_POSITION_MANAGER_ABI,
    functionName: 'modifyLiquidities',
    args: [encodeActions(actions), deadline],
  })
}

function encodeSettlePairActions(
  poolKey: SushiSwapV4PoolKey,
  recipient: EvmAddress,
): InfinityAction[] {
  const actions: InfinityAction[] = [
    {
      action: ACTION.SETTLE_PAIR,
      parameters: encodeAbiParameters(
        [
          { name: 'currency0', type: 'address' },
          { name: 'currency1', type: 'address' },
        ],
        [poolKey.currency0, poolKey.currency1],
      ),
    },
  ]

  if (isAddressEqual(poolKey.currency0, zeroAddress)) {
    actions.push({
      action: ACTION.SWEEP,
      parameters: encodeAbiParameters(
        [
          { name: 'currency', type: 'address' },
          { name: 'to', type: 'address' },
        ],
        [poolKey.currency0, recipient],
      ),
    })
  }

  return actions
}

function encodeMintPositionAction({
  poolKey,
  tickLower,
  tickUpper,
  liquidity,
  amount0Max,
  amount1Max,
  recipient,
  hookData,
}: {
  poolKey: SushiSwapV4PoolKey
  tickLower: number
  tickUpper: number
  liquidity: bigint
  amount0Max: bigint
  amount1Max: bigint
  recipient: EvmAddress
  hookData: Hex
}): InfinityAction {
  return {
    action: ACTION.CL_MINT_POSITION,
    parameters: encodeAbiParameters(
      [
        POSITION_CONFIG_ABI_PARAMETER,
        { name: 'liquidity', type: 'uint256' },
        { name: 'amount0Max', type: 'uint128' },
        { name: 'amount1Max', type: 'uint128' },
        { name: 'owner', type: 'address' },
        { name: 'hookData', type: 'bytes' },
      ],
      [
        {
          poolKey: encodeSushiSwapV4PoolKey(poolKey),
          tickLower,
          tickUpper,
        },
        liquidity,
        amount0Max,
        amount1Max,
        recipient,
        hookData,
      ],
    ),
  }
}

function encodeIncreaseLiquidityAction({
  tokenId,
  liquidity,
  amount0Max,
  amount1Max,
  hookData,
}: {
  tokenId: bigint
  liquidity: bigint
  amount0Max: bigint
  amount1Max: bigint
  hookData: Hex
}): InfinityAction {
  return {
    action: ACTION.CL_INCREASE_LIQUIDITY,
    parameters: encodeAbiParameters(
      [
        { name: 'tokenId', type: 'uint256' },
        { name: 'liquidity', type: 'uint256' },
        { name: 'amount0Max', type: 'uint128' },
        { name: 'amount1Max', type: 'uint128' },
        { name: 'hookData', type: 'bytes' },
      ],
      [tokenId, liquidity, amount0Max, amount1Max, hookData],
    ),
  }
}

export function addCLLiquidityMulticall({
  isInitialized,
  sqrtPriceX96,
  tokenId,
  positionConfig,
  liquidity,
  recipient,
  amount0Max,
  amount1Max,
  deadline,
  modifyPositionHookData,
}: {
  isInitialized: boolean
  sqrtPriceX96: bigint
  tokenId?: bigint
  positionConfig: {
    poolKey: SushiSwapV4PoolKey
    tickLower: number
    tickUpper: number
  }
  liquidity: bigint
  recipient: EvmAddress
  amount0Max: bigint
  amount1Max: bigint
  deadline: bigint
  modifyPositionHookData: Hex
}): Hex {
  const calls: Hex[] = []

  if (!isInitialized) {
    calls.push(
      encodeFunctionData({
        abi: INFINITY_CL_POSITION_MANAGER_ABI,
        functionName: 'initializePool',
        args: [encodeSushiSwapV4PoolKey(positionConfig.poolKey), sqrtPriceX96],
      }),
    )
  }

  const liquidityAction =
    tokenId === undefined
      ? encodeMintPositionAction({
          ...positionConfig,
          liquidity,
          amount0Max,
          amount1Max,
          recipient,
          hookData: modifyPositionHookData,
        })
      : encodeIncreaseLiquidityAction({
          tokenId,
          liquidity,
          amount0Max,
          amount1Max,
          hookData: modifyPositionHookData,
        })

  calls.push(
    encodeModifyLiquidities(
      [
        liquidityAction,
        ...encodeSettlePairActions(positionConfig.poolKey, recipient),
      ],
      deadline,
    ),
  )

  return calls.length === 1
    ? calls[0]
    : encodeFunctionData({
        abi: INFINITY_CL_POSITION_MANAGER_ABI,
        functionName: 'multicall',
        args: [calls],
      })
}

export function encodeCLPositionManagerDecreaseLiquidityCalldata({
  tokenId,
  poolKey,
  liquidity,
  amount0Min,
  amount1Min,
  wrapAddress,
  recipient,
  hookData = '0x',
  deadline,
}: {
  tokenId: bigint
  poolKey: SushiSwapV4PoolKey
  liquidity: bigint
  amount0Min: bigint
  amount1Min: bigint
  wrapAddress?: EvmAddress
  recipient?: EvmAddress
  hookData?: Hex
  deadline: bigint
}): Hex {
  const actions: InfinityAction[] = [
    {
      action: ACTION.CL_DECREASE_LIQUIDITY,
      parameters: encodeAbiParameters(
        [
          { name: 'tokenId', type: 'uint256' },
          { name: 'liquidity', type: 'uint256' },
          { name: 'amount0Min', type: 'uint128' },
          { name: 'amount1Min', type: 'uint128' },
          { name: 'hookData', type: 'bytes' },
        ],
        [tokenId, liquidity, amount0Min, amount1Min, hookData],
      ),
    },
  ]

  if (wrapAddress && !isAddressEqual(wrapAddress, zeroAddress)) {
    if (!recipient || isAddressEqual(recipient, zeroAddress)) {
      throw new Error('A recipient is required when wrapping native currency')
    }

    actions.push(
      {
        action: ACTION.TAKE,
        parameters: encodeAbiParameters(
          [
            { name: 'currency', type: 'address' },
            { name: 'recipient', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          [zeroAddress, ADDRESS_THIS, OPEN_DELTA],
        ),
      },
      {
        action: ACTION.CLOSE_CURRENCY,
        parameters: encodeAbiParameters(
          [{ name: 'currency', type: 'address' }],
          [poolKey.currency1],
        ),
      },
      {
        action: ACTION.WRAP,
        parameters: encodeAbiParameters(
          [{ name: 'amount', type: 'uint256' }],
          [CONTRACT_BALANCE],
        ),
      },
      {
        action: ACTION.SWEEP,
        parameters: encodeAbiParameters(
          [
            { name: 'currency', type: 'address' },
            { name: 'to', type: 'address' },
          ],
          [wrapAddress, recipient],
        ),
      },
    )
  } else {
    actions.push(
      {
        action: ACTION.CLOSE_CURRENCY,
        parameters: encodeAbiParameters(
          [{ name: 'currency', type: 'address' }],
          [poolKey.currency0],
        ),
      },
      {
        action: ACTION.CLOSE_CURRENCY,
        parameters: encodeAbiParameters(
          [{ name: 'currency', type: 'address' }],
          [poolKey.currency1],
        ),
      },
    )
  }

  return encodeModifyLiquidities(actions, deadline)
}
