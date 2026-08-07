import { ChainId } from 'sushi'
import { describe, expect, it } from 'vitest'
import { isExpectedStream, parseStreamEvent, streamTradeSchema } from './events'

const tokenAddress = '0x0000000000000000000000000000000000000001'

describe('launchpad live trade events', () => {
  it('rejects malformed JSON and invalid trade payloads', () => {
    expect(
      parseStreamEvent(
        { data: '{' } as MessageEvent<string>,
        streamTradeSchema,
      ),
    ).toBeNull()
    expect(
      parseStreamEvent(
        {
          data: JSON.stringify({ chainId: ChainId.ETHEREUM }),
        } as MessageEvent<string>,
        streamTradeSchema,
      ),
    ).toBeNull()
  })

  it('matches events only to their chain and token stream', () => {
    expect(
      isExpectedStream(ChainId.ROBINHOOD, tokenAddress, {
        chainId: ChainId.ROBINHOOD,
        tokenAddress,
      }),
    ).toBe(true)
    expect(
      isExpectedStream(ChainId.ROBINHOOD, tokenAddress, {
        chainId: ChainId.ARBITRUM,
        tokenAddress,
      }),
    ).toBe(false)
  })
})
