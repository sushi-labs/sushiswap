import { Amount, tryParseAmount, Type } from '@sushiswap/currency'
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useMemo, useState } from 'react'

import { KashiPair } from '../.graphclient'
import { useTokensFromKashiPair } from '../lib/hooks'

interface BorrowContext {
  collateralValue: string
  collateralAsEntity: Amount<Type> | undefined
  setCollateralValue: Dispatch<SetStateAction<string>>
  borrowValue: string
  borrowAsEntity: Amount<Type> | undefined
  setBorrowValue: Dispatch<SetStateAction<string>>
}

const BorrowContext = createContext<BorrowContext | undefined>(undefined)

interface PoolsProvider {
  pair: KashiPair
  children?: ReactNode
}

export const BorrowProvider: FC<PoolsProvider> = ({ children, pair }) => {
  const { asset, collateral } = useTokensFromKashiPair(pair)

  const [collateralValue, setCollateralValue] = useState<string>('')
  const collateralAsEntity = useMemo(() => {
    return tryParseAmount(collateralValue, collateral)
  }, [collateral, collateralValue])

  const [borrowValue, setBorrowValue] = useState<string>('')
  const borrowAsEntity = useMemo(() => {
    return tryParseAmount(borrowValue, asset)
  }, [asset, borrowValue])

  return (
    <BorrowContext.Provider
      value={{
        collateralValue,
        setCollateralValue,
        collateralAsEntity,
        borrowAsEntity,
        borrowValue,
        setBorrowValue,
      }}
    >
      {children}
    </BorrowContext.Provider>
  )
}

export const useBorrowContext = () => {
  const context = useContext(BorrowContext)
  if (!context) {
    throw new Error('Hook can only be used inside Borrow Context')
  }

  return context
}
