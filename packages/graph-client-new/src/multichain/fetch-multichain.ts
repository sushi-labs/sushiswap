import type { FetchError } from '../lib/fetch-error'

export type Variables<T extends { [key: string]: any }> = keyof Omit<
  T,
  'chainId'
> extends undefined
  ? { variables?: Omit<T, 'chainId'> }
  : { variables: Omit<T, 'chainId'> }

export type FetchMultichain<
  ARG extends { [key: string]: any },
  RET extends Promise<unknown>,
> = {
  chainIds: ARG['chainId'][]
  fetch: (variables: ARG) => RET
} & Variables<ARG>

export async function fetchMultichain<
  ARG extends { [key: string]: any },
  RET extends Promise<unknown>,
>({
  chainIds,
  fetch,
  variables,
}: FetchMultichain<ARG, RET>): Promise<{
  data: Awaited<RET> extends unknown[] ? Awaited<RET> : Awaited<RET>[]
  errors: FetchError[]
}> {
  const promises = await Promise.allSettled(
    chainIds.map((chainId) => {
      return fetch({ ...(variables as ARG), chainId })
    }),
  )

  const data = [] as Awaited<RET> extends unknown[]
    ? Awaited<RET>
    : Awaited<RET>[]
  const errors = [] as FetchError[]

  for (const promise of promises) {
    if (promise.status === 'fulfilled') {
      const value = promise.value
      if (Array.isArray(value)) {
        data.push(...value)
      } else {
        data.push(value)
      }
    } else {
      errors.push(promise.reason)
    }
  }

  return { data, errors }
}
