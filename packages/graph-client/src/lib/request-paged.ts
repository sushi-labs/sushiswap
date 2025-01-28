import type { ResultOf, TadaDocumentNode, VariablesOf } from 'gql.tada'
import { type RequestOptions, request as _request } from 'src/lib/request'
import type { EvmChainId } from 'sushi/chain'
import { MAX_FIRST } from 'sushi/config/subgraph'
import { FetchError } from './fetch-error'

interface RequestPaged<T extends TadaDocumentNode<Record<string, unknown>>> {
  chainId: EvmChainId
  url: string
  query: T
  variables: VariablesOf<T>
  options?: RequestOptions | undefined
}

type ResultOfValue<T extends TadaDocumentNode> =
  ResultOf<T>[keyof ResultOf<T>][number][]

function request<T extends TadaDocumentNode>(
  url: string,
  query: T,
  variables: VariablesOf<T>,
  options?: RequestOptions,
): Promise<ResultOf<T>> {
  return _request(
    { url, document: query, variables: variables as any },
    options,
  ) as Promise<ResultOf<T>>
}

/**
 *
 * @brief A wrapper for graphql-request's request function that handles pagination
 * @warning This function only works with queries that have a single key in the result, the rest will be ignored
 *
 * @param chainId Required to retrieve the maxFirst value
 * @param url The URL of the subgraph
 * @param query The query to be executed
 * @param variables The variables to be passed to the query
 */
export async function requestPaged<T extends TadaDocumentNode>({
  chainId,
  url,
  query,
  variables,
  options,
}: RequestPaged<T>) {
  const maxFirst = MAX_FIRST[chainId]

  // No need to page
  if (
    'first' in variables &&
    typeof variables['first'] === 'number' &&
    variables['first'] <= maxFirst
  ) {
    return request(url, query, variables)
  }

  if ('orderBy' in variables) {
    throw new FetchError(chainId, 'orderBy is not allowed in requestPaged')
  }

  if ('orderDirection' in variables) {
    throw new FetchError(
      chainId,
      'orderDirection is not allowed in requestPaged',
    )
  }

  const querySelection = (query as any)?.definitions?.[0]?.selectionSet
    ?.selections?.[0]

  if (!querySelection) {
    throw new FetchError(chainId, 'Query selection not found')
  }

  // We need the id value to paginate

  // TODO: this is wrong, this is always throwing with first: Infinity variable.
  // if (
  //   !querySelection.selectionSet.selections.find((s: any) => {
  //     return s.name.value === 'id'
  //   })
  // ) {
  //   throw new FetchError(chainId, 'Id not found in query selection')
  // }

  const key = querySelection?.name?.value as keyof ResultOf<T>
  if (!key) {
    throw new FetchError(chainId, 'Key not found')
  }

  let lastSize = maxFirst
  let results: ResultOfValue<T> = []
  let lastId: string | null = null

  while (lastSize === maxFirst) {
    const lastIdWhere: any = typeof lastId === 'string' ? { id_gt: lastId } : {}

    const result = await request(
      url,
      query,
      {
        ...variables,
        first: maxFirst,
        where: {
          ...(variables?.['where'] ?? {}),
          ...lastIdWhere,
        },
        orderBy: 'id',
        orderDirection: 'asc',
      },
      options,
    ).then((r: ResultOf<T>) => {
      if (!r) return null
      return Object.values(r)[0] as ResultOfValue<T>
    })

    if (!result) {
      break
    }

    if (result.length === 0) {
      break
    }

    results = results.concat(result)

    lastSize = result.length
    lastId = result[result.length - 1]!.id

    if (
      'first' in variables &&
      typeof variables['first'] === 'number' &&
      results.length >= variables['first']
    ) {
      results = results.slice(0, variables['first'])
      break
    }
  }

  return { [key]: results } as ResultOf<T>
}
