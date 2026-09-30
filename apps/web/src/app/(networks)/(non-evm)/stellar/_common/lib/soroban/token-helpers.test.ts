import { afterEach, expect, it, vi } from 'vitest'
import { getTokenBalance } from './token-helpers'

const balance = vi.hoisted(() => vi.fn())
vi.mock('./client', () => ({ getTokenContractClient: () => ({ balance }) }))
const account = 'GCOBBPEQOWGFBGHOXJBAH2XENGVSLM72S32S5YARQ5OIES5O6FGEYARQ'
const token = 'CC64WBDGS6QQP22QTTIACYIXT3WF7BBQEYOQPLTP7GTKYY7PZ74QYGSL'
afterEach(() => vi.restoreAllMocks())

it('does not cache an RPC failure as a real zero token balance', async () => {
  const error = new Error('RPC temporarily unavailable')
  balance.mockRejectedValueOnce(error)
  vi.spyOn(console, 'error').mockImplementation(() => {})
  await expect(getTokenBalance(account, token)).rejects.toBe(error)
})

it('preserves an exact 18-decimal contract balance and a known absent trustline', async () => {
  balance.mockResolvedValueOnce({ result: 209641704638935271n })
  expect(await getTokenBalance(account, token)).toBe(209641704638935271n)
  balance.mockRejectedValueOnce(
    new Error('Error(Storage, MissingValue): trustline entry is missing'),
  )
  expect(await getTokenBalance(account, token)).toBe(0n)
  const missingStorage = new Error(
    'Error(Storage, MissingValue): contract instance is missing',
  )
  balance.mockRejectedValueOnce(missingStorage)
  vi.spyOn(console, 'error').mockImplementation(() => {})
  await expect(getTokenBalance(account, token)).rejects.toBe(missingStorage)
})
