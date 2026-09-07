import { parseEther } from 'viem'
import { expect, test } from '../fixtures'
import { account } from '../fork'

// Intentionally fails once, only in the subprocess launched by recovery.test.ts.
test('replacement worker starts clean after a failed transaction scenario', async ({
  fork,
}, info) => {
  expect(new URL(fork.url).pathname).toBe(`/${info.workerIndex}`)
  expect(
    await fork.client.getBalance({ address: account.address }),
  ).toBeGreaterThan(parseEther('100'))
  expect(
    await fork.client.getTransactionCount({ address: account.address }),
  ).toBe(1)
  if (info.retry === 0) {
    await fork.client.setBalance({ address: account.address, value: 1n })
    await fork.client.setNonce({ address: account.address, nonce: 100 })
    throw new Error('Intentional failure to verify worker recovery')
  }
  expect(info.workerIndex).toBeGreaterThan(0)
})
