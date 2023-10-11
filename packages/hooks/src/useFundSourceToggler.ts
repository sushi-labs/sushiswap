import { useCallback, useMemo, useState } from 'react'

export enum FundSource {
  WALLET = 'WALLET',
  BENTOBOX = 'BENTOBOX',
}

export const useFundSourceToggler = (initialValue?: FundSource) => {
  const [fundSource, setFundSource] = useState<FundSource | undefined>(
    initialValue,
  )

  const toggle = useCallback(() => {
    setFundSource((prevState) =>
      prevState === FundSource.BENTOBOX
        ? FundSource.WALLET
        : FundSource.BENTOBOX,
    )
  }, [])

  return useMemo(
    () => ({
      value: fundSource,
      fromWallet: fundSource === FundSource.WALLET,
      fromBentobox: fundSource === FundSource.BENTOBOX,
      toggle,
      setValue: setFundSource,
    }),
    [fundSource, toggle],
  )
}
