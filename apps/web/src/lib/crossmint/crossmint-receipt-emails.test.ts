import { describe, expect, it } from 'vitest'
import {
  getCrossmintReceiptEmailKey,
  parseCrossmintReceiptEmails,
} from './crossmint-receipt-emails'

describe('Crossmint receipt email storage', () => {
  it('normalizes EVM addresses for case-insensitive wallet lookup', () => {
    expect(
      getCrossmintReceiptEmailKey(
        'evm',
        '0x00000000000000000000000000000000000000Ab',
      ),
    ).toBe('evm:0x00000000000000000000000000000000000000ab')
  })

  it('preserves case-sensitive wallet addresses', () => {
    expect(getCrossmintReceiptEmailKey('svm', 'AbCd1234')).toBe('svm:AbCd1234')
    expect(getCrossmintReceiptEmailKey('stellar', 'GABC1234')).toBe(
      'stellar:GABC1234',
    )
  })

  it('keeps only valid wallet and email entries from browser storage', () => {
    expect(
      parseCrossmintReceiptEmails({
        'evm:0xabc': 'evm@example.com',
        'other:wallet': 'other@example.com',
        'svm:AbCd1234': 'not-an-email',
      }),
    ).toEqual({
      'evm:0xabc': 'evm@example.com',
    })
  })

  it('ignores malformed browser storage values', () => {
    expect(parseCrossmintReceiptEmails(null)).toEqual({})
    expect(parseCrossmintReceiptEmails('buyer@example.com')).toEqual({})
  })
})
