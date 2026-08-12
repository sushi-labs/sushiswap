import { generateKeyPairSync, verify } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { signWidgetUrlV2 } from './sign-widget-url-v2'

const NOW = new Date('2024-01-15T10:00:00.000Z')
const NONCE = '550e8400-e29b-41d4-a716-446655440000'
const EMPTY_BODY_HASH =
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

describe('signWidgetUrlV2', () => {
  it('creates a verifiable Ed25519 signature over the canonical query', () => {
    const { privateKey, publicKey } = generateKeyPairSync('ed25519', {
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      publicKeyEncoding: { type: 'spki', format: 'pem' },
    })
    const fields = {
      wallets: 'eth:0x1234',
      defaultCrypto: 'USDC ETH',
      apiKey: 'pk_test_example',
    }

    const signedUrl = signWidgetUrlV2({
      baseUrl: 'https://buy.onramper.dev',
      privateKeyPem: privateKey,
      fields,
      now: NOW,
      nonce: NONCE,
    })
    const url = new URL(signedUrl)
    const signature = url.searchParams.get('sigV2')
    const canonicalQuery =
      'apiKey=pk_test_example&defaultCrypto=USDC+ETH&wallets=eth%3A0x1234'
    const contentToSign = [
      'ONRAMPER-SIG-V2',
      NOW.toISOString(),
      NONCE,
      'GET',
      '/',
      canonicalQuery,
      '',
      EMPTY_BODY_HASH,
    ].join('\n')

    expect(signature).toMatch(/^v2:/)
    expect(
      verify(
        null,
        Buffer.from(contentToSign),
        publicKey,
        Buffer.from(signature?.slice(3) ?? '', 'base64'),
      ),
    ).toBe(true)
    expect(url.searchParams.get('sigV2Timestamp')).toBe(NOW.toISOString())
    expect(url.searchParams.get('sigV2Nonce')).toBe(NONCE)
    expect(url.searchParams.get('sigV2Expiry')).toBe('2024-01-15T10:15:00.000Z')
    expect(url.searchParams.get('sigV2Fields')).toBe(
      'apiKey,defaultCrypto,wallets',
    )
  })
})
