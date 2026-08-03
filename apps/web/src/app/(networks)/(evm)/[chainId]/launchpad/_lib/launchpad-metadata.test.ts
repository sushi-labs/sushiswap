import { hashTypedData } from 'viem'
import { describe, expect, it } from 'vitest'
import type { LaunchpadChainId } from '../constants'
import {
  LAUNCHPAD_METADATA_DESCRIPTION_MAX_BYTES,
  buildLaunchpadMetadataDocument,
  buildUpdateMetadataTypedData,
  launchpadMetadataDescriptionSchema,
} from './launchpad-metadata'

describe('launchpad metadata signature', () => {
  it('matches the data API UTF-8 description limit', () => {
    expect(LAUNCHPAD_METADATA_DESCRIPTION_MAX_BYTES).toBe(4_000)
    expect(
      launchpadMetadataDescriptionSchema.safeParse('a'.repeat(4_000)).success,
    ).toBe(true)
    expect(
      launchpadMetadataDescriptionSchema.safeParse('é'.repeat(2_001)).success,
    ).toBe(false)
  })

  it('builds the editable metadata document used by create and manage', () => {
    expect(
      buildLaunchpadMetadataDocument({
        description: '  Sushi launch  ',
        homepage: 'https://sushi.com',
        x: 'https://x.com/sushiswap',
        telegram: 'https://t.me/sushi',
      }),
    ).toEqual({
      description: 'Sushi launch',
      links: [
        { kind: 'homepage', url: 'https://sushi.com/' },
        { kind: 'x', url: 'https://x.com/sushiswap' },
        { kind: 'telegram', url: 'https://t.me/sushi' },
      ],
    })
  })

  it('matches the data API golden vector', () => {
    expect(
      hashTypedData(
        buildUpdateMetadataTypedData({
          chainId: 4663 as LaunchpadChainId,
          factoryAddress: '0x1111111111111111111111111111111111111111',
          tokenAddress: '0x3333333333333333333333333333333333333333',
          expectedRevision: 2,
          metadata: {
            description: 'Sushi',
            links: [
              {
                kind: 'homepage',
                url: 'https://sushi.com/',
                label: 'Sushi',
              },
            ],
          },
          logoHash:
            '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          deadline: 1_800_000_000n,
        }),
      ),
    ).toBe('0xfd81f1275045fa6ac852a1715497231403a4032c663aa6d3d3b7c85987f3f0e8')
  })
})
