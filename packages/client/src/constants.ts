export const POOL_API =
  process.env['POOLS_API_V0_BASE_URL'] ||
  process.env['NEXT_PUBLIC_POOLS_API_V0_BASE_URL'] ||
  'https://pools.sushi.com'

export const STEER_VAULT_API =
  process.env['PSTEER_VAULT_BASE_URL'] ||
  process.env['NEXT_PUBLIC_STEER_VAULT_BASE_URL'] ||
  'https://steer-vault.sushi.com'
