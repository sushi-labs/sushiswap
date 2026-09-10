import { EvmChainId, EvmToken } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import {
  type RobinhoodStockToken,
  isRobinhoodStockToken,
  robinhoodStockTokensSchema,
} from './stock-tokens'

const address = '0xd95B44124e475743a7589e68F3D74008A5536D44'
const stockTokens: RobinhoodStockToken[] = [
  {
    tokenSymbol: 'CRM',
    tokenName: 'Salesforce • Robinhood Token',
    deployments: [{ chainId: EvmChainId.ROBINHOOD, contractAddress: address }],
  },
]

describe('isRobinhoodStockToken', () => {
  it('matches an EvmToken by chain and address regardless of casing or name', () => {
    const token = new EvmToken({
      chainId: EvmChainId.ROBINHOOD,
      address: '0xd95b44124e475743a7589e68f3d74008a5536d44',
      decimals: 18,
      symbol: 'different-symbol',
      name: 'Different name',
    })
    expect(isRobinhoodStockToken(token, stockTokens)).toBe(true)
  })

  it('rejects the same address on another chain', () => {
    expect(
      isRobinhoodStockToken(
        { chainId: EvmChainId.ETHEREUM, address },
        stockTokens,
      ),
    ).toBe(false)
  })

  it('rejects an imitation with the same symbol and name', () => {
    const token = new EvmToken({
      chainId: EvmChainId.ROBINHOOD,
      address: '0x0000000000000000000000000000000000000001',
      decimals: 18,
      symbol: 'CRM',
      name: 'Salesforce • Robinhood Token',
    })
    expect(isRobinhoodStockToken(token, stockTokens)).toBe(false)
  })

  it('checks all deployments of an asset', () => {
    expect(
      isRobinhoodStockToken({ chainId: EvmChainId.ROBINHOOD, address }, [
        {
          ...stockTokens[0],
          deployments: [
            { chainId: EvmChainId.ETHEREUM, contractAddress: address },
            ...stockTokens[0].deployments,
          ],
        },
      ]),
    ).toBe(true)
  })

  it('does not verify tokens while the registry is unavailable or empty', () => {
    const token = { chainId: EvmChainId.ROBINHOOD, address } as const
    expect(isRobinhoodStockToken(token, undefined)).toBe(false)
    expect(isRobinhoodStockToken(token, [])).toBe(false)
  })
})

describe('robinhoodStockTokensSchema', () => {
  it('parses the registry and normalizes deployment addresses', () => {
    const parsed = robinhoodStockTokensSchema.parse({ assets: stockTokens })
    expect(parsed.assets[0].deployments[0].contractAddress).toBe(
      address.toLowerCase(),
    )
  })

  it.each([
    {},
    { assets: null },
    {
      assets: [
        {
          ...stockTokens[0],
          deployments: [{ chainId: 4663, contractAddress: 'invalid' }],
        },
      ],
    },
    {
      assets: [
        {
          ...stockTokens[0],
          deployments: [{ chainId: '4663', contractAddress: address }],
        },
      ],
    },
  ])('rejects malformed registry data: %j', (data) => {
    expect(robinhoodStockTokensSchema.safeParse(data).success).toBe(false)
  })
})
