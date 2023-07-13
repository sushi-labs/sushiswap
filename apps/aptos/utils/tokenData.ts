import { useSwapActions, useSwapState } from 'app/swap/trade/TradeProvider'
import { useEffect, useMemo } from 'react'
import { payloadArgs } from './payloadUtil'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { ToastContent, toast } from 'react-toastify'
import { Network, Provider } from 'aptos'
import { createToast } from 'components/toast'
import { Token } from './tokenType'

export interface coinType {
  type: string
  data: any
}
// const { setError } = useSwapActions()

export async function getTokenData(token: Token) {
  console.log(token)
  const { account, connected, network } = useWallet()
  let tokenData: any
  if (account?.address && token) {
    const res = await fetch(
      `https://fullnode.${network?.name?.toLowerCase()}.aptoslabs.com/v1/accounts/${account?.address}/resources`
    )
    // .then((res) => res.json())
    const data = await res.json()
    // .then((data) => {
    if (!data.error_code) {
      tokenData = data?.filter((coin: coinType) => {
        return coin?.type.includes(token.address)
      })
      // const tokenData1 = data?.filter((coin: coinType) => {
      //   return coin?.type.includes(token1.address)
      // })
      // setBalance0(tokenData[0]?.data?.coin?.value)
      // setBalance1(tokenData1[0]?.data?.coin?.value)
      // setLoadingPrice(false)
      // return useMemo(() => {
      //   return tokenData
      // }, [token0, token1, isTransactionPending, connected])
    }
    // })
  }
  console.log(tokenData)
  if (tokenData && tokenData[0]?.data?.coin) return tokenData[0]?.data?.coin?.value
  return 0
  // return useMemo(() => {
  //   return tokenData
  // }, [token])
}
