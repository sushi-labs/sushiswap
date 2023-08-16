import { z } from 'zod'

import { Currency } from '../../enums.js'

export const TokenPricesV1ApiSchema = z.object({
  currency: z.nativeEnum(Currency).default(Currency.USD),
})
