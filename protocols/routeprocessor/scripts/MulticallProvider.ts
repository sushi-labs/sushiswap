import { ContractCallContext, ContractCallResults, Multicall } from 'ethereum-multicall'
import { ethers } from 'ethers'

export class MultiCallProvider {
  multicall: Multicall
  prepairingCallcontext?: ContractCallContext[]
  prepairingCall?: Promise<ContractCallResults>

  constructor(chainDataProvider: ethers.providers.BaseProvider) {
    this.multicall = new Multicall({ ethersProvider: chainDataProvider, tryAggregate: true })
  }

  // aggregate several multicalls in one
  async call(inp: ContractCallContext[]): Promise<ContractCallResults> {
    //console.log('Multicall order', inp.length)
    if (!this.prepairingCallcontext) {
      this.prepairingCallcontext = inp
      this.prepairingCall = new Promise<ContractCallResults>((res, _rej) => {
        setTimeout(async () => {
          //console.log('Multicall call', this.prepairingCallcontext?.length)
          const input = this.prepairingCallcontext as ContractCallContext[]
          this.prepairingCallcontext = undefined
          this.prepairingCall = undefined
          res(await this.multicall.call(input))
        }, 0)
      })
    } else {
      this.prepairingCallcontext = this.prepairingCallcontext.concat(inp)
    }
    return this.prepairingCall as Promise<ContractCallResults>
  }
}
