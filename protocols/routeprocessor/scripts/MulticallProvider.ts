import { ContractCallContext, ContractCallResults, Multicall } from 'ethereum-multicall'
import { BigNumber, ethers } from 'ethers'

interface SeriaCall {
  contract: string
  abi: any[]
  method: string
  methodParameters: any
}

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

  async seriaCall(calls: SeriaCall[]): Promise<any[]> {
    const seria = '' + this.nextSeriaId++
    const getReservesCalls: ContractCallContext[] = calls.map((call, i) => ({
      reference: `${seria}_${i}`,
      contractAddress: call.contract,
      abi: call.abi,
      calls: [{ reference: '', methodName: call.method, methodParameters: call.methodParameters }],
    }))
    const { results }: ContractCallResults = await this.call(getReservesCalls) // can be mixed with other calls
    const res = new Array(calls.length)
    for (const r in results) {
      const [elementSeria, index] = r.split('_')
      if (elementSeria !== seria || index == undefined) continue

      const retContext = results[r].callsReturnContext[0]
      res[parseInt(index)] = retContext.success ? retContext.returnValues : undefined
    }
    return res
  }

  async multiContractCall(contracts: string[], abi: any[], method: string, methodParameters: any): Promise<any[]> {
    if (contracts.length == 0) return []

    return await this.seriaCall(
      contracts.map((contract) => ({
        contract,
        abi,
        method,
        methodParameters,
      }))
    )
  }

  async multiDataCall(contract: string, abi: any[], method: string, methodParameters: any[]): Promise<any[]> {
    return await this.seriaCall(
      methodParameters.map((data) => ({
        contract,
        abi,
        method,
        methodParameters: data,
      }))
    )
  }
}

export function convertToNumbers(arr: any[]): (number | undefined)[] {
  return arr.map((a) => {
    if (a === undefined) return undefined
    return parseInt(a[0].hex, 16)
  })
}

export function convertToBigNumber(arr: any[]): (BigNumber | undefined)[] {
  return arr.map((a) => {
    if (a === undefined) return undefined
    return BigNumber.from(a[0].hex)
  })
}

export function convertToBigNumberPair(arr: any[]): ([BigNumber, BigNumber] | undefined)[] {
  return arr.map((a) => {
    if (a === undefined) return undefined
    return [BigNumber.from(a[0].hex), BigNumber.from(a[1].hex)]
  })
}
