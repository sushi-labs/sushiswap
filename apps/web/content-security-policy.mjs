const PRIVY_CONNECT_SOURCES = [
  'https://auth.privy.io',
  'https://api.privy.io',
  'https://*.rpc.privy.systems',
  'wss://*.rpc.privy.systems',
  'https://api.relay.link',
  'https://api.testnets.relay.link',
  'https://challenges.cloudflare.com',
  'https://hcaptcha.com',
  'https://*.hcaptcha.com',
]

const WALLET_CONNECT_SOURCES = [
  'https://rpc.walletconnect.com',
  'https://rpc.walletconnect.org',
  'https://relay.walletconnect.com',
  'https://relay.walletconnect.org',
  'wss://relay.walletconnect.com',
  'wss://relay.walletconnect.org',
  'https://pulse.walletconnect.com',
  'https://pulse.walletconnect.org',
  'https://api.web3modal.com',
  'https://api.web3modal.org',
  'https://keys.walletconnect.com',
  'https://keys.walletconnect.org',
  'https://notify.walletconnect.com',
  'https://notify.walletconnect.org',
  'https://echo.walletconnect.com',
  'https://echo.walletconnect.org',
  'https://push.walletconnect.com',
  'https://push.walletconnect.org',
  'https://explorer-api.walletconnect.com',
  'wss://www.walletlink.org',
]

const WALLET_CONNECTOR_SOURCES = [
  'https://cca-lite.coinbase.com',
  'https://api.wallet.coinbase.com',
  'https://rpc.wallet.coinbase.com',
  'https://keys.coinbase.com',
  'https://metamask-sdk.api.cx.metamask.io',
  'wss://metamask-sdk.api.cx.metamask.io',
  'https://mm-sdk-analytics.api.cx.metamask.io',
  'https://rpc.porto.sh',
  'https://stg-rpc.porto.sh',
]

const SUSHI_CONNECT_SOURCES = [
  'https://sushi.com',
  'https://*.sushi.com',
  'https://sushi-strapi-cms.herokuapp.com',
  'https://lb.drpc.live',
  'wss://lb.drpc.live',
  'https://sepolia.drpc.live',
  'https://rpc.bittorrentchain.io',
  'https://api.node.glif.io',
  'https://elated-tan-skat-indexer.skalenodes.com:10072',
  'https://rpc.zklink.io',
  'https://sepolia-rollup.arbitrum.io',
  'https://rpc.tatara.katanarpc.com',
  'https://rpc-bokuto.katanarpc.com',
]

const PRODUCT_CONNECT_SOURCES = [
  'https://api.coingecko.com',
  'https://api.gopluslabs.io',
  'https://api.trmlabs.com',
  'https://api.enso.finance',
  'https://api.merkl.xyz',
  'https://api.jup.ag',
  'https://li.quest',
  'https://h20qtjygwppc.statuspage.io',
  'https://api.hyperliquid.xyz',
  'wss://api.hyperliquid.xyz',
  'https://rpc.hyperliquid.xyz',
  'wss://rpc.hyperliquid.xyz',
  'https://stats-data.hyperliquid.xyz',
  'https://api.hyperunit.xyz',
  'https://indexer.api.across.to',
  'https://ro81h8hq6b.execute-api.us-east-1.amazonaws.com',
  'https://saveload.tradingview.com',
  'https://chat.mava.app',
  'https://order-sink-v2.orbs.network',
  "https://hub.orbs.network",
  "https://bi.orbs.network"
]

const NON_EVM_CONNECT_SOURCES = [
  'https://api.mainnet-beta.solana.com',
  'https://api.devnet.solana.com',
  'https://api.testnet.solana.com',
  'https://mainnet.helius-rpc.com',
  'https://fullnode.mainnet.aptoslabs.com',
  'https://fullnode.testnet.aptoslabs.com',
  'https://indexer.mainnet.aptoslabs.com',
  'https://indexer-testnet.staging.gcp.aptosdev.com',
  'https://api.stellar.expert',
  'https://rpc.ankr.com',
  'https://rpc-futurenet.stellar.org',
  'https://horizon-futurenet.stellar.org',
  'https://horizon.stellar.lobstr.co',
]

const ANALYTICS_CONNECT_SOURCES = [
  'https://va.vercel-scripts.com',
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
  'https://*.google-analytics.com',
  'https://*.analytics.google.com',
  'https://*.hotjar.com',
  'https://*.hotjar.io',
  'wss://*.hotjar.com',
  'https://tag.adrsbl.io',
  'https://*.adradv.io',
  'https://id5-sync.com',
  'https://*.id5-sync.com',
  'https://secure.adnxs.com',
]

