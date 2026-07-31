import { EvmChainId } from 'sushi/evm'
import { StellarChainId } from 'sushi/stellar'
import { describe, expect, it } from 'vitest'
import { shouldBypassTokenSecurityCheck } from './token-security-import-policy'

describe('shouldBypassTokenSecurityCheck', () => {
  it.each(['APPROVED', 'PERMISSIONLESS'] as const)(
    'bypasses EVM token security for %s tokens',
    (approvalStatus) => {
      expect(
        shouldBypassTokenSecurityCheck({
          chainId: EvmChainId.ETHEREUM,
          approvalStatus,
        }),
      ).toBe(true)
    },
  )

  it.each(['UNKNOWN', 'DISAPPROVED', undefined] as const)(
    'keeps EVM token security enabled for %s tokens',
    (approvalStatus) => {
      expect(
        shouldBypassTokenSecurityCheck({
          chainId: EvmChainId.ETHEREUM,
          approvalStatus,
        }),
      ).toBe(false)
    },
  )

  it('does not bypass the import dialog for non-EVM tokens', () => {
    expect(
      shouldBypassTokenSecurityCheck({
        chainId: StellarChainId.STELLAR,
        approvalStatus: 'APPROVED',
      }),
    ).toBe(false)
  })
})
