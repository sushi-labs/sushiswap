import { expect, it } from 'vitest'
import { getPendingTokenSecurity } from './token-security'

it('uses the data API’s findings and preserves explicitly reported false values', () => {
  const report = getPendingTokenSecurity({
    findings: [
      { check: 'transfer_fee', value: true },
      { check: 'buy_tax', value: false },
    ],
  })

  expect(report.rows).toMatchObject([
    { check: 'transfer_fee', goPlus: true, isIssue: true },
    { check: 'buy_tax', goPlus: false, isIssue: false },
  ])
  expect(report.isFoT).toBe(true)
})

it('returns an empty report for unavailable scans', () => {
  expect(getPendingTokenSecurity({ findings: [] }).rows).toEqual([])
  expect(getPendingTokenSecurity({ findings: null }).rows).toEqual([])
  expect(getPendingTokenSecurity(null).rows).toEqual([])
})
