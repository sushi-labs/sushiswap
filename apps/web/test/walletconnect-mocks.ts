import type { NetworkMocks } from './intercept-anvil'

/** AppKit bootstrap metadata, with every other WalletConnect request kept strict. */
export function installWalletConnectMocks(mocks: NetworkMocks): void {
  mocks.add((request) => {
    const url = new URL(request.url)
    if (request.method !== 'GET' || url.hostname !== 'api.web3modal.org') return

    switch (url.pathname) {
      case '/appkit/v1/project-limits':
        return Response.json({
          planLimits: {
            tier: 'starter',
            isAboveRpcLimit: false,
            isAboveMauLimit: false,
          },
        })
      case '/appkit/v1/config':
        return Response.json({ features: [] })
      case '/projects/v1/origins':
        return Response.json({
          allowedOrigins: ['http://localhost:*', 'http://127.0.0.1:*'],
        })
    }
  })
}
