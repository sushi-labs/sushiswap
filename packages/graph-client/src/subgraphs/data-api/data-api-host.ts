import { SUSHI_DATA_API_HOST as PROD_SUSHI_DATA_API_HOST } from 'sushi/evm'

export const SUSHI_DATA_API_HOST = 'https://data-api-staging.data-gcp.sushi.com'
process.env['SUSHI_DATA_API_HOST'] ||
  process.env['NEXT_PUBLIC_SUSHI_DATA_API_HOST'] ||
  PROD_SUSHI_DATA_API_HOST
