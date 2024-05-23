import { MAX_FIRST } from '@sushiswap/graph-config'
import type { ResultOf, TadaDocumentNode, VariablesOf } from 'gql.tada'
import _request from 'graphql-request'
import type { ChainId } from 'sushi/chain'

interface RequestPaged<T extends TadaDocumentNode<Record<string, unknown>>> {
  chainId: ChainId
  url: string
  query: T
  variables: VariablesOf<T>
}

type ResultOfValue<T extends TadaDocumentNode> =
  ResultOf<T>[keyof ResultOf<T>][number][]

function request<T extends TadaDocumentNode>(
  url: string,
  query: T,
  variables: VariablesOf<T>,
): Promise<ResultOf<T>> {
  return _request(url, query, variables as any) as Promise<ResultOf<T>>
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
    throw new Error('orderBy is not allowed in requestPaged')
  }

  if ('orderDirection' in variables) {
    throw new Error('orderDirection is not allowed in requestPaged')
  }

  const querySelection = (query as any)?.definitions?.[0]?.selectionSet
    ?.selections?.[0]

  if (!querySelection) {
    throw new Error('Query selection not found')
  }

  // We need the id value to paginate
  if (
    !querySelection.selectionSet.selections.find((s: any) => {
      return s.name.value === 'id'
    })
  ) {
    throw new Error('Id not found in query selection')
  }

  const key = querySelection?.name?.value as keyof ResultOf<T>
  if (!key) {
    throw new Error('Key not found')
  }

  let lastSize = maxFirst
  let results: ResultOfValue<T> = []
  let lastId: string | null = null

  while (lastSize === maxFirst) {
    const lastIdWhere: any = typeof lastId === 'string' ? { id_gt: lastId } : {}

    const result = await request(url, query, {
      ...variables,
      first: maxFirst,
      where: {
        ...(variables?.['where'] ?? {}),
        ...lastIdWhere,
      },
      orderBy: 'id',
      orderDirection: 'asc',
    }).then((r: ResultOf<T>) => {
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
