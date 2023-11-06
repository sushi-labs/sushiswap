export const EVM_APP_BASE_URL =
  process.env['NEXT_PUBLIC_EVM_APP_BASE_URL'] ||
  process.env['NEXT_PUBLIC_VERCEL_URL']
    ? `https://${process.env['NEXT_PUBLIC_VERCEL_URL']}`
    : 'http://localhost:3000'

export const TOKEN_PRICE_API =
  process.env['TOKEN_PRICES_API_V0_BASE_URL'] ||
  process.env['NEXT_PUBLIC_TOKEN_PRICES_API_V0_BASE_URL'] ||
  'https://token-price.sushi.com'

export const TOKENS_API =
  process.env['TOKENS_API_V0_BASE_URL'] ||
  process.env['NEXT_PUBLIC_TOKENS_API_V0_BASE_URL'] ||
  'https://tokens.sushi.com'
