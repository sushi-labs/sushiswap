import { EvmChainId } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { replaceNetworkSlug } from './network'

describe('switching launchpad networks', () => {
  it.each([
    ['/launch', '/arc/launchpad'],
    ['/robinhood/launchpad', '/arc/launchpad'],
    ['/robinhood/launchpad/create', '/arc/launchpad/create'],
    ['/robinhood/launchpad/portfolio', '/arc/launchpad/portfolio'],
    ['/robinhood/launchpad/manage', '/arc/launchpad/manage'],
    ['/robinhood/launchpad/manage/0x123', '/arc/launchpad/manage'],
    ['/robinhood/launchpad/token/0x123', '/arc/launchpad'],
    ['/robinhood/launchpad/creator/0x123', '/arc/launchpad'],
  ])('routes %s to %s', (pathname, expected) => {
    expect(replaceNetworkSlug(EvmChainId.ARC, pathname)).toBe(expected)
  })

  it('switches back to Robinhood', () => {
    expect(
      replaceNetworkSlug(EvmChainId.ROBINHOOD, '/arc/launchpad/create'),
    ).toBe('/robinhood/launchpad/create')
  })

  it('preserves swap routing', () => {
    expect(replaceNetworkSlug(EvmChainId.ARC, '/robinhood/swap')).toBe(
      '/arc/swap',
    )
  })
})
