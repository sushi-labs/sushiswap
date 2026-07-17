import { describe, expect, it } from 'vitest'
import { RpcFaultScheduler } from './rpc-chaos'

describe('RpcFaultScheduler', () => {
  it('activates a method-filtered fault for a bounded deterministic window', () => {
    const scheduler = new RpcFaultScheduler({
      rules: [
        {
          activateOn: 2,
          duration: 2,
          id: 'second-and-third-receipt',
          kind: 'drop-receipt',
          methods: ['eth_getTransactionReceipt'],
        },
      ],
      seed: 42,
    })

    expect(scheduler.schedule({ method: 'eth_blockNumber' })).toEqual([])
    expect(scheduler.schedule({ method: 'eth_getTransactionReceipt' })).toEqual(
      [],
    )
    expect(
      scheduler.schedule({ method: 'eth_getTransactionReceipt' }),
    ).toHaveLength(1)
    expect(
      scheduler.schedule({ method: 'eth_getTransactionReceipt' }),
    ).toHaveLength(1)
    expect(scheduler.schedule({ method: 'eth_getTransactionReceipt' })).toEqual(
      [],
    )
  })

  it('replays jitter from the seed, rule, and activation', () => {
    const profile = {
      rules: [
        {
          activateOn: 1,
          duration: 1,
          id: 'latency',
          kind: 'delay' as const,
          methods: ['eth_call'],
          options: { jitterMs: 25 },
        },
      ],
      seed: 7,
    }
    const first = new RpcFaultScheduler(profile)
    const second = new RpcFaultScheduler(profile)
    expect(first.jitter(first.schedule({ method: 'eth_call' })[0])).toBe(
      second.jitter(second.schedule({ method: 'eth_call' })[0]),
    )
  })
})
