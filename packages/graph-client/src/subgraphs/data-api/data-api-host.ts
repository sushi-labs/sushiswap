import { SUSHI_DATA_API_HOST as PROD_SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'

export const SUSHI_DATA_API_HOST =
  process.env['SUSHI_DATA_API_HOST'] ||
  process.env['NEXT_PUBLIC_SUSHI_DATA_API_HOST'] ||
  PROD_SUSHI_DATA_API_HOST
