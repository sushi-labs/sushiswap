import type { EvmTxHash } from 'sushi/evm'
import { isHash, keccak256 } from 'viem'
import { expect, test } from '../fixtures'
import { account } from '../fork'
import type { NetworkMocks } from '../intercept-anvil'

const target = '0x1000000000000000000000000000000000000001'

async function send(mocks: NetworkMocks, gas?: string): Promise<Response> {
  const response = await mocks.dispatch(
    new Request(mocks.rpcUrl, {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 42,
        method: 'eth_sendTransaction',
        params: [
          {
            from: account.address,
            to: target,
            ...(gas === undefined ? {} : { gas }),
          },
        ],
      }),
    }),
  )
  if (!(response instanceof Response)) throw new Error('Expected RPC response')
  return response
}

async function transactionHash(response: Response): Promise<EvmTxHash> {
  const body: unknown = await response.json()
  if (
    !body ||
    typeof body !== 'object' ||
    !('result' in body) ||
    typeof body.result !== 'string' ||
    !isHash(body.result)
  ) {
    throw new Error('Expected a transaction hash')
  }
  return body.result
}

test('gasless wallet transactions use the explicit estimate and execute storage writes', async ({
  fork,
  mocks,
}) => {
  // SSTORE(0, 1) needs more than the intrinsic transaction gas.
  await fork.client.setCode({ address: target, bytecode: '0x600160005500' })
  const gas = await fork.client.estimateGas({ to: target })
  const hash = await transactionHash(await send(mocks))
  expect((await fork.client.getTransaction({ hash })).gas).toBe(gas)
  expect((await fork.client.waitForTransactionReceipt({ hash })).status).toBe(
    'success',
  )
  expect(
    BigInt(
      (await fork.client.getStorageAt({ address: target, slot: '0x0' })) ??
        '0x0',
    ),
  ).toBe(1n)
})

test('an explicit insufficient gas limit is preserved and still reverts', async ({
  fork,
  mocks,
}) => {
  await fork.client.setCode({ address: target, bytecode: '0x600160005500' })
  let estimates = 0
  mocks.addRpc(async (request) => {
    if ((await request.json()).method === 'eth_estimateGas') estimates++
    return undefined
  })
  const hash = await transactionHash(await send(mocks, '0x5208'))
  expect((await fork.client.getTransaction({ hash })).gas).toBe(21_000n)
  expect((await fork.client.waitForTransactionReceipt({ hash })).status).toBe(
    'reverted',
  )
  expect(estimates).toBe(0)
})

test('signed transactions pass through unchanged without estimation', async ({
  fork,
  mocks,
}) => {
  const serialized = await fork.client.signTransaction({
    to: target,
    nonce: await fork.client.getTransactionCount({ address: account.address }),
    gas: 21_000n,
    gasPrice: 1_000_000_000n,
  })
  let estimates = 0
  mocks.addRpc(async (request) => {
    if ((await request.json()).method === 'eth_estimateGas') estimates++
    return undefined
  })
  const response = await mocks.dispatch(
    new Request(mocks.rpcUrl, {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 42,
        method: 'eth_sendRawTransaction',
        params: [serialized],
      }),
    }),
  )
  if (!(response instanceof Response)) throw new Error('Expected RPC response')
  const hash = await transactionHash(response)
  expect(hash).toBe(keccak256(serialized))
  expect((await fork.client.waitForTransactionReceipt({ hash })).status).toBe(
    'success',
  )
  expect(estimates).toBe(0)
})

test('estimation errors are returned without submitting a transaction', async ({
  fork,
  mocks,
}) => {
  const nonce = await fork.client.getTransactionCount({
    address: account.address,
  })
  const error = { code: 3, message: 'execution reverted', data: '0x1234' }
  mocks.addRpc(async (request) => {
    const rpc = await request.json()
    if (rpc.method === 'eth_estimateGas') {
      return Response.json({ jsonrpc: '2.0', id: rpc.id, error })
    }
  })
  expect(await (await send(mocks)).json()).toEqual({
    jsonrpc: '2.0',
    id: 42,
    error,
  })
  expect(
    await fork.client.getTransactionCount({ address: account.address }),
  ).toBe(nonce)
})
