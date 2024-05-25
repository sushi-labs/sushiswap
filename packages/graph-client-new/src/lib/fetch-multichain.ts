import type { FetchError } from './fetch-error'

type FetchMultichain<
  ARG extends { [key: string]: any },
  RET extends Promise<unknown[]>,
> = {
  chainIds: ARG['chainId'][]
  fetch: (variables: ARG) => RET
  variables: Omit<ARG, 'chainId'>
}

export async function fetchMultichain<
  ARG extends { [key: string]: any },
  RET extends Promise<unknown[]>,
>({
  chainIds,
  fetch,
  variables,
}: FetchMultichain<ARG, RET>): Promise<{
  data: Awaited<RET>
  errors: FetchError[]
}> {
  const promises = await Promise.allSettled(
    chainIds.map((chainId) => {
      return fetch({ ...(variables as ARG), chainId })
    }),
  )

  const data = [] as Awaited<RET>
  const errors = [] as FetchError[]

  for (const promise of promises) {
    if (promise.status === 'fulfilled') {
      data.push(...promise.value)
    } else {
      errors.push(promise.reason)
    }
  }

  return { data, errors }
}
