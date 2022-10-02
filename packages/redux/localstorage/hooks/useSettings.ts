import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { StorageContext } from '../context'
import { GasPrice, StorageState, WithStorageState } from '../types'

type UseSettingsReturn = [
  Omit<StorageState, 'customTokens'>,
  {
    updateCarbonOffset(carbonOffset: boolean): void
    updateSlippageTolerance(slippageTolerance: number): void
    updateSlippageToleranceType(slippageToleranceType: 'auto' | 'custom'): void
    updateMaxFeePerGas(updateMaxFeePerGas: number | string | undefined): void
    updateMaxPriorityFeePerGas(maxPriorityFeePerGas: number | string | undefined): void
    updateGasPrice(gasPrice: GasPrice): void
    updateGasType(gasType: 'preset' | 'custom'): void
    updateExpertMode(expertMode: boolean): void
    updateSushiGuard(sushiGuard: boolean): void
    updateTransactionDeadline(deadline: number): void
  }
]

type UseSettings = (context: StorageContext) => UseSettingsReturn

export const useSettings: UseSettings = (context) => {
  const { reducerPath, actions } = context
  const { customTokens, ...settings } = useSelector((state: WithStorageState) => state[reducerPath])
  const dispatch = useDispatch()

  const updateCarbonOffset = useCallback(
    (carbonOffset: boolean) => {
      dispatch(actions.updateCarbonOffset({ carbonOffset }))
    },
    [actions, dispatch]
  )

  const updateExpertMode = useCallback(
    (expertMode: boolean) => {
      dispatch(actions.updateExpertMode({ expertMode }))
    },
    [actions, dispatch]
  )

  const updateSushiGuard = useCallback(
    (sushiGuard: boolean) => {
      dispatch(actions.updateSushiGuard({ sushiGuard }))
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

  const updateTransactionDeadline = useCallback(
    (transactionDeadline: number) => {
      dispatch(actions.updateTransactionDeadline({ transactionDeadline }))
    },
    [actions, dispatch]
  )

  return [
    settings,
    {
      updateCarbonOffset,
      updateExpertMode,
      updateSushiGuard,
      updateSlippageTolerance,
      updateSlippageToleranceType,
      updateMaxFeePerGas,
      updateMaxPriorityFeePerGas,
      updateGasPrice,
      updateGasType,
      updateTransactionDeadline,
    },
  ]
}
