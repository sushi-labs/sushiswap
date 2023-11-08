import { SupportedNetwork, chains } from 'config/chains'
import { Token } from './tokenType'

export interface CoinType {
  type: string
  data: any
}

interface GetTokenData {
  token: Token
  account: string
  network: SupportedNetwork
}

export async function getTokenData({ token, account, network }: GetTokenData) {
  let tokenData

  const res = await fetch(
    `${chains[network].api.fetchUrlPrefix}/v1/accounts/${account}/resources`,
  )
  const data = await res.json()

  if (!data.error_code) {
    tokenData = data?.filter((coin: CoinType) => {
      return coin?.type.includes(token.address)
    })
  }

  if (tokenData?.[0]?.data?.coin) return tokenData[0]?.data?.coin?.value

  return 0
}
