import { listTypes } from './index'

type Token = {
  address: string
  chainId: number
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

type List = {
  name: string
  timestamp: string
  version?: {
    major: number
    minor: number
    patch: number
  }
  tags: Object
  logoURI: string
  keywords: string[]
  tokens: Token[]
}

interface Lists {
  default: List
  networks: Record<string, Record<string, List>>
}
