'use server'

import { isAddress } from 'viem'
import { signWidgetUrlV2 } from '../sign-widget-url-v2'

const DEFAULT_ONRAMPER_API_KEY = 'pk_prod_01GTYEN8CHRVPKES7HK2S9JXDJ'
const ONRAMPER_PRODUCTION_WIDGET_URL = 'https://buy.onramper.com'
const ONRAMPER_STAGING_WIDGET_URL = 'https://buy.onramper.dev'
const DEFAULT_CRYPTO_PATTERN = /^[a-zA-Z0-9_-]{1,128}$/

interface CreateOnramperUrlInput {
  address?: string
  defaultCrypto: string
  namespace: 'eth'
}

function getPrivateKeyPem(): string {
  const privateKeyPem = process.env.ONRAMPER_PRIVATE_KEY

  if (!privateKeyPem) {
    throw new Error('ONRAMPER_PRIVATE_KEY is not set')
  }

  return privateKeyPem.replaceAll(String.raw`\n`, '\n')
}

export async function createOnramperUrl({
  address,
  defaultCrypto,
  namespace,
}: CreateOnramperUrlInput): Promise<string> {
  if (namespace !== 'eth') {
    throw new Error('Unsupported Onramper wallet namespace')
  }

  if (address && !isAddress(address)) {
    throw new Error('Invalid Onramper wallet address')
  }

  if (!DEFAULT_CRYPTO_PATTERN.test(defaultCrypto)) {
    throw new Error('Invalid Onramper default crypto')
  }

  const apiKey =
    process.env.ONRAMPER_API_KEY?.trim() || DEFAULT_ONRAMPER_API_KEY
  const widgetUrl = apiKey.startsWith('pk_test_')
    ? ONRAMPER_STAGING_WIDGET_URL
    : ONRAMPER_PRODUCTION_WIDGET_URL
  const fields: Record<string, string> = {
    apiKey,
    defaultCrypto,
  }

  if (address) {
    fields.wallets = `${namespace}:${address}`
  }

  const signedUrl = signWidgetUrlV2({
    baseUrl: widgetUrl,
    privateKeyPem: getPrivateKeyPem(),
    fields,
  })
  const url = new URL(signedUrl)
  url.searchParams.set('themeName', 'sushi')

  return url.toString()
}
