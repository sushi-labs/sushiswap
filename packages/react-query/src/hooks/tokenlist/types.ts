import z from 'zod'
import { tokenListValidator, tokenValidator } from './validator'

export type UseTokenListQuerySelect = (data: TokenListType) => Record<string, TokenWithLogoURIType>
export type TokenListType = z.infer<typeof tokenListValidator>
export type TokenWithLogoURIType = z.infer<typeof tokenValidator>
