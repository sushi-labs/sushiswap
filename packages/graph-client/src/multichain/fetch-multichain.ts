import type { FetchError } from '../lib/fetch-error.js'
import type { RequestOptions } from '../lib/request.js'

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
  chainIds: Readonly<ARG['chainId'][]>
  fetch: (variables: ARG, options?: RequestOptions) => RET
  options?: RequestOptions | undefined
} & Variables<ARG>

export async function fetchMultichain<
  ARG extends { [key: string]: any },
  RET extends Promise<unknown>,
>({
  chainIds,
  fetch,
  variables,
  options,
}: FetchMultichain<ARG, RET>): Promise<{
  data: Awaited<RET> extends unknown[] ? Awaited<RET> : Awaited<RET>[]
  errors: FetchError[]
}> {
  const promises = await Promise.allSettled(
    chainIds.map((chainId) => {
      return fetch({ ...(variables as ARG), chainId }, options)
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
