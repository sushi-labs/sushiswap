import { Amount, Share, tryParseAmount, Type } from '@sushiswap/currency'
import { abi } from '@sushiswap/kashi/artifacts/contracts/KashiPair.sol/KashiPair.json'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useMemo, useState } from 'react'
import { useAccount, useContractReads } from 'wagmi'

import { useTokensFromKashiPair } from '../lib/hooks'

interface BorrowContext {
  collateralValue: string
  collateralAsEntity: Amount<Type> | undefined
  setCollateralValue: Dispatch<SetStateAction<string>>
  borrowValue: string
  borrowAsEntity: Amount<Type> | undefined
  userCollateralShare: Share<Type> | undefined
  userBorrowPart: Share<Type> | undefined
  setBorrowValue: Dispatch<SetStateAction<string>>
}

const BorrowContext = createContext<BorrowContext | undefined>(undefined)

interface PoolsProvider {
  pair: KashiMediumRiskLendingPairV1
  children?: ReactNode
}

export const BorrowProvider: FC<PoolsProvider> = ({ children, pair }) => {
  const { address } = useAccount()
  const { asset, collateral } = useTokensFromKashiPair(pair)

  const { data } = useContractReads({
    contracts: [
      {
        addressOrName: pair.id,
        contractInterface: abi,
        functionName: 'userCollateralShare',
        args: [address],
      },
      {
        addressOrName: pair.id,
        contractInterface: abi,
        functionName: 'userBorrowPart',
        args: [address],
      },
    ],
    enabled: !!address,
  })

  console.log(data?.[0]?.toString(), data?.[1]?.toString())

  const userCollateralShare = useMemo(() => {
    return Share.fromRawShare(collateral, data ? data?.[0]?.toString() : 0)
  }, [collateral, data])

  const userBorrowPart = useMemo(() => {
    return Share.fromRawShare(asset, data ? data?.[1]?.toString() : 0)
  }, [asset, data])

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
        userCollateralShare,
        userBorrowPart,
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
