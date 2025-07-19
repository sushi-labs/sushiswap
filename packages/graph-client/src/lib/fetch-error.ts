import type { ChainId } from 'sushi'

export class FetchError extends Error {
  public override name: string
  public chainId: ChainId

  constructor(chainId: ChainId, message: string) {
    super(message)

    this.name = 'FetchError'
    this.chainId = chainId
  }
}
