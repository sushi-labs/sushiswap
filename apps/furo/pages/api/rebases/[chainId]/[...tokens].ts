import { isAddress } from '@ethersproject/address'
import type { NextApiRequest, NextApiResponse } from 'next'

import type { Rebase as RebaseDTO } from '../../../../.graphclient'
import { getRebases } from '../../../../lib'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, tokens } = req.query
  const rebases = (await getRebases(
    chainId as string,
    (tokens as string[]).filter((token) => isAddress(token)).map((token) => token.toLowerCase())
  )) as RebaseDTO[]
  res.status(200).send(rebases)
}
