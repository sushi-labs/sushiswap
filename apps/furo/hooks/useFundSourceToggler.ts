import { useCallback, useMemo, useState } from 'react'

export enum FundSource {
  WALLET,
  BENTOBOX,
}

export const useFundSourceToggler = () => {
  const [fundSource, setFundSource] = useState<FundSource>(FundSource.WALLET)

  const toggle = useCallback(() => {
    setFundSource((prevState) => (prevState === FundSource.BENTOBOX ? FundSource.WALLET : FundSource.BENTOBOX))
  }, [])

  return useMemo(
    () => ({
      value: fundSource,
      fromWallet: fundSource === FundSource.WALLET,
      fromBentobox: fundSource === FundSource.BENTOBOX,
      toggle,
    }),
    [fundSource, toggle],
  )
}
