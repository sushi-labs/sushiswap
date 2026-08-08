import { describe, expect, it } from 'vitest'
import type { AgenticFinding } from './finding-schema'
import {
  deduplicateFindings,
  failureFingerprint,
  redactSensitiveData,
} from './finding-writer'

describe('finding artifacts', () => {
  it('normalizes equivalent failure fingerprints', () => {
    const base = {
      chainId: 8453,
      contractFunction: 'approve(address,uint256)',
      errorClass: ' Reverted Receipt ',
      flowStep: 'Approval receipt',
      receiptStatus: 'reverted',
      topTraceFrames: ['ERC20.approve'],
      uiStateSignature: 'Approval success toast',
    }
    expect(failureFingerprint(base)).toBe(
      failureFingerprint({
        ...base,
        errorClass: 'reverted   receipt',
      }),
    )
  })

  it('redacts credentials and URL secrets recursively', () => {
    expect(
      redactSensitiveData({
        adminRpcUrl: 'https://rpc.invalid/private',
        nested: {
          goplusAccessToken: 'do-not-persist',
          url: 'https://api.invalid/path?access_token=secret&ok=1',
        },
      }),
    ).toEqual({
      adminRpcUrl: '[REDACTED]',
      nested: {
        goplusAccessToken: '[REDACTED]',
        url: 'https://api.invalid/path?access_token=%5BREDACTED%5D&ok=1',
      },
    })
  })

  it('collapses repeated fingerprints', () => {
    const finding = { fingerprint: 'same' } as AgenticFinding
    expect(deduplicateFindings([finding, finding])).toEqual([
      { finding, occurrences: 2 },
    ])
  })
})
