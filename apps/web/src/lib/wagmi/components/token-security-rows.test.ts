import { describe, expect, it } from 'vitest'
import { getTokenSecurityRows } from './token-security-rows'

const isIssueByKey = {
  is_honeypot: (value: boolean | undefined) => value === true,
  is_open_source: (value: boolean | undefined) => value === false,
}

describe('getTokenSecurityRows', () => {
  it('ignores unsupported scanner fields instead of rendering them', () => {
    const data = {
      cannot_buy: { deFi: true },
      cannot_sell_all: { deFi: true },
      is_honeypot: { goPlus: true },
      is_open_source: { goPlus: true },
    }

    expect(getTokenSecurityRows(data, isIssueByKey)).toEqual({
      rows: [
        { key: 'is_honeypot', isIssue: true },
        { key: 'is_open_source', isIssue: false },
      ],
      issueCount: 1,
    })
  })
})
