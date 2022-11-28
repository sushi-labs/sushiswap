import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getBase, getPools } from '../../lib/api'

export default async (request: VercelRequest, response: VercelResponse) => {
  const amount = request.query.amount as string

  const gasPrice = request.query.gasPrice as string

  const srcChainId = request.query.srcChainId as string
  const srcToken = request.query.srcToken as string

  const dstChainId = request.query.dstChainId as string
  const dstToken = request.query.dstToken as string

  const protocolsArg = request.query.protocols as string

  const protocols = protocolsArg ? protocolsArg.split(',') : ['SushiSwap']

  const [base, srcPairs, dstPairs] = await Promise.all(
    [
      getBase(srcChainId, [srcToken, dstToken], protocols),
      getPools(srcChainId, srcToken, protocols),
      getPools(srcChainId, dstToken, protocols)
  ])
    

  // TODO: Ilya

  // Until tines is wired up, temporarily return the pool results for testing an development purposes
  return response.status(200).json({base, srcPairs, dstPairs})
}
