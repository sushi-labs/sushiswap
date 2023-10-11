export const POOL_API =
  process.env['POOLS_API_V0_BASE_URL'] ||
  process.env['NEXT_PUBLIC_POOLS_API_V0_BASE_URL'] ||
  'https://pools.sushi.com'

export const TOKEN_PRICE_API =
  process.env['TOKEN_PRICES_API_V0_BASE_URL'] ||
  process.env['NEXT_PUBLIC_TOKEN_PRICES_API_V0_BASE_URL'] ||
  'https://token-price.sushi.com'

export const STEER_VAULT_API =
  process.env['PSTEER_VAULT_BASE_URL'] ||
  process.env['NEXT_PUBLIC_STEER_VAULT_BASE_URL'] ||
  'https://steer-vault.sushi.com'

export const TOKENS_API =
  process.env['TOKENS_API_V0_BASE_URL'] ||
  process.env['NEXT_PUBLIC_TOKENS_API_V0_BASE_URL'] ||
  'https://tokens.sushi.com'
