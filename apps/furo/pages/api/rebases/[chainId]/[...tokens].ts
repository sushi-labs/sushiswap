import { isAddress } from '@ethersproject/address'
import type { Rebase as RebaseDTO } from '@sushiswap/graph-client'
import { getRebases } from 'lib'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, tokens } = req.query
  const rebases = (await getRebases(
    chainId as string,
    (tokens as string[]).filter((token) => isAddress(token)).map((token) => token.toLowerCase())
  )) as RebaseDTO[]
  res.status(200).send(rebases)
}