const FRAME_SOURCES = [
  "'self'",
  'https://auth.privy.io',
  'https://verify.walletconnect.com',
  'https://verify.walletconnect.org',
  'https://secure.walletconnect.com',
  'https://secure.walletconnect.org',
  'https://challenges.cloudflare.com',
  'https://hcaptcha.com',
  'https://*.hcaptcha.com',
  'https://buy.onramper.com',
  'https://widget.swapped.com',
  'https://www.googletagmanager.com',
  'https://id.porto.sh',
  'https://stg.id.porto.sh',
  'https://vercel.live',
  'https://privy.sushi.com',
]

const FRAME_ANCESTORS = [
  "'self'",
  'https://app.safe.global',
  'https://app.m-safe.io',
  'https://testnet.m-safe.io',
]

/**
 * @param {string} name
 * @param {string[]} sources
 * @returns {string}
 */
function createDirective(name, sources) {
  return `${name} ${[...new Set(sources)].join(' ')}`
}

/**
 * @param {{
 *   additionalConnectSources?: string[]
 *   isDevelopment: boolean
 *   isTest: boolean
 * }} options
 * @returns {string}
 */
export function createContentSecurityPolicy({
  additionalConnectSources = [],
  isDevelopment,
  isTest,
}) {
  const isLocalEnvironment = isDevelopment || isTest

  const directives = [
    createDirective('default-src', ["'self'"]),
    createDirective('script-src', [
      "'self'",
      // Next.js emits inline bootstrap scripts unless the entire app switches to
      // per-request nonces and dynamic rendering.
      "'unsafe-inline'",
      "'wasm-unsafe-eval'",
      // React development mode uses eval for debugging features like callstack
      // reconstruction.
      ...(isLocalEnvironment ? ["'unsafe-eval'"] : []),
      'https://challenges.cloudflare.com',
      'https://hcaptcha.com',
      'https://*.hcaptcha.com',
      'https://www.googletagmanager.com',
      'https://static.hotjar.com',
      'https://script.hotjar.com',
      'https://widget.mava.app',
      'https://va.vercel-scripts.com',
      'https://tag.adrsbl.io',
      'https://cdn.id5-sync.com',
      'https://vercel.live',
    ]),
    createDirective('style-src', [
      "'self'",
      "'unsafe-inline'",
      'https://hcaptcha.com',
      'https://*.hcaptcha.com',
      'https://fonts.googleapis.com',
      'https://static.hotjar.com',
      'https://script.hotjar.com',
    ]),
    // Token and wallet metadata can supply images from arbitrary HTTPS hosts.
    createDirective('img-src', ["'self'", 'data:', 'blob:', 'https:']),
    createDirective('font-src', [
      "'self'",
      'data:',
      'https://fonts.gstatic.com',
      'https://fonts.reown.com',
      'https://script.hotjar.com',
    ]),
    createDirective('connect-src', [
      "'self'",
      ...PRIVY_CONNECT_SOURCES,
      ...WALLET_CONNECT_SOURCES,
      ...WALLET_CONNECTOR_SOURCES,
      ...SUSHI_CONNECT_SOURCES,
      ...PRODUCT_CONNECT_SOURCES,
      ...NON_EVM_CONNECT_SOURCES,
      ...ANALYTICS_CONNECT_SOURCES,
      ...additionalConnectSources,
      ...(isLocalEnvironment
        ? [
            'http://localhost:*',
            'http://127.0.0.1:*',
            'ws://localhost:*',
            'ws://127.0.0.1:*',
          ]
        : []),
    ]),
    createDirective('frame-src', FRAME_SOURCES),
    createDirective('child-src', [...FRAME_SOURCES, 'blob:']),
    createDirective('frame-ancestors', FRAME_ANCESTORS),
    createDirective('worker-src', ["'self'", 'blob:']),
    createDirective('media-src', ["'self'", 'blob:', 'https:']),
    createDirective('manifest-src', ["'self'"]),
    createDirective('object-src', ["'none'"]),
    createDirective('base-uri', ["'self'"]),
    createDirective('form-action', ["'self'"]),
    ...(!isLocalEnvironment ? ['upgrade-insecure-requests'] : []),
  ]

  return directives.join('; ')
}
