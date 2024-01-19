// import type { VercelRequest, VercelResponse } from '@vercel/node'
// import { z } from 'zod'

// import { Currency } from '../../lib/enums.js'
// import { getPrices } from '../../lib/v2.js'

// const schema = z.object({
//   currency: z.nativeEnum(Currency).default(Currency.USD),
// })

// const handler = async (request: VercelRequest, response: VercelResponse) => {
//   response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600')

//   const { currency } = schema.parse(request.query)

//   const prices = await getPrices(currency)
//   return response.status(200).json(tokens)
// }

// export default handler
