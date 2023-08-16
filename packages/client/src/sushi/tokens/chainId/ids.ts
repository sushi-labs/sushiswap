import type { getTokenIdsByChainId } from '@sushiswap/tokens-api/lib/api'
import { TokenIdsApiSchema } from '@sushiswap/tokens-api/lib/schemas/chainId/ids'
import { TOKENS_API } from 'src/constants'
import { GetApiInputFromOutput, SWRHookConfig } from 'src/types'
import useSWR from 'swr'

export { TokenIdsApiSchema }
export type TokenId = Awaited<ReturnType<typeof getTokenIdsByChainId>>
export type GetTokenIdsArgs = GetApiInputFromOutput<
  (typeof TokenIdsApiSchema)['_input'],
  (typeof TokenIdsApiSchema)['_output']
>

export const getTokenIdsUrl = (args: GetTokenIdsArgs) => {
  return `${TOKENS_API}/api/v0/${args.chainId}/ids`
}

export const getTokenIds = async (args: GetTokenIdsArgs): Promise<TokenId> => {
  return fetch(getTokenIdsUrl(args)).then((data) => data.json())
}

export const useTokenIds = ({ args, shouldFetch }: SWRHookConfig<GetTokenIdsArgs>) => {
  return useSWR<TokenId>(shouldFetch !== false ? getTokenIdsUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
