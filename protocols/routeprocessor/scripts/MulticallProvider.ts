import { ContractCallContext, ContractCallResults, Multicall } from 'ethereum-multicall'
import { BigNumber, ethers } from 'ethers'

export class MultiCallProvider {
  multicall: Multicall
  prepairingCallcontext?: ContractCallContext[]
  prepairingCall?: Promise<ContractCallResults>
  nextSeriaId = 0

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

  async multiContractCall(contracts: string[], abi: any[], method: string, methodParameters: any): Promise<any[]> {
    if (contracts.length == 0) return []

    const seria = '' + this.nextSeriaId++
    const getReservesCalls: ContractCallContext[] = contracts.map((contract, i) => ({
      reference: `${seria}_${i}`,
      contractAddress: contract,
      abi,
      calls: [{ reference: '', methodName: method, methodParameters }],
    }))
    const { results }: ContractCallResults = await this.call(getReservesCalls) // can be mixed with other calls
    const res = new Array(contracts.length)
    for (const r in results) {
      const [elementSeria, index] = r.split('_')
      if (elementSeria !== seria || index == undefined) continue

      const retContext = results[r].callsReturnContext[0]
      res[parseInt(index)] = retContext.success ? retContext.returnValues : undefined
    }
    return res
  }

  async multiDataCall(contract: string, abi: any[], method: string, methodParameters: any[]): Promise<any[]> {
    const seria = '' + this.nextSeriaId++
    const getReservesCalls: ContractCallContext[] = methodParameters.map((data, i) => ({
      reference: `${seria}_${i}`,
      contractAddress: contract,
      abi,
      calls: [{ reference: '', methodName: method, methodParameters: methodParameters[i] }],
    }))
    const { results }: ContractCallResults = await this.call(getReservesCalls) // can be mixed with other calls
    const res = new Array(methodParameters.length)
    for (const r in results) {
      const [elementSeria, index] = r.split('_')
      if (elementSeria !== seria || index == undefined) continue

      const retContext = results[r].callsReturnContext[0]
      res[parseInt(index)] = retContext.success ? retContext.returnValues : undefined
    }
    return res
  }
}

export function convertToNumbers(arr: any[]): number[] {
  return arr.map((a) => {
    if (a === undefined) return 0
    return parseInt(a[0].hex, 16)
  })
}

const ZERO = BigNumber.from(0)
export function convertToBigNumberPair(arr: any[]): [BigNumber, BigNumber][] {
  return arr.map((a) => {
    if (a === undefined) return [ZERO, ZERO]
    return [BigNumber.from(a[0].hex), BigNumber.from(a[1].hex)]
  })
}
