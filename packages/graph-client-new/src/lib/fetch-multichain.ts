import type { ChainIdVariable } from 'src/chainId'
import type { ChainId } from 'sushi/chain'

type FetchMultichain<
  C extends ChainId,
  A extends { [key: string]: any } & ChainIdVariable<C>,
  RET extends Promise<unknown[]>,
> = {
  chainIds: C[]
  fetch: (variables: A) => RET
  variables: Omit<A, 'chainId'>
}

export async function fetchMultichain<
  C extends ChainId,
  A extends { [key: string]: any } & ChainIdVariable<C>,
  RET extends Promise<unknown[]>,
>({
  chainIds,
  fetch,
  variables,
}: FetchMultichain<C, A, RET>): Promise<{
  data: Awaited<RET>
  errors: any[]
}> {
  const promises = await Promise.allSettled(
    chainIds.map((chainId) => {
      return fetch({ ...(variables as A), chainId })
    }),
  )

  const data = [] as Awaited<RET>
  const errors = []

  for (const promise of promises) {
    if (promise.status === 'fulfilled') {
      data.push(...promise.value)
    } else {
      errors.push(promise.reason)
    }
  }

  return { data, errors }
}
