export interface Chain {
  name: string
  chain: string
  icon?: string | null
  rpc?: (string | null)[] | null
  faucets?: (string | null)[] | null
  nativeCurrency: NativeCurrency
  infoURL: string
  shortName: string
  chainId: number
  networkId: number
  slip44?: number | null
  ens?: Ens | null
  explorers?: (ExplorersEntity | null)[] | null
  title?: string | null
  parent?: Parent | null
  network?: string | null
}
export interface NativeCurrency {
  name: string
  symbol: string
  decimals: number
}
export interface Ens {
  registry: string
}
export interface ExplorersEntity {
  name: string
  url: string
  standard: string
  icon?: string | null
}
export interface Parent {
  type: string
  chain: string
  bridges?: BridgesEntity[] | null
}
export interface BridgesEntity {
  url: string
}
