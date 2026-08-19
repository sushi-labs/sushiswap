import type { UseQueryResult } from '@tanstack/react-query'
import type { UseEvmTradeReturn } from 'src/lib/hooks/react-query'
import { describe, expect, it } from 'vitest'
import { combineEvmTradeQueries } from './combine-evm-trade-queries'

function createQueryResult(
  overrides: Partial<UseQueryResult<UseEvmTradeReturn, Error>> = {},
): UseQueryResult<UseEvmTradeReturn, Error> {
  return {
    data: undefined,
    error: null,
    isError: false,
    isFetching: false,
    isInitialLoading: false,
    isLoading: false,
    isSuccess: false,
    ...overrides,
  } as UseQueryResult<UseEvmTradeReturn, Error>
}

const trade = { status: 'Success' } as UseEvmTradeReturn

describe('combineEvmTradeQueries', () => {
  it('projects only the supported query state when direct pools are disabled', () => {
    const result = combineEvmTradeQueries(
      createQueryResult({ data: trade, isSuccess: true }),
      createQueryResult(),
      false,
    )

    expect(result).toEqual({
      data: trade,
      error: null,
      isError: false,
      isFetching: false,
      isInitialLoading: false,
      isLoading: false,
      isSuccess: true,
    })
    expect('refetch' in result).toBe(false)
  })

  it('exposes available data while the other source is still fetching', () => {
    const result = combineEvmTradeQueries(
      createQueryResult({ data: trade, isSuccess: true }),
      createQueryResult({
        isFetching: true,
        isInitialLoading: true,
        isLoading: true,
      }),
    )

    expect(result).toMatchObject({
      data: trade,
      error: null,
      isError: false,
      isFetching: true,
      isInitialLoading: false,
      isLoading: false,
      isSuccess: true,
    })
  })

  it('reports loading while neither source has data', () => {
    const result = combineEvmTradeQueries(
      createQueryResult({
        isFetching: true,
        isInitialLoading: true,
        isLoading: true,
      }),
      createQueryResult({
        isFetching: true,
        isInitialLoading: true,
        isLoading: true,
      }),
    )

    expect(result).toMatchObject({
      data: undefined,
      error: null,
      isError: false,
      isFetching: true,
      isInitialLoading: true,
      isLoading: true,
      isSuccess: false,
    })
  })

  it('reports an error only after both sources have settled without data', () => {
    const error = new Error('Aggregator failed')

    const pendingResult = combineEvmTradeQueries(
      createQueryResult({ error, isError: true }),
      createQueryResult({ isFetching: true }),
    )

    expect(pendingResult).toMatchObject({
      data: undefined,
      error: null,
      isError: false,
      isFetching: true,
      isSuccess: false,
    })

    const result = combineEvmTradeQueries(
      createQueryResult({ error, isError: true }),
      createQueryResult(),
    )

    expect(result).toMatchObject({
      data: undefined,
      error,
      isError: true,
      isFetching: false,
      isSuccess: false,
    })
  })
})
