import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Token } from './tokenType'

export interface coinType {
  type: string
  data: any
}

export async function getTokenData(token: Token) {
  console.log(token)
  const { account, network } = useWallet()
  let tokenData: any
  if (account?.address && token) {
    const res = await fetch(
      `https://fullnode.${network?.name?.toLowerCase()}.aptoslabs.com/v1/accounts/${account?.address}/resources`
    )
    const data = await res.json()
    if (!data.error_code) {
      tokenData = data?.filter((coin: coinType) => {
        return coin?.type.includes(token.address)
      })
    }
  }
  console.log(tokenData)
  if (tokenData && tokenData[0]?.data?.coin) return tokenData[0]?.data?.coin?.value
  return 0
}
