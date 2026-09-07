import { NativeAddress } from 'src/lib/constants'
import { API_BASE_URL } from 'src/lib/swap/api-base-url'
import { USDC } from 'sushi/evm'
import { chainId, nativeAmount } from '../constants'
import { expect, test } from '../fixtures'
import { account } from '../fork'
import { BaseActions } from '../helpers/base'
import { installSwapRecording } from '../swap/recordings'

test('recordings enforce amount and sender, and never fall through to live swaps', async ({
  mocks,
}) => {
  await installSwapRecording(mocks, 'test/swap/mock/137-native-to-usdc.json')
  const url = new URL(`${API_BASE_URL}/swap/v7/${chainId}`)
  url.search = new URLSearchParams({
    tokenIn: NativeAddress,
    tokenOut: USDC[chainId].address,
    amount: nativeAmount.amount.toString(),
    sender: account.address,
  }).toString()
  const matched = await mocks.dispatch(new Request(url))
  expect(matched).toBeInstanceOf(Response)
  if (!(matched instanceof Response))
    throw new Error('Expected recorded response')
  expect((await matched.json()).status).toBe('Success')
  url.searchParams.set('amount', '1')
  await expect(mocks.dispatch(new Request(url))).rejects.toThrow(
    'Unrecorded swap request',
  )
  url.searchParams.set('amount', nativeAmount.amount.toString())
  url.searchParams.set('sender', '0x0000000000000000000000000000000000000001')
  await expect(mocks.dispatch(new Request(url))).rejects.toThrow(
    'Swap sender does not match recording',
  )
  await expect(
    mocks.dispatch(new Request('https://example.com/api/new-feature')),
  ).rejects.toThrow('Unmocked fetch')
})

test('a receipt with reverted status fails the transaction helper', async ({
  page,
  fork,
}) => {
  const target = '0x1000000000000000000000000000000000000001'
  await fork.client.setCode({ address: target, bytecode: '0x60006000fd' })
  await page.setContent('<button>Submit</button>')
  await page.evaluate(
    ({ url, from, to }) => {
      document.querySelector('button')?.addEventListener('click', () => {
        void fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_sendTransaction',
            params: [{ from, to, gas: '0x186a0' }],
          }),
        })
      })
    },
    { url: new URL(fork.url).origin, from: account.address, to: target },
  )
  const actions = new BaseActions(page, fork)
  await expect(
    actions.transact('Reverted probe', () =>
      page.getByRole('button', { name: 'Submit' }).click(),
    ),
  ).rejects.toThrow(/reverted/)
})
