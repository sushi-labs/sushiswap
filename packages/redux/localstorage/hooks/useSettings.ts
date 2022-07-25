import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { StorageContext } from '../context'
import { GasPrice, StorageState, WithStorageState } from '../types'

type UseSettingsReturn = [
  Omit<StorageState, 'customTokens'>,
  {
    updateSlippageTolerance(slippageTolerance: number): void
    updateSlippageToleranceType(slippageToleranceType: 'auto' | 'custom'): void
    updateMaxFeePerGas(updateMaxFeePerGas: number | string | undefined): void
    updateMaxPriorityFeePerGas(maxPriorityFeePerGas: number | string | undefined): void
    updateGasPrice(gasPrice: GasPrice): void
    updateGasType(gasType: 'preset' | 'custom'): void
    updateExpertMode(expertMode: boolean): void
  }
]

type UseSettings = (context: StorageContext) => UseSettingsReturn

export const useSettings: UseSettings = (context) => {
  const { reducerPath, actions } = context
  const { customTokens, ...settings } = useSelector((state: WithStorageState) => state[reducerPath])
  const dispatch = useDispatch()

  const updateExpertMode = useCallback(
    (expertMode: boolean) => {
      dispatch(actions.updateExpertMode({ expertMode }))
    },
    [actions, dispatch]
  )

  const updateSlippageTolerance = useCallback(
    (slippageTolerance: number) => {
      dispatch(actions.updateSlippageTolerance({ slippageTolerance }))
    },
    [actions, dispatch]
  )

  const updateSlippageToleranceType = useCallback(
    (slippageToleranceType: 'auto' | 'custom') => {
      dispatch(actions.updateSlippageToleranceType({ slippageToleranceType }))
    },
    [actions, dispatch]
  )

  const updateMaxFeePerGas = useCallback(
    (maxFeePerGas: number | string | undefined) => {
      dispatch(actions.updateMaxFeePerGas({ maxFeePerGas }))
    },
    [actions, dispatch]
  )

  const updateMaxPriorityFeePerGas = useCallback(
    (maxPriorityFeePerGas: number | string | undefined) => {
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

  const updateGasType = useCallback(
    (gasType: 'preset' | 'custom') => {
      dispatch(actions.updateGasType({ gasType }))
    },
    [actions, dispatch]
  )

  return [
    settings,
    {
      updateExpertMode,
      updateSlippageTolerance,
      updateSlippageToleranceType,
      updateMaxFeePerGas,
      updateMaxPriorityFeePerGas,
      updateGasPrice,
      updateGasType,
    },
  ]
}
