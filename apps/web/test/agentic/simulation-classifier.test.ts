import { describe, expect, it } from 'vitest'
import { classifyTrace } from './simulation-classifier'

describe('classifyTrace', () => {
  it('classifies a successful root call even when a handled child call reverted', () => {
    expect(
      classifyTrace({
        calls: [{ error: 'execution reverted', revertReason: 'probe failed' }],
        gasUsed: '0x1',
        type: 'CALL',
      }).classification,
    ).toBe('success')
  })

  it.each([
    ['insufficient allowance', 'insufficient-allowance'],
    ['ERC20: transfer amount exceeds balance', 'insufficient-balance'],
    ['Too little received', 'minimum-output-violation'],
    ['out of gas', 'out-of-gas'],
    ['TransferHelper: TRANSFER_FROM_FAILED', 'token-transfer-error'],
    ['custom contract failure', 'unknown-revert'],
  ] as const)('classifies %s as %s', (message, expected) => {
    expect(
      classifyTrace({ error: 'execution reverted', revertReason: message })
        .classification,
    ).toBe(expected)
  })
})
