import {Token} from "@sushiswap/currency";
import z from 'zod'

import { tokenListValidator } from './validator'

export type UseTokenListQuerySelect = (data: TokenListType) => Record<string, Token>
export type TokenListType = z.infer<typeof tokenListValidator>
