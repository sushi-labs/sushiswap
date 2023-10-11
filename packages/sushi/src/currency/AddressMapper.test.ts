import { describe, expect, test } from 'vitest'

import { ChainId } from '../chain/index.js'
import { AddressMapper } from './AddressMapper.js'
import {
  SUSHI_ADDRESS,
  USDC_ADDRESS,
  WNATIVE_ADDRESS,
} from './constants/index.js'
import { TOKEN_MAP } from './constants/token-map.js'

const USDC_ETHEREUM_BRIDGE_LIST = {
  1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  4: '0x1717a0d5c8705ee89a8ad6e808268d6a826c97a4',
  3: '0x0d9c8723b343a8368bebe0b5e89273ff8d712e3c',
}

const USDC_BSC_BRIDGE_LIST = {
  1: '0x0000000000000000000000000000000000000101',
}

describe('AddressMapper', () => {
  const usdc_merged = AddressMapper.merge(
    USDC_ETHEREUM_BRIDGE_LIST,
    USDC_BSC_BRIDGE_LIST,
  )

  test('merge', async () => {
    const expected = {
      1: [
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        '0x0000000000000000000000000000000000000101',
      ],
      4: ['0x1717a0d5c8705ee89a8ad6e808268d6a826c97a4'],
      3: ['0x0d9c8723b343a8368bebe0b5e89273ff8d712e3c'],
    }
    expect(usdc_merged).toEqual(expected)
  })

  test('when kovan address is given, return all eth and ropsten addresses', async () => {
    const usdc_merged = AddressMapper.merge(
      USDC_ETHEREUM_BRIDGE_LIST,
      USDC_BSC_BRIDGE_LIST,
    )

    const actual = AddressMapper.generate([usdc_merged])
    const expected = {
      '1:0x0000000000000000000000000000000000000101': [
        {
          chainId: 1,
          tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        },
        {
          chainId: 3,
          tokenAddress: '0x0d9c8723b343a8368bebe0b5e89273ff8d712e3c',
        },
        {
          chainId: 4,
          tokenAddress: '0x1717a0d5c8705ee89a8ad6e808268d6a826c97a4',
        },
      ],
      '1:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': [
        {
          chainId: 1,
          tokenAddress: '0x0000000000000000000000000000000000000101',
        },
        {
          chainId: 3,
          tokenAddress: '0x0d9c8723b343a8368bebe0b5e89273ff8d712e3c',
        },
        {
          chainId: 4,
          tokenAddress: '0x1717a0d5c8705ee89a8ad6e808268d6a826c97a4',
        },
      ],
      '3:0x0d9c8723b343a8368bebe0b5e89273ff8d712e3c': [
        {
          chainId: 1,
          tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        },
        {
          chainId: 1,
          tokenAddress: '0x0000000000000000000000000000000000000101',
        },
        {
          chainId: 4,
          tokenAddress: '0x1717a0d5c8705ee89a8ad6e808268d6a826c97a4',
        },
      ],

      '4:0x1717a0d5c8705ee89a8ad6e808268d6a826c97a4': [
        {
          chainId: 1,
          tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        },
        {
          chainId: 1,
          tokenAddress: '0x0000000000000000000000000000000000000101',
        },
        {
          chainId: 3,
          tokenAddress: '0x0d9c8723b343a8368bebe0b5e89273ff8d712e3c',
        },
      ],
    }

    expect(actual).toEqual(expected)
    expect(actual['1:0x0000000000000000000000000000000000000101']).toEqual([
      {
        chainId: 1,
        tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
      {
        chainId: 3,
        tokenAddress: '0x0d9c8723b343a8368bebe0b5e89273ff8d712e3c',
      },
      {
        chainId: 4,
        tokenAddress: '0x1717a0d5c8705ee89a8ad6e808268d6a826c97a4',
      },
    ])
  })

  test.each([
    {
      chainId: 1,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      filter: 3,
      expected: [
        {
          chainId: 3,
          tokenAddress: '0x0d9c8723b343a8368bebe0b5e89273ff8d712e3c',
        },
      ],
    },
    {
      chainId: 3,
      address: '0x0d9c8723b343a8368bebe0b5e89273ff8d712e3c',
      filter: 1,
      expected: [
        {
          chainId: 1,
          tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        },
        {
          chainId: 1,
          tokenAddress: '0x0000000000000000000000000000000000000101',
        },
      ],
    },
    {
      chainId: 3,
      address: '0x0d9c8723b343a8368bebe0b5e89273ff8d712e3c',
      filter: 100,
      expected: [],
    },
  ])('filter by chain id', ({ chainId, address, filter, expected }) => {
    const usdc_merged = AddressMapper.merge(
      USDC_ETHEREUM_BRIDGE_LIST,
      USDC_BSC_BRIDGE_LIST,
    )

    const mappings = AddressMapper.generate([usdc_merged])
    const actual = mappings[`${chainId}:${address}`]?.filter(
      (t) => t.chainId === filter,
    )
    expect(actual).toEqual(expected)
  })

  describe('case sensitivity', () => {
    const testList = {
      1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      4: '0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4',
    }
    const mappings = AddressMapper.generate([testList])

    test('basic', async () => {
      expect(mappings['1:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48']).toEqual([
        {
          chainId: 4,
          tokenAddress: '0x1717a0d5c8705ee89a8ad6e808268d6a826c97a4',
        },
      ])
    })

    test("returns undefined when key isn't lower case", async () => {
      expect(
        mappings['1:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
      ).toBeUndefined()
    })
  })

  describe('Sushi addresses', () => {
    const addressLists = [WNATIVE_ADDRESS, SUSHI_ADDRESS]
    const MAPPING = AddressMapper.generate([...addressLists])

    test('Get all weth addresses', async () => {
      const expected = Object.keys(WNATIVE_ADDRESS).length - 1 // minus one, exclude itself
      const actual = Object.values(
        // @ts-ignore
        MAPPING[
          `${ChainId.ETHEREUM}:${WNATIVE_ADDRESS[
            ChainId.ETHEREUM
          ].toLowerCase()}`
        ],
      ).length
      expect(actual).toEqual(expected)
    })

    test('Get all sushi addresses for the top networks given thundercores sushi address', async () => {
      const actual =
        MAPPING[
          `${ChainId.THUNDERCORE}:${SUSHI_ADDRESS[
            ChainId.THUNDERCORE
          ].toLowerCase()}`
        ]

      const ethereumAddresses = actual?.filter(
        (t) => t.chainId === ChainId.ETHEREUM,
      )
      expect(ethereumAddresses).toHaveLength(1)
      expect(ethereumAddresses?.[0]?.tokenAddress).toEqual(
        SUSHI_ADDRESS[ChainId.ETHEREUM].toLowerCase(),
      )

      const arbitrumAddresses = actual?.filter(
        (t) => t.chainId === ChainId.ARBITRUM,
      )
      expect(arbitrumAddresses).toHaveLength(1)
      expect(arbitrumAddresses?.[0]?.tokenAddress).toEqual(
        SUSHI_ADDRESS[ChainId.ARBITRUM].toLowerCase(),
      )

      const polygonAddresses = actual?.filter(
        (t) => t.chainId === ChainId.POLYGON,
      )
      expect(polygonAddresses).toHaveLength(1)
      expect(polygonAddresses?.[0]?.tokenAddress).toEqual(
        SUSHI_ADDRESS[ChainId.POLYGON].toLowerCase(),
      )

      const optimismAddresses = actual?.filter(
        (t) => t.chainId === ChainId.OPTIMISM,
      )
      expect(optimismAddresses).toHaveLength(1)
      expect(optimismAddresses?.[0]?.tokenAddress).toEqual(
        SUSHI_ADDRESS[ChainId.OPTIMISM].toLowerCase(),
      )
    })
  })

  describe('Sushi addresses', () => {
    const addressLists = [WNATIVE_ADDRESS, SUSHI_ADDRESS]
    const MAPPING = AddressMapper.generate([...addressLists])

    test('Get all weth addresses', async () => {
      const expected = Object.keys(WNATIVE_ADDRESS).length - 1 // minus one, exclude itself
      const actual = Object.values(
        // @ts-ignore
        MAPPING[
          `${ChainId.ETHEREUM}:${WNATIVE_ADDRESS[
            ChainId.ETHEREUM
          ].toLowerCase()}`
        ],
      ).length
      expect(actual).toEqual(expected)
    })

    test('Get all sushi addresses for the top networks given thundercores sushi address', async () => {
      const actual =
        MAPPING[
          `${ChainId.THUNDERCORE}:${SUSHI_ADDRESS[
            ChainId.THUNDERCORE
          ].toLowerCase()}`
        ]

      const ethereumAddresses = actual?.filter(
        (t) => t.chainId === ChainId.ETHEREUM,
      )
      expect(ethereumAddresses).toHaveLength(1)
      expect(ethereumAddresses?.[0]?.tokenAddress).toEqual(
        SUSHI_ADDRESS[ChainId.ETHEREUM].toLowerCase(),
      )

      const arbitrumAddresses = actual?.filter(
        (t) => t.chainId === ChainId.ARBITRUM,
      )
      expect(arbitrumAddresses).toHaveLength(1)
      expect(arbitrumAddresses?.[0]?.tokenAddress).toEqual(
        SUSHI_ADDRESS[ChainId.ARBITRUM].toLowerCase(),
      )

      const polygonAddresses = actual?.filter(
        (t) => t.chainId === ChainId.POLYGON,
      )
      expect(polygonAddresses).toHaveLength(1)
      expect(polygonAddresses?.[0]?.tokenAddress).toEqual(
        SUSHI_ADDRESS[ChainId.POLYGON].toLowerCase(),
      )

      const optimismAddresses = actual?.filter(
        (t) => t.chainId === ChainId.OPTIMISM,
      )
      expect(optimismAddresses).toHaveLength(1)
      expect(optimismAddresses?.[0]?.tokenAddress).toEqual(
        SUSHI_ADDRESS[ChainId.OPTIMISM].toLowerCase(),
      )
    })
  })

  test('BTTC has 3 usdc addresses', async () => {
    const mappings =
      TOKEN_MAP[`${ChainId.BTTC}:${USDC_ADDRESS[ChainId.BTTC].toLowerCase()}`]
    const actual = mappings?.filter(
      (mapping) => mapping.chainId === ChainId.BTTC,
    ).length
    const expected = 2 // 3 in total, including itself
    expect(actual).toEqual(expected)
  })

  test('Wrapped BTT is not mapped to other wrapped natives', async () => {
    const actual =
      TOKEN_MAP[
        `${ChainId.BTTC}:${WNATIVE_ADDRESS[ChainId.BTTC].toLowerCase()}`
      ]
    expect(actual).toEqual(undefined)
  })
})
