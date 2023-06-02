import { Abi, Narrow } from 'abitype'
import { Address, PublicClient } from 'viem'
import { Contract, MulticallContracts } from 'viem/dist/types/types/multicall'

const getBlockNumberAbi: Abi = [
  {
    inputs: [],
    name: 'getBlockNumber',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]

// aggregates several calls in one multicall
export class MultiCallAggregator {
  client: PublicClient
  pendingCalls: MulticallContracts<Contract[]> = []
  pendingResolves: ((arg: any) => void)[] = []
  pendingRejects: ((arg: unknown) => void)[] = []
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
  ): Promise<{ blockNumber: number; returnValue: FunctionRetType }> {
    this.sheduleMulticall()
    this.pendingCalls.push({
      address,
      abi,
      functionName,
      args,
    })
    return new Promise<{ blockNumber: number; returnValue: FunctionRetType }>((resolve, reject) => {
      this.pendingResolves.push(resolve)
      this.pendingRejects.push(reject)
    })
  }

  async callContractSameBlock(
    address: Address,
    abi: Abi,
    functions: [string, unknown[] | undefined][]
  ): Promise<{ blockNumber: number; returnValues: unknown[] }> {
    if (functions.length == 0) return { blockNumber: -1, returnValues: [] }
    this.sheduleMulticall()
    const res = await Promise.all(functions.map(([name, args]) => this.call(address, abi, name, args)))
    return { blockNumber: res[0].blockNumber, returnValues: res.map(({ returnValue }) => returnValue) }
  }

  async callSameBlock(
    calls: MulticallContracts<Contract[]>
  ): Promise<{ blockNumber: number; returnValues: unknown[] }> {
    if (calls.length == 0) return { blockNumber: -1, returnValues: [] }
    this.sheduleMulticall()
    const res = await Promise.all(
      calls.map(({ address, abi, functionName, args }) => this.call(address, abi, functionName, args as unknown[]))
    )
    return { blockNumber: res[0].blockNumber, returnValues: res.map(({ returnValue }) => returnValue) }
  }

  async sheduleMulticall() {
    if (this.timer === undefined) {
      this.timer = setTimeout(async () => {
        this.timer = undefined
        const pendingCalls = this.pendingCalls
        const pendingResolves = this.pendingResolves
        const pendingRejects = this.pendingRejects
        this.pendingCalls = []
        this.pendingResolves = []
        this.pendingRejects = []
        pendingCalls.unshift({
          address: this.client.chain?.contracts?.multicall3?.address as Address,
          abi: getBlockNumberAbi,
          functionName: 'getBlockNumber',
        })
        const res = await this.client.multicall({
          allowFailure: true,
          contracts: pendingCalls.map((c) => ({
            address: c.address,
            abi: c.abi,
            functionName: c.functionName,
            args: c.args as Narrow<readonly unknown[] | undefined>,
          })),
        })
        if (res[0].status !== 'success') {
          // getBlockNumber Failed
          for (let i = 1; i < res.length; ++i) pendingRejects[i](res[0].error)
        } else {
          const blockNumber = res[0].result as number
          for (let i = 1; i < res.length; ++i) {
            if (res[i].status == 'success') pendingResolves[i]({ blockNumber, resultValue: res[i].result })
            else pendingRejects[i](res[i].error)
          }
        }
      }, 0)
    }
  }
}
