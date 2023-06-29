export type SavedToken = {
  id: string
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  status: 'UNKNOWN' | 'APPROVED' | 'DISAPPROVED'
}
