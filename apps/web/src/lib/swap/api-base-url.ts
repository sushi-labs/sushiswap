import { API_BASE_URL as PROD_API_BASE_URL } from 'sushi/config'

export const API_BASE_URL =
  process.env['API_BASE_URL'] ||
  process.env['NEXT_PUBLIC_API_BASE_URL'] ||
  PROD_API_BASE_URL
