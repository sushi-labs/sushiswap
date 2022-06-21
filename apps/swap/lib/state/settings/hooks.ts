import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { SettingsContext } from './context'
import { GasPrice, SettingsState, WithSettingsState } from './types'

type UseSettingsReturn = [
  SettingsState,
  {
    updateSlippageTolerance(slippageTolerance: number): void
    updateMaxFeePerGas(updateMaxFeePerGas: number): void
    updateMaxPriorityFeePerGas(maxPriorityFeePerGas: number): void
    updateGasPrice(gasPrice: GasPrice): void
  }
]

type UseSettings = (context: SettingsContext) => UseSettingsReturn

export const useSettings: UseSettings = (context) => {
  const { reducerPath, actions } = context
  const settings = useSelector((state: WithSettingsState) => state[reducerPath])
  const dispatch = useDispatch()

  const updateSlippageTolerance = useCallback(
    (slippageTolerance: number) => {
      dispatch(actions.updateSlippageTolerance({ slippageTolerance }))
    },
    [actions, dispatch]
  )

  const updateMaxFeePerGas = useCallback(
    (maxFeePerGas: number | undefined) => {
      dispatch(actions.updateMaxFeePerGas({ maxFeePerGas }))
    },
    [actions, dispatch]
  )

  const updateMaxPriorityFeePerGas = useCallback(
    (maxPriorityFeePerGas: number | undefined) => {
      dispatch(actions.updateMaxPriorityFeePerGas({ maxPriorityFeePerGas }))
    },
    [actions, dispatch]
  )

  const updateGasPrice = useCallback(
    (gasPrice: GasPrice) => {
      dispatch(actions.updateGasPrice({ gasPrice }))
    },
    [actions, dispatch]
  )

  return [settings, { updateSlippageTolerance, updateMaxFeePerGas, updateMaxPriorityFeePerGas, updateGasPrice }]
}
