import type { PendingTokens } from '@sushiswap/graph-client/data-api/queries/token-list-submission'
import {
  type TokenSecurity,
  type TokenSecurityResponse,
  summarizeTokenSecurity,
} from 'src/lib/token-security'

export function getPendingTokenSecurity(
  security: PendingTokens[number]['security'],
): TokenSecurityResponse {
  const findings: TokenSecurity = {}
  for (const { check, value } of security?.findings ?? []) {
    findings[check] = value
  }
  return summarizeTokenSecurity(findings)
}
