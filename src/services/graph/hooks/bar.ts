import { getBar, getBarHistory } from 'app/services/graph/fetchers/bar'
import stringify from 'fast-json-stable-stringify'
import useSWR from 'swr'

import { GraphProps } from '../interfaces'

export function useBar({ variables, shouldFetch = true, swrConfig = undefined }: GraphProps = {}) {
  return useSWR(shouldFetch ? ['bar', stringify(variables)] : null, () => getBar(variables), swrConfig)
}

export function useBarHistory({ variables, shouldFetch = true, swrConfig = undefined }: GraphProps = {}) {
  return useSWR(shouldFetch ? ['barHistory', stringify(variables)] : null, () => getBarHistory(variables), swrConfig)
}
