export interface Oracle {
  chainId: number
  address: string
  data: string
  name: string
}

export abstract class Oracle implements Oracle {
  chainId
  address
  data
  name
  warning = ''
  error = ''
  // @ts-ignore TYPE NEEDS FIXING
  constructor(chainId: number, address: string, name: string, data: string) {
    this.chainId = chainId
    this.address = address
    this.data = data
    this.name = name
  }
}
