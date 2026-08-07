import { createHash, createPrivateKey, randomUUID, sign } from 'node:crypto'

const SIGNATURE_VERSION = 'ONRAMPER-SIG-V2'
const EMPTY_BODY_HASH = createHash('sha256').update('').digest('hex')

interface SignWidgetUrlV2Options {
  baseUrl: string
  privateKeyPem: string
  fields: Readonly<Record<string, string>>
  now?: Date
  nonce?: string
}

export function signWidgetUrlV2({
  baseUrl,
  privateKeyPem,
  fields,
  now = new Date(),
  nonce = randomUUID(),
}: SignWidgetUrlV2Options): string {
  const timestamp = now.toISOString()
  const expiry = new Date(now.getTime() + 15 * 60 * 1000).toISOString()
  const canonicalParams = new URLSearchParams(fields)
  canonicalParams.sort()

  const contentToSign = [
    SIGNATURE_VERSION,
    timestamp,
    nonce,
    'GET',
    '/',
    canonicalParams.toString(),
    '',
    EMPTY_BODY_HASH,
  ].join('\n')

  const privateKey = createPrivateKey(privateKeyPem)
  const signature = sign(null, Buffer.from(contentToSign), privateKey)
  const url = new URL(baseUrl)

  for (const [key, value] of Object.entries(fields)) {
    url.searchParams.set(key, value)
  }

  url.searchParams.set('sigV2', `v2:${signature.toString('base64')}`)
  url.searchParams.set('sigV2Timestamp', timestamp)
  url.searchParams.set('sigV2Nonce', nonce)
  url.searchParams.set('sigV2Expiry', expiry)
  url.searchParams.set('sigV2Fields', Object.keys(fields).sort().join(','))

  return url.toString()
}
