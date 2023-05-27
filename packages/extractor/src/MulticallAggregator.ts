import { Abi, Narrow } from 'abitype'
import { Address, PublicClient } from 'viem'
import { Contract, MulticallContracts } from 'viem/dist/types/types/multicall'

// aggregates several calls in one multicall
export class MultiCallAggregator {
  client: PublicClient
  pendingCalls: MulticallContracts<Contract[]> = []
  pendingResolves: ((any) => void)[]
  pendingRejects: ((any) => void)[]
  timer?: NodeJS.Timeout

  constructor(client: PublicClient) {
    this.client = client
  }

  // aggregate several calls in one multicall
  async call<FunctionRetType>(
    address: Address,
    abi: Abi,
    functionName: string,
    args?: unknown[]
  ): Promise<FunctionRetType> {
    this.sheduleMulticall()
    this.pendingCalls.push({
      address,
      abi,
      functionName,
      args,
    })
    return new Promise<FunctionRetType>((resolve, reject) => {
      this.pendingResolves.push(resolve)
      this.pendingRejects.push(reject)
    })
  }

  sheduleMulticall() {
    if (this.timer === undefined) {
      this.timer = setTimeout(async () => {
        this.timer = undefined
        const pendingCalls = this.pendingCalls
        const pendingResolves = this.pendingResolves
        const pendingRejects = this.pendingRejects
        this.pendingCalls = []
        this.pendingResolves = []
        this.pendingRejects = []
        const res = await this.client.multicall({
          allowFailure: true,
          contracts: pendingCalls.map((c) => ({
            address: c.address,
            abi: c.abi,
            functionName: c.functionName,
            args: c.args as Narrow<readonly unknown[] | undefined>,
          })),
        })
        res.forEach((r, i) => {
          if (r.status == 'success') pendingResolves[i](r.result)
          else pendingRejects[i](r.error)
        })
      }, 0)
    }
  }
}
