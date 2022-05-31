import { AddressZero } from '@ethersproject/constants'
import { Token } from '@sushiswap/core-sdk'
import { useStore } from 'app/features/miso/context/store/index'
import { StoreSlice, TokenSetup, TokenType } from 'app/features/miso/context/types'
import { useToken } from 'app/hooks/Tokens'
import { useMemo } from 'react'

export interface ITokenDetails {
  tokenType: TokenType
  tokenSetupType: TokenSetup
  tokenAddress: string
  tokenName: string
  tokenSymbol: string
  tokenSupply: number | null
  tokenAmount: number | null
}

export const tokenDetailsDefaultValues = {
  tokenType: TokenType.FIXED,
  tokenSetupType: TokenSetup.NOT_SET,
  tokenAddress: '',
  tokenAmount: null,
  tokenName: '',
  tokenSymbol: '',
  tokenSupply: null,
}

interface ITokenDetailsSlice extends ITokenDetails {
  setTokenDetails: (_: ITokenDetails) => void
}

export const createTokenDetailsSlice: StoreSlice<ITokenDetailsSlice> = (set) => ({
  ...tokenDetailsDefaultValues,
  setTokenDetails: (newState) => set(() => newState),
})

export const useAuctionedToken = () => {
  const { tokenSymbol, tokenName, tokenAddress, tokenSetupType } = useStore(
    ({ tokenSymbol, tokenName, tokenAddress, tokenSetupType }) => ({
      tokenSymbol,
      tokenName,
      tokenAddress,
      tokenSetupType,
    })
  )

  const providedToken = useToken(tokenSetupType === TokenSetup.PROVIDE ? tokenAddress : undefined)
  const createdToken = useMemo(() => new Token(1, AddressZero, 18, tokenSymbol, tokenName), [tokenName, tokenSymbol])
  return tokenSetupType === TokenSetup.PROVIDE ? providedToken : createdToken
}
