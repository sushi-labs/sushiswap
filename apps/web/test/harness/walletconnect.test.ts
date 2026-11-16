import { expect, test } from '@playwright/test'
import { NetworkMocks } from '../intercept-anvil'
import { installWalletConnectMocks } from '../walletconnect-mocks'

test('WalletConnect bootstrap uses the AppKit project-limits response contract', async () => {
  const mocks = new NetworkMocks('http://127.0.0.1:8545/0')
  installWalletConnectMocks(mocks)
  const response = await mocks.dispatch(
    new Request(
      'https://api.web3modal.org/appkit/v1/project-limits?projectId=test',
    ),
  )
  expect(response).toBeInstanceOf(Response)
  if (!(response instanceof Response))
    throw new Error('Expected mocked metadata')
  expect(await response.json()).toEqual({
    planLimits: {
      tier: 'starter',
      isAboveRpcLimit: false,
      isAboveMauLimit: false,
    },
  })
  expect(mocks.requests).toEqual([
    {
      method: 'GET',
      url: 'https://api.web3modal.org/appkit/v1/project-limits',
      mocked: true,
    },
  ])
})

test('WalletConnect bootstrap allows local test origins and disables optional hosted features', async () => {
  const mocks = new NetworkMocks('http://127.0.0.1:8545/0')
  installWalletConnectMocks(mocks)
  for (const [path, expected] of [
    ['/appkit/v1/config', { features: [] }],
    [
      '/projects/v1/origins',
      { allowedOrigins: ['http://localhost:*', 'http://127.0.0.1:*'] },
    ],
  ] as const) {
    const response = await mocks.dispatch(
      new Request(`https://api.web3modal.org${path}`),
    )
    if (!(response instanceof Response))
      throw new Error('Expected mocked metadata')
    expect(await response.json()).toEqual(expected)
  }
})

test('WalletConnect mocks do not allow unknown endpoints, methods or other hosts', async () => {
  const mocks = new NetworkMocks('http://127.0.0.1:8545/0')
  installWalletConnectMocks(mocks)
  for (const request of [
    new Request('https://api.web3modal.org/appkit/v1/unrecorded'),
    new Request('https://example.com/appkit/v1/project-limits'),
    new Request('https://api.web3modal.org/appkit/v1/project-limits', {
      method: 'POST',
    }),
  ]) {
    await expect(mocks.dispatch(request)).rejects.toThrow('Unmocked fetch')
  }
})
