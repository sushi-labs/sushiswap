import { Token } from 'sushi/currency'
import z from 'zod'

import { tokenListValidator } from './validator'

export type UseTokenListQuerySelect = (
  data: TokenListType,
) => Record<string, Token>
export type TokenListType = z.infer<typeof tokenListValidator>
