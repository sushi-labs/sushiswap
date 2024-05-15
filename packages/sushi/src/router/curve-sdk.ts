import { Address, PublicClient, parseAbi } from 'viem'

export enum CurvePoolType {
  TypeA = 'TypeA',
  TypeB = 'TypeB',
}

export const curvePoolABI = {
  [CurvePoolType.TypeA]: parseAbi([
    'function A() pure returns (uint256)',
    'function fee() pure returns (uint256)',
    'function coins(uint256) pure returns (address)',
    'function balances(uint256) pure returns (uint256)',
  ] as const),
  [CurvePoolType.TypeB]: parseAbi([
    'function A() pure returns (uint256)',
    'function fee() pure returns (uint256)',
    'function coins(int128) pure returns (address)',
    'function balances(int128) pure returns (uint256)',
  ] as const),
}

const axFunctionsABI = parseAbi([
  'function get_virtual_price() pure returns (uint256)',
  'function ratio() pure returns (uint256)',
  'function getExchangeRate() pure returns (uint256)',
])

export const METAPOOL_COIN_TO_BASEPOOL: Record<string, Address> = {
  '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490':
    '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7', // 3-pool
  '0x075b1bb99792c9e1041ba13afef80c91a1e70fb3':
    '0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714', // sBTC
  '0x3175df0976dfa876431c2e9ee6bc45b65d3473cc':
    '0xDcEF968d416a41Cdac0ED8702fAC8128A64241A2', // fraxUSD
  '0x051d7e5609917bd9b73f04bac0ded8dd46a74301':
    '0xf253f83AcA21aAbD2A20553AE0BF7F65C755A07F',
}

export async function detectCurvePoolType(
  client: PublicClient,
  poolAddress: Address,
): Promise<CurvePoolType> {
  try {
    await client.readContract({
      address: poolAddress,
      abi: curvePoolABI[CurvePoolType.TypeA],
      functionName: 'balances',
      args: [0n],
    })
    return CurvePoolType.TypeA
  } catch (_e) {
    return CurvePoolType.TypeB
  }
}

export async function getPoolRatio(
  client: PublicClient,
  poolAddress: Address,
  poolType: CurvePoolType,
): Promise<number> {
  const token1Address = await client.readContract({
    address: poolAddress,
    abi: curvePoolABI[poolType],
    functionName: 'coins',
    args: [1n],
  })

  const basePoolAddress = METAPOOL_COIN_TO_BASEPOOL[token1Address.toLowerCase()]
  if (basePoolAddress !== undefined) {
    const price = await client.readContract({
      address: basePoolAddress,
      abi: axFunctionsABI,
      functionName: 'get_virtual_price',
    })
    // 1e18 is not always appropriate, but there is no way to find self.rate_multiplier value
    return Number(price) / 1e18
  }

  // collection of freaks
  switch (poolAddress.toLowerCase()) {
    case '0xa96a65c051bf88b4095ee1f2451c2a9d43f53ae2': {
      //ankrETH pool
      const ratio = await client.readContract({
        address: '0xE95A203B1a91a908F9B9CE46459d101078c2c3cb' as const,
        abi: axFunctionsABI,
        functionName: 'ratio',
      })
      return 1e18 / Number(ratio)
    }
    case '0xf9440930043eb3997fc70e1339dbb11f341de7a8': {
      // rETH pool
      const ratio = await client.readContract({
        address: '0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593' as const,
        abi: axFunctionsABI,
        functionName: 'getExchangeRate',
      })
      return Number(ratio) / 1e18
    }
    case '0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56': {
      // compound pool cUSDC-cDAI
      // cUSDC
      const ratio0 = await client.readContract({
        address: '0x39aa39c021dfbae8fac545936693ac917d5e7563' as const,
        abi: parseAbi([
          'function exchangeRateCurrent() pure returns (uint256)',
        ]),
        functionName: 'exchangeRateCurrent',
      })
      // cDAI
      const ratio1 = await client.readContract({
        address: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643' as const,
        abi: parseAbi([
          'function exchangeRateCurrent() pure returns (uint256)',
        ]),
        functionName: 'exchangeRateCurrent',
      })
      return (Number(ratio0) * 1e12) / Number(ratio1)
    }
    default:
      return 1
  }
}
