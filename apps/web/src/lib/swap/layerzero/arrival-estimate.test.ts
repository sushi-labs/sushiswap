import { describe, expect, it } from 'vitest'
import {
  getLayerZeroArrivalEstimate,
  getLayerZeroArrivalEstimateUrl,
} from './arrival-estimate'

const NOW = 1_800_000_000
const ETH_OFT = '0x6c96de32cea08842dcc4058c14d3aaad7fa41dee'
const STELLAR_OFT =
  '0x5d672cb21b3afcdda54546c7f5b9fd346920e41f8fe8f39e838e5d7bd7435546'

function message(seconds: number, reverse = false) {
  return {
    pathway: {
      srcEid: reverse ? 30600 : 30101,
      dstEid: reverse ? 30101 : 30600,
      sender: { address: reverse ? STELLAR_OFT : ETH_OFT },
      receiver: { address: reverse ? ETH_OFT : STELLAR_OFT },
    },
    status: { name: 'DELIVERED' },
    source: { tx: { blockTimestamp: NOW - 86_400 } },
    destination: { tx: { blockTimestamp: NOW - 86_400 + seconds } },
  }
}

describe('LayerZero arrival estimates', () => {
  it('uses the median of completed transfers rather than an incident-dominated average', () => {
    expect(
      getLayerZeroArrivalEstimate(
        { data: [message(900), message(1_020), message(31_000)] },
        1,
        -4,
        NOW,
      ),
    ).toEqual({ estimatedSeconds: 1_020 })
  })

  it('uses the correct directional pathway and Stellar contract encoding', () => {
    const data = [
      message(900),
      message(1_020),
      message(1_080),
      message(1_820, true),
      message(1_860, true),
      message(1_900, true),
    ]
    expect(getLayerZeroArrivalEstimate({ data }, -4, 1, NOW)).toEqual({
      estimatedSeconds: 1_860,
    })
  })

  it('requires at least three recent completed transfers', () => {
    expect(getLayerZeroArrivalEstimate({ data: [] }, 1, -4, NOW)).toEqual({
      estimatedSeconds: null,
    })
    expect(
      getLayerZeroArrivalEstimate(
        { data: [message(900), message(1_020)] },
        1,
        -4,
        NOW,
      ),
    ).toEqual({ estimatedSeconds: null })
  })

  it('ignores unrelated contracts, pending transfers, and incomplete timestamps', () => {
    const valid = message(900)
    const data = [
      valid,
      {
        ...valid,
        pathway: { ...valid.pathway, sender: { address: '0xother' } },
      },
      {
        ...valid,
        pathway: { ...valid.pathway, receiver: { address: '0xother' } },
      },
      { ...valid, status: { name: 'INFLIGHT' } },
      { ...valid, destination: {} },
      null,
    ]
    expect(getLayerZeroArrivalEstimate({ data }, 1, -4, NOW)).toEqual({
      estimatedSeconds: null,
    })
  })

  it('excludes stale, reversed, zero, future, and millisecond timestamps', () => {
    const valid = message(900)
    const data = [
      valid,
      { ...valid, source: { tx: { blockTimestamp: NOW - 8 * 86_400 } } },
      message(-1),
      message(0),
      message(86_401),
      { ...valid, destination: { tx: { blockTimestamp: NOW * 1000 } } },
    ]
    expect(getLayerZeroArrivalEstimate({ data }, 1, -4, NOW)).toEqual({
      estimatedSeconds: null,
    })
  })

  it('handles even sample counts and rounds fractional seconds upwards', () => {
    expect(
      getLayerZeroArrivalEstimate(
        { data: [message(1), message(2), message(3), message(4)] },
        1,
        -4,
        NOW,
      ),
    ).toEqual({ estimatedSeconds: 3 })
  })

  it('does not manufacture a duration from an invalid API response', () => {
    expect(() =>
      getLayerZeroArrivalEstimate({ error: 'unavailable' }, 1, -4, NOW),
    ).toThrow()
  })

  it('requests only the selected route and canonical source OFT', () => {
    const url = new URL(getLayerZeroArrivalEstimateUrl(-4, 1))
    expect(url.origin).toBe('https://scan.layerzero-api.com')
    expect(url.searchParams.get('srcChainIds')).toBe('30600')
    expect(url.searchParams.get('dstChainIds')).toBe('30101')
    expect(url.searchParams.get('srcOrDstChainIdUaAddress')).toBe(
      `30600-${STELLAR_OFT}`,
    )
    expect(url.searchParams.get('limit')).toBe('20')
  })
})
