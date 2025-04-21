import type { ResponseError } from '@sushiswap/styro-client'

export async function parseStyroError(error: ResponseError) {
  try {
    const data = await error.response.json()

    if (typeof data.error.message !== 'string') {
      throw new Error('Invalid error message')
    }

    return data.error.message
  } catch {
    return 'An unknown error occurred'
  }
}
