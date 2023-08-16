import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getTokens } from '../../lib/api.js'
// import { TokensApiSchema } from '../../lib/schemas/index.js'

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=86400')

  // const result = TokensApiSchema.safeParse(request.query)
  // if (!result.success) {
  //   return response.status(400).json(result.error.format())
  // }

  // const {} = result.data

  const tokens = await getTokens()
  return response.status(200).json(tokens)
}

export default handler
