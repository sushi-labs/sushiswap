import { describe, expect, it } from 'vitest'
import { parseLayerZeroStatus } from './status'

function response(name: string, destination: unknown = null) {
  return {
    data: [
      {
        pathway: { srcEid: 30101, dstEid: 30600 },
        status: { name },
        destination,
      },
    ],
  }
}

describe('LayerZero delivery status', () => {
  it('only reports success after destination delivery', () => {
    expect(
      parseLayerZeroStatus(
        response('DELIVERED', { tx: { txHash: 'destination' } }),
        30101,
        30600,
      ),
    ).toEqual({
      status: 'SUCCESS',
      destinationTxHash: 'destination',
    })
  })

  it.each(['FAILED', 'PAYLOAD_STORED', 'BLOCKED'])(
    'requires recovery for %s instead of encouraging a resend',
    (status) => {
      expect(parseLayerZeroStatus(response(status), 30101, 30600).status).toBe(
        'ACTION_REQUIRED',
      )
    },
  )

  it('keeps unindexed, unknown, and unrelated messages pending', () => {
    expect(parseLayerZeroStatus({ data: [] }, 30101, 30600).status).toBe(
      'PENDING',
    )
    expect(
      parseLayerZeroStatus(response('INFLIGHT', { tx: null }), 30101, 30600)
        .status,
    ).toBe('PENDING')
    expect(
      parseLayerZeroStatus(response('DELIVERED'), 30600, 30101).status,
    ).toBe('PENDING')
  })

  it('rejects malformed upstream data', () => {
    expect(() => parseLayerZeroStatus({ data: null }, 30101, 30600)).toThrow()
  })
})
