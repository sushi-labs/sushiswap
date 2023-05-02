import { Interface } from '@ethersproject/abi'
import { BigNumber, Contract } from 'ethers'
import { ethers } from 'hardhat'
import { Chain, PublicClient, Transport } from 'viem'

// Substitutes viem's multicall in viem's client with ether
// usage: await switchMulticallToEthers(client)
export async function switchMulticallToEthers<
  TTransport extends Transport,
  TChain extends Chain | undefined = undefined
>(client: PublicClient<TTransport, TChain, true>) {
  //const oldFunction = client.multicall
  const [user] = await ethers.getSigners()
  const multicallContract = new Contract(
    '0xca11bde05977b3631167028862be2a173976ca11',
    [
      'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)',
    ],
    user
  )
  client.multicall = async (arg: any) => {
    const ifaces: Interface[] = []
    const calls = arg.contracts.map((call: any, i: number) => {
      const iface = new ethers.utils.Interface(call.abi)
      ifaces[i] = iface
      const callData = iface.encodeFunctionData(call.functionName, call.args)
      return {
        target: call.address,
        allowFailure: arg.allowFailure,
        callData,
      }
    })

    const result0 = await multicallContract.callStatic.aggregate3(calls, { gasLimit: 1_000_000_000 })
    const result = result0.map((res: any, i: number) => {
      try {
        const result0 = ifaces[i].decodeFunctionResult(arg.contracts[i].functionName, res.returnData)
        let result = []
        for (let i = 0; i < result0.length; ++i) {
          if (result0[i] === undefined) continue
          result[i] = result0[i] instanceof BigNumber ? result0[i].toBigInt() : result0[i]
        }
        if (result.length == 1) result = result[0]
        return {
          result,
          status: res.success ? 'success' : 'failure',
        }
      } catch (e) {
        return {
          result: undefined,
          status: 'failure',
        }
      }
    })

    // correctness check
    // const etalon = await oldFunction(arg)
    // if (etalon.length !== result.length) console.error('Length wrong')
    // etalon.forEach((e: any, j: number) => {
    //   const r = result[j]
    //   if (e.status !== r.status) console.error('Status wrong', j, e, r)
    //   if (e.result instanceof Array) {
    //     e.result.forEach((a, i) => {
    //       if (a !== r.result[i]) console.error('Result wrong 1', j, i, e, r)
    //     })
    //   } else if (e.result !== r.result) console.error('Result wrong 0', j, e, r)
    // })

    return result
  }
}
