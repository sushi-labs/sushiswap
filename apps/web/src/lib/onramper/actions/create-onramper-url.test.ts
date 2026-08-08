import { generateKeyPairSync } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createOnramperUrl } from './create-onramper-url'

const { privateKey } = generateKeyPairSync('ed25519', {
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
})

describe('createOnramperUrl', () => {
  beforeEach(() => {
    vi.stubEnv('ONRAMPER_API_KEY', 'pk_test_example')
    vi.stubEnv(
      'ONRAMPER_PRIVATE_KEY',
      privateKey.replaceAll('\n', String.raw`\n`),
    )
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('uses the staging widget and signs every core field', async () => {
    const signedUrl = await createOnramperUrl({
      address: '0x0000000000000000000000000000000000000001',
      defaultCrypto: 'ETH',
      namespace: 'eth',
    })
    const url = new URL(signedUrl)

    expect(url.origin).toBe('https://buy.onramper.dev')
    expect(url.searchParams.get('wallets')).toBe(
      'eth:0x0000000000000000000000000000000000000001',
    )
    expect(url.searchParams.get('themeName')).toBe('sushi')
    expect(url.searchParams.get('sigV2')).toMatch(/^v2:/)
    expect(url.searchParams.get('sigV2Fields')).toBe(
      'apiKey,defaultCrypto,wallets',
    )
  })

  it('rejects invalid client-provided fields', async () => {
    await expect(
      createOnramperUrl({
        defaultCrypto: 'ETH&email=attacker@example.com',
        namespace: 'eth',
      }),
    ).rejects.toThrow('Invalid Onramper default crypto')
  })
})
